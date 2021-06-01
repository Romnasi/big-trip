import TripView from './../view/trip.js';
import SortView from './../view/sort.js';
import PointListView from './../view/point-list.js';
import LoadingView from './../view/loading.js';
import NoPointView from './../view/no-point.js';
import TripInfoView from './../view/trip-info.js';
import TripCostView from './../view/trip-cost.js';

import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {render, RenderPosition, remove} from './../utils/render.js';
import {sortByDateUp, sortByPriceDown, sortByTimeDown} from './../utils/sort.js';
import {filter} from './../utils/filter.js';
import {SortType, UpdateType, UserAction} from './../const.js';


export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, store, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._store = store;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._tripInfoComponent = null;
    this._tripCostComponent = null;

    this._tripComponent = new TripView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }


  init() {
    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    render(this._tripComponent, this._pointListComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }


  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._pointListComponent);
    remove(this._tripComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }


  createPoint(callback, store = this._store) {
    this._pointNewPresenter.init(callback, store);
  }


  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredPoints.sort(sortByDateUp);
      case SortType.TIME:
        return filtredPoints.sort(sortByTimeDown);
      case SortType.PRICE:
        return filtredPoints.sort(sortByPriceDown);
    }

    return filtredPoints;
  }


  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.RESETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }


  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data, this._store.getOffers(), this._store.getDestinations());
        this._clearMenuInfo();
        this._renderMenuInfo();
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearTrip();
    this._renderTrip();
  }


  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    const offers = this._store.getOffers();
    const destinations = this._store.getDestinations();

    pointPresenter.init(point, offers, destinations);
    this._pointPresenter[point.id] = pointPresenter;
  }


  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }


  _renderLoading() {
    render(this._tripComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }


  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.BEFOREEND);
  }


  _clearMenuInfo() {
    remove(this._tripInfoComponent);
    remove(this._tripCostComponent);
  }


  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._noPointComponent);

    this._clearMenuInfo();

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _renderMenuInfo(points = this._getPoints().slice()) {
    if (this._tripInfoComponent) {
      this._tripInfoComponent = null;
    }

    if (this._tripCostComponent) {
      this._tripCostComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(points);
    this._tripCostComponent = new TripCostView(points);
    render(document.querySelector('.trip-main'), this._tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(this._tripInfoComponent, this._tripCostComponent, RenderPosition.BEFOREEND);
  }


  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints().slice();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
    this._renderMenuInfo(points);
  }
}
