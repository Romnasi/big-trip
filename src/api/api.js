import PointsModel from './../model/points.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const SuccesHTTPStatusRnge = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor (endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
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


  sync(data) {
    return this._load({
      url: 'points/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
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


  static checkStatus(response) {
    if (
      response.status < SuccesHTTPStatusRnge.MIN ||
      response.status > SuccesHTTPStatusRnge.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }


  static toJSON(response) {
    return response.json();
  }


  static catchError(err) {
    throw err;
  }
}
