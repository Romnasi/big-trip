import {offers} from './../mock/point-data.js';
import {formatDate} from './../format-date.js';


const getPhotoList = (photos) => {
  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${photos !== null ? photos.map((url) => `<img class="event__photo" src="${url}" alt="Event photo">`).join('') : '' }
    </div>
  </div>`;
};


const checkOfferAdded = (currentName, addedOffers) => {
  return addedOffers !== null
    ? Object.values(addedOffers).map(({name}) => name).includes(currentName)
    : '';
};


const getTypeOffers = (type, addedOffers) => {
  const getNameWithoutSpace = (nameWithSpace) => {
    return nameWithSpace.toLowerCase().replace(/ /g, '-');
  };
  let nameWithoutSpace = '';

  return offers[type] !== null
    ? Object.values(offers[type]).map(({name, price}) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="${nameWithoutSpace = getNameWithoutSpace(name)}-1" type="checkbox" name="${nameWithoutSpace}" ${checkOfferAdded(name, addedOffers) ? 'checked' : ''}>
      <label class="event__offer-label" for="${nameWithoutSpace}-1">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('')
    : '';
};


const getOfferList = (type, addedOffers) => {
  return offers[type] !== null
    ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${getTypeOffers(type, addedOffers)}
    </div>
  </section>`
    : '';
};


const createControlsPoint = (type) => {
  let typeToLowerCase = '';

  return offers !== null
    ? Object.keys(offers).map((currentType) => `<div class="event__type-item">
              <input id="event-type-${typeToLowerCase = currentType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio"
                  name="event-type" value="${typeToLowerCase}"${currentType === type ? ' checked' : ''}>
              <label class="event__type-label  event__type-label--${typeToLowerCase}" for="event-type-${typeToLowerCase}-1">${currentType}</label>
            </div>

            `).join('')
    : '';
};


export const createPointEditTemplate = (points) => {

  const {type, city, description, photos, addedOffers, price, date: { dateTo, dateFrom }} = points;


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
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
        ${getOfferList(type, addedOffers)}
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          ${getPhotoList(photos)}
        </section>
      </section>
    </form>
  </li>`;
};
