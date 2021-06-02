import PointsModel from './../model/points.js';
import {isOnline} from './../utils/common.js';


const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};


const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};


export default class Provider {
  constructor(api, store, staticDataStore) {
    this._api = api;
    this._store = store;
    this._staticDataStore = staticDataStore;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptPointToServer));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptPointToClient));
  }


  getOffers() {
    if (isOnline()) {
      return this._api.getOffers().then((offers) => {
        this._staticDataStore.setOffers(offers);
        return offers;
      });
    }
    return Promise.resolve(this._staticDataStore.getOffers());
  }


  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations().then((destinations) => {
        this._staticDataStore.setDestinations(destinations);
        return destinations;
      });
    }
    return Promise.resolve(this._destinationsStore.getDestinations());
  }


  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptPointToServer(updatedPoint));
          return updatedPoint;
        });
    }
    this._store.setItem(point.id, PointsModel.adaptPointToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }


  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptPointToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error('Add point failed'));
  }


  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error('Delete point failed'));
  }


  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
