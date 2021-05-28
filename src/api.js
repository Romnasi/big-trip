import PointsModel from './model/points.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccesHTTPStatusRnge = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor (endPoint, authorization, store) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._store = store;
  }


  getPoints() {
    return this._load({url: 'points'})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptPointToClient));
  }


  getOffers() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
  }


  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }


  getAllData() {
    return Promise
      .all([
        this.getPoints(),
        this.getOffers(),
        this.getDestinations(),
      ])
      .then(([points, offers, destinations]) => {
        this._store.setOffers(offers);
        this._store.setDestinations(destinations);
        return points;
      })
      .catch(() => {
        this._store.setDestinations([]);
        this._store.setOffers([]);
      });
  }


  updatePoint(point) {
    return(this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    }))
      .then(Api.toJSON)
      .then(PointsModel.adaptPointToClient);
  }


  addPoint(point) {
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptPointToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }


  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }


  static checkStatus(responce) {
    if (
      responce.status < SuccesHTTPStatusRnge.MIN ||
      responce.status > SuccesHTTPStatusRnge.MAX
    ) {
      throw new Error(`${responce.status}: ${responce.statusText}`);
    }

    return responce;
  }


  static toJSON(responce) {
    return responce.json();
  }


  static catchError(err) {
    throw err;
  }
}
