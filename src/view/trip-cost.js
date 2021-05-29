import AbstractView from './abstract.js';


const countOfferPrice = (offers) => {
  return offers !== null ? offers.reduce((total, offer) => total + offer.price, 0) : 0;
};


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


export default class TripCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }
}
