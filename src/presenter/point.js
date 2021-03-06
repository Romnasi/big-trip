import PointView from './../view/point.js';
import PointEditView from './../view/point-edit.js';
import {isOnline} from './../utils/common.js';
import {render, RenderPosition, replace, remove} from './../utils/render.js';
import {UserAction, UpdateType} from './../const.js';
import {isDateEqual} from './../utils/date.js';
import {toast} from './../utils/toast.js';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  RESETING: 'RESETING',
  ABORTING: 'ABORTING',
};


export default class Point {
  constructor(pointListComponent, changeData, changeMode) {
    this._pointListComponent = pointListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleResetClick = this._handleResetClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }


  init(point, offers, destinations) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;
    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(offers, destinations, point);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setResetClickHandler(this._handleResetClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointListComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }


  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }


  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }


  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isReseting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.RESETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isReseting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
    }
  }


  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }


  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }


  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }


  _handleEditClick() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replacePointToForm();
  }


  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }


  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);

    const isMinorUpdate =
      !isDateEqual(this._point.date.dateTo, update.date.dateTo) ||
      !isDateEqual(this._point.date.dateFrom, update.date.dateFrom) ||
      !(this._point.price === update.price);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }


  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }


  _handleResetClick(evt) {
    evt.preventDefault();
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }
}
