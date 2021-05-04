import SmartView from './smart.js';
import {offers} from './../mock/point-data.js';
import {destinations} from './../mock/point-data.js';
import {formatDate} from './../utils/format-date.js';
import {getDescByCity} from './../utils/common.js';
import {getPhotosByCity} from './../utils/common.js';


const getPhotoList = (photos, isPhotos) => {
  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${isPhotos ? photos.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('') : '' }
    </div>
  </div>`;
};


const checkOfferAdded = (currentName, addedOffers, isAddedOffers) => {
  return isAddedOffers
    ? Object.values(addedOffers).map(({name}) => name).includes(currentName)
    : false;
};


const getTypeOffers = (offerType, addedOffers, isAddedOffers) => {
  const getNameWithoutSpace = (nameWithSpace) => {
    return nameWithSpace.toLowerCase().replace(/ /g, '-');
  };
  let nameWithoutSpace = '';


  return offers[offerType]
    ? Object.values(offers[offerType]).map(({name, price}) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="${nameWithoutSpace = getNameWithoutSpace(name)}-1" type="checkbox" name="${nameWithoutSpace}" value="${name}" ${checkOfferAdded(name, addedOffers, isAddedOffers) ? 'checked' : ''}>
      <label class="event__offer-label" for="${nameWithoutSpace}-1">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('')
    : '';
};


const getOfferList = (type, addedOffers, isOffers, isAddedOffers) => {

  return offers[type]
    ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${getTypeOffers(type, addedOffers, isAddedOffers)}
    </div>
  </section>`
    : '';
};

const getCities = () => Object.values(destinations).map(({name}) => name).slice();
const cities = getCities();
const getCityList = () => cities.map((city) => `<option value="${city}">`).join('');
const cityList = getCityList();


const createControlsPoint = (type) => {
  let typeToLowerCase = '';

  return Object.keys(offers).map((currentType) => `<div class="event__type-item">
              <input id="event-type-${typeToLowerCase = currentType.toLowerCase()}-1" class="event__type-input visually-hidden"
                  type="radio" name="event-type" value="${typeToLowerCase}"${currentType === type ? ' checked' : ''}>
              <label class="event__type-label  event__type-label--${typeToLowerCase}"
                  for="event-type-${typeToLowerCase}-1" data-control-type="${currentType}">${currentType}</label>
            </div>

            `).join('');
};


const createPointEditTemplate = (data) => {

  const {
    type,
    addedOffers,
    price,
    isOffers,
    isAddedOffers,
    isPhotos,
    photos,
    date: {
      dateTo,
      dateFrom,
    },
    city,
    description,
  } = data;


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createControlsPoint(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1"
              type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cityList}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateTo)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateFrom)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${getOfferList(type, addedOffers, isOffers, isAddedOffers, isOffers)}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${getPhotoList(photos, isPhotos)}
        </section>
      </section>
    </form>
  </li>`;
};


export default class PointEdit extends SmartView {
  constructor(point) {
    super();
    this._data = PointEdit.parsePointToData(point);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typePointListHandler = this._typePointListHandler.bind(this);
    this._destinationListHandler = this._destinationListHandler.bind(this);
    this._addedOffersChangeHandler = this._addedOffersChangeHandler.bind(this);
    this._setInnerHandlers();
  }


  getTemplate() {
    return createPointEditTemplate(this._data);
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }


  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typePointListHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationListHandler);

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
      isOffers: offers[type] !== null,
      isAddedOffers: false,
    });
  }

  _destinationListHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value;

    if (!cities.find((current) => current === city)) {
      evt.target.setCustomValidity('Выберите город из предложенного списка');
      return;
    }

    this.updateData({
      city,
      description: getDescByCity(city, destinations),
      photos: getPhotosByCity(city, destinations),
    });

  }


  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parsePointToData(this._data));
  }


  _changeAddedOffers(target) {
    const addedOffers = this._data.addedOffers ? this._data.addedOffers.slice() : [];

    if (!target.checked) {
      const index = addedOffers.map(({name}) => name.indexOf(target.value)).indexOf(0);
      addedOffers.splice(index, 1);
    } else {
      const currentOfferSet = {};
      offers[this._data.type].map(({name, price}) => currentOfferSet[name] = price);

      const clickedOffers = {
        name: target.value,
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


  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }


  static parsePointToData(point) {
    const {type, addedOffers, photos} = point;

    return Object.assign(
      {},
      point,
      {
        isOffers: offers[type] !== null,
        isAddedOffers: addedOffers !== null,
        isPhotos: photos !== null,
      },
    );
  }


  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isOffers;
    delete data.isAddedOffers;
    delete data.isPhotos;

    return data;
  }
}
