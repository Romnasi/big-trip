import TripView from './../view/trip.js';
import SortView from './../view/sort.js';
import PointListView from './../view/point-list.js';
import NoPointView from './../view/no-point.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import {render, RenderPosition, remove} from './../utils/render.js';
import {sortByDateUp, sortByPriceDown, sortByTimeDown} from './../utils/sort.js';
import {filter} from './../utils/filter.js';
import {SortType, UpdateType, UserAction} from './../const.js';
// import {SortType, UpdateType, UserAction, FilterType} from './../const.js';


export default class Trip {
  constructor(tripContainer, pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._tripComponent = new TripView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    // this._pointsModel.addObserver(this._handleModelEvent);
    // this._filterModel.addObserver(this._handleModelEvent);

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


  createPoint(callback) {
    // this._currentSortType = SortType.DAY;
    // this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.DATE:
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
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }


  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
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
      this._sortComponent == null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }


  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }


  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.BEFOREEND);
  }


  _clearTrip({resetSortType = false} = {}) {

    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _renderTrip() {
    const points = this._getPoints();
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points.slice());
  }
}
