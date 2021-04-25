import TripView from './../view/trip.js';
import SortView from './../view/sort.js';
import PointListView from './../view/point-list.js';
import CreationPointView from './../view/creation-point.js';
import NoPointView from './../view/no-point.js';
import PointPresenter from './point.js';
import {updateItem} from './../utils/common.js';
import {render, RenderPosition} from './../utils/render.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._tripComponent = new TripView();
    this._sortComponent = new SortView();
    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView();
    this._creationPointComponent = new CreationPointView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }


  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    render(this._tripComponent, this._pointListComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }


  _handleModeChange() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }


  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }


  _renderSort() {
    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
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


  _renderTrip() {
    if (this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderCreationPoint();
    this._renderPoints(0, this._tripPoints.length);
  }
}
