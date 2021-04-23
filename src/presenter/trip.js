import TripView from './../view/trip.js';
import SortView from './../view/sort.js';
import TripListView from './../view/trip-list.js';
import CreationPointView from './../view/creation-point.js';
import PointEditView from './../view/point-edit.js';
import PointView from './../view/trip-point.js';
import NoPointView from './../view/no-point.js';
import {render, RenderPosition, replace} from './../utils/render.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._tripComponent = new TripView();
    this._sortComponent = new SortView();
    this._tripListComponent = new TripListView();
    this._noPointComponent = new NoPointView();
  }


  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    render(this._tripContainer, this._tripComponent, RenderPosition.BEFOREEND);
    render(this._tripComponent, this._tripListComponent, RenderPosition.BEFOREEND);

    this._renderTrip();
  }


  _renderSort() {
    render(this._tripComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }


  _renderCreationPoint() {
    const creationPointComponent = new CreationPointView();
    render(this._tripListComponent, creationPointComponent, RenderPosition.BEFOREEND);
  }


  _renderPoint(point) {
    const pointComponent = new PointView(point);
    const pointEditComponent = new PointEditView(point);

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };


    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };


    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };


    pointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });


    pointEditComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(this._tripListComponent, pointComponent, RenderPosition.BEFOREEND);
  }


  _renderPoints(from, to) {
    this._tripPoints
      .slice(from, to)
      .forEach((tripPoint) => this._renderPoint(tripPoint));
  }


  _renderNoPoints() {
    render(this._tripComponent, this._noPointComponent, RenderPosition.BEFOREEND);
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
