import dayjs from 'dayjs';
import SmartView from './smart.js';
import {formatDate} from './../utils/date.js';
import {getDescByCity, getPhotosByCity} from './../utils/common.js';
import flatpickr from 'flatpickr';

import './../../node_modules/flatpickr/dist/flatpickr.min.css';

const defaultType = 'Flight';

const BLANK_POINT = {
  type: defaultType,
  city: null,
  description: null,
  destination: null,
  addedOffers: null,
  photos: null,
  date: {
    dateTo: dayjs().toDate(),
    dateFrom: dayjs().toDate(),
  },
  isFavorite: false,
  price: null,
  isNew: true,
};

const DATEPICKER_SETTINGS = {
  dateFormat: 'd/m/Y H:i',
  enableTime: true,
};


const getPhotoList = (photos, isPhotos) => {
  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${isPhotos ? photos.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('') : '' }
    </div>
  </div>`;
};


const checkOfferAdded = (currentName, addedOffers, isAddedOffers) => {
  return isAddedOffers
    ? Object.values(addedOffers).map(({title}) => title).includes(currentName)
    : false;
};


const getTypeOffers = (offerType, addedOffers, isAddedOffers, offers, isDisabled) => {
  const getNameWithoutSpace = (nameWithSpace) => {
    return nameWithSpace.toLowerCase().replace(/ /g, '-');
  };
  let nameWithoutSpace = '';

  return offers[offerType]
    ? Object.values(offers[offerType]).map(({title, price}) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
          id="${nameWithoutSpace = getNameWithoutSpace(title)}-1" type="checkbox"
          name="${nameWithoutSpace}" value="${title}" ${checkOfferAdded(title, addedOffers, isAddedOffers) ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="${nameWithoutSpace}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('')
    : '';
};


const getOfferList = (type, addedOffers, isOffers, isAddedOffers, offers, isDisabled) => {

  return offers[type]
    ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${getTypeOffers(type, addedOffers, isAddedOffers, offers, isDisabled)}
    </div>
  </section>`
    : '';
};


const getCityList = (cities) => cities.map((city) => `<option value="${city}">`).join('');


const createControlsPoint = (type, offers) => {
  let typeToLowerCase = '';

  return Object.keys(offers).map((currentType) => `<div class="event__type-item">
              <input id="event-type-${typeToLowerCase = currentType.toLowerCase()}-1"
                  class="event__type-input visually-hidden"
                  type="radio" name="event-type" value="${typeToLowerCase}"${currentType === type ? ' checked' : ''}>
              <label class="event__type-label  event__type-label--${typeToLowerCase}"
                  for="event-type-${typeToLowerCase}-1" data-control-type="${currentType}">${currentType}</label>
            </div>

            `).join('');
};


const createPointEditTemplate = (data, cities, offers) => {

  const {
    type,
    addedOffers,
    price,
    photos,
    city,
    description,
    isOffers,
    isAddedOffers,
    isPhotos,
    isDestination,
    isPrice,
    isNew,

    isDisabled,
    isSaving,
    isReseting,
    date: {
      dateTo,
      dateFrom,
    },
  } = data;

  let resetButtonText = '';
  if (isNew) {
    resetButtonText = isReseting ? 'Canceling...' : 'Cancel';
  } else (
    resetButtonText = isReseting ? 'Deleting...' : 'Delete'
  );


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"
              ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createControlsPoint(type, offers)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1"
              type="text" name="event-destination" value="${city ? city : ''}" list="destination-list-1"
              ${isDisabled ? 'disabled' : ''} required>
          <datalist id="destination-list-1">
            ${getCityList(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time"
              id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateTo)}"
              ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time"
              id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateFrom)}"
              ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1"
              type="number" min="0" name="event-price" value="${isPrice ? price : ''}"
              ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>

        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
          ${resetButtonText}
        </button>

        ${isNew ? '' : '<button class="event__rollup-btn" type="button">'}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${getOfferList(type, addedOffers, isOffers, isAddedOffers, offers, isDisabled)}
        ${isDestination
    ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            ${getPhotoList(photos, isPhotos)}
          </section>`
    : ''}
      </section>
    </form>
  </li>`;
};


export default class PointEdit extends SmartView {
  constructor(offers, destinations, point = BLANK_POINT) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._data = PointEdit.parsePointToData(point, this._offers);
    this._cities = Object.values(destinations).map(({name}) => name).slice();

    this._startDatepicker = null;
    this._endDatepicker = null;

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formResetClickHandler = this._formResetClickHandler.bind(this);
    this._typePointListHandler = this._typePointListHandler.bind(this);
    this._destinationListHandler = this._destinationListHandler.bind(this);
    this._addedOffersChangeHandler = this._addedOffersChangeHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }


  removeElement() {
    super.removeElement();

    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }


  reset(point, offers = this._offers) {
    this.updateData(
      PointEdit.parsePointToData(point, offers),
    );
  }


  getTemplate() {
    return createPointEditTemplate(this._data, this._cities, this._offers);
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setResetClickHandler(this._callback.resetClick);
  }


  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      Object.assign(
        {},
        DATEPICKER_SETTINGS,
        {
          onChange: this._startDateChangeHandler,
          defaultDate: this._data.date.dateTo,
        },
      ),
    );
  }


  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      Object.assign(
        {},
        DATEPICKER_SETTINGS,
        {
          onChange: this._endDateChangeHandler,
          defaultDate: this._data.date.dateFrom,
          minDate: this._data.date.dateTo,
        },
      ),
    );
  }


  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typePointListHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationListHandler);

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._changePriceHandler);

    if (this._data.isOffers) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('change', this._addedOffersChangeHandler);
    }
  }


  _typePointListHandler(evt) {
    evt.preventDefault();
    this.getElement()
      .querySelector(`#${evt.target.getAttribute('for')}`)
      .checked = true;
    const type = evt.target.dataset.controlType;

    this.updateData({
      type,
      addedOffers: null,
      isOffers: this._offers[type] !== null,
      isAddedOffers: false,
    });
  }


  _destinationListHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value;

    if (!this._cities.find((current) => current === city)) {
      evt.target.setCustomValidity('Выберите город из предложенного списка');
      return;
    }

    const description = getDescByCity(city, this._destinations);
    const photos = getPhotosByCity(city, this._destinations);

    this.updateData({
      city,
      description,
      destination: {
        name: city,
        description,
        pictures: photos,
      },
      photos,
      isDestination: description !== null && photos !== null,
      isPhotos: photos !== null,
    });
  }


  _startDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
        {},
        this._data.date,
        {
          dateTo: userDate,
        },
      ),
    });
  }


  _endDateChangeHandler([userDate]) {
    this.updateData({
      date: Object.assign(
        {},
        this._data.date,
        {
          dateFrom: userDate,
        },
      ),
    });
  }


  _formSubmitHandler(evt) {
    evt.preventDefault();
    if (this._data.isNew) {
      this._data.isNew = false;
    }

    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data, this._offers));
  }


  _changeAddedOffers(target) {
    const addedOffers = this._data.addedOffers ? this._data.addedOffers.slice() : [];

    if (!target.checked) {
      const index = addedOffers.map(({title}) => title.indexOf(target.value)).indexOf(0);
      addedOffers.splice(index, 1);
    } else {
      const currentOfferSet = {};
      this._offers[this._data.type].map(({title, price}) => currentOfferSet[title] = price);

      const clickedOffers = {
        title: target.value,
        price: currentOfferSet[target.value],
      };

      addedOffers.push(clickedOffers);
    }

    return addedOffers;
  }


  _addedOffersChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      addedOffers: this._changeAddedOffers(evt.target),
    },
    true,
    );
  }


  _changePriceHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10),
      isPrice: true,
    },
    true,
    );
  }


  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }


  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }


  _formResetClickHandler(evt) {
    this._callback.resetClick(evt);
  }


  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }


  setResetClickHandler(callback) {
    this._callback.resetClick = callback;
    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formResetClickHandler);
    }
  }


  static parsePointToData(point, offers) {
    const {type, addedOffers, photos, description, price, isNew} = point;

    return Object.assign(
      {},
      point,
      {
        isOffers: offers[type] !== null,
        isAddedOffers: addedOffers !== null,
        isPhotos: photos !== null,
        isDestination: description !== null && photos !== null,
        isPrice: price !== null,
        isNew: isNew ? isNew : false,

        isDisabled: false,
        isSaving: false,
        isReseting: false,
      },
    );
  }


  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isOffers;
    delete data.isAddedOffers;
    delete data.isPhotos;
    delete data.isPrice;
    delete data.isDestination;
    delete data.isNew;

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isReseting;

    return data;
  }
}
