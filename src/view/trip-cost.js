import {createElement} from './../utils.js';


const countOfferPrice = (offers) => {
  return offers !== null ? offers.reduce((total, offer) => total + offer.price, 0) : 0;
};


// Считает только, то что было выбрано раньше и пришло по серверу
// Не считает в онлайне (при кликах по офферам и изменении цен в форме - ничего не изменится) нужно вешать обработчики
// При подсчете не учитывает форму создания, т.к. там нет живых данных
const getPrice = (points) => {
  const pointPrice = points.reduce((total, point) => total + point.price, 0);
  const addedOfferPrice = points.reduce((total, point) => total + countOfferPrice(point.addedOffers), 0);
  return pointPrice + addedOfferPrice;
};


const createTripCostTemplate = (points) => {
  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getPrice(points)}</span>
  </p>`;
};


export default class TripCost {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
