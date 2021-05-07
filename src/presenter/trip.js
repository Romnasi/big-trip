import TripView from './../view/trip.js';
import SortView from './../view/sort.js';
import PointListView from './../view/point-list.js';
import CreationPointView from './../view/creation-point.js';
import NoPointView from './../view/no-point.js';
import PointPresenter from './point.js';
import {updateItem} from './../utils/common.js';
import {render, RenderPosition} from './../utils/render.js';
import {sortByDateUp, sortByPriceDown, sortByTimeDown} from './../utils/sort.js';
import {SortType} from './../const.js';


export default class Trip {
  constructor(tripContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripComponent = new TripView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._creationPointComponent = new CreationPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }


  init(tripPoints) {
    this._tripPoints = tripPoints.slice();
    this._sourcedTripPoints = tripPoints.slice();

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    render(this._tripComponent, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }


  _getPoints() {
    return this._pointsModel.getPoints();
  }


  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }


  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._tripPoints.sort(sortByDateUp);
        break;
      case SortType.TIME:
        this._tripPoints.sort(sortByTimeDown);
        break;
      case SortType.PRICE:
        this._tripPoints.sort(sortByPriceDown);
        break;
      default:
        this._tripPoints.sort(sortByDateUp);
    }

    this._currentSortType = sortType;
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);

    this._clearPointList();
    this._renderPointList();
  }


  _renderSort() {
    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }


  _renderCreationPoint() {
    render(this._pointListComponent, this._creationPointComponent, RenderPosition.BEFOREEND);
  }


  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }


  _renderPoints(from, to) {
    this._tripPoints
      .slice(from, to)
      .forEach((tripPoint) => this._renderPoint(tripPoint));
  }


  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.BEFOREEND);
  }


  _clearPointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }


  _renderPointList () {
    this._renderPoints(0, this._tripPoints.length);
  }


  _renderTrip() {
    if (this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPointList();
  }
}
