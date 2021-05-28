import PointsModel from './model/points.js';


export default class Store {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getOffers() {
    return PointsModel.adaptOffersToClient(this._offers);
  }

  getDestinations() {
    return this._destinations;
  }
}
