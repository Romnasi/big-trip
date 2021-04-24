import PointView from './../view/point.js';
import PointEditView from './../view/point-edit.js';
import {render, RenderPosition, replace, remove} from './../utils/render.js';


export default class Point {
  constructor(pointListComponent, changeData) {
    this._pointListComponent = pointListComponent;
    this._changeData = changeData;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }


  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._pointListComponent.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._pointListComponent.getElement().contains(prevPointEditComponent.getElement())) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }


  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }


  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }


  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }


  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }


  _handleEditClick() {
    this._replacePointToForm();
  }


  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }


  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }
}
