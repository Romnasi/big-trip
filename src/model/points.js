import Observer from './../utils/observer.js';


export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }


  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }


  getPoints() {
    return this._points;
  }


  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting points');
    }


    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }


  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }


  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting points');
    }


    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }


  static adaptPointToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        type: point.type.charAt(0).toUpperCase() + point.type.slice(1),
        city: point.destination.name,
        description: point.destination.description,
        addedOffers: point.offers ? point.offers : null,
        photos: point.destination.pictures,
        price: point.base_price,
        date: {
          dateTo: point.date_from !== null ? new Date(point.date_from) : point.date_from,
          dateFrom: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        },
        isFavorite: point.is_favorite,
      },
    );

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_to;
    delete adaptedPoint.date_from;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.offers;

    return adaptedPoint;
  }


  static adaptOffersToClient(offerData) {
    const capitalizeFirstWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    const adapted = {};

    offerData.map((offerSet) => {
      const {type, offers} = offerSet;

      adapted[capitalizeFirstWord(type)] = offers.length !== 0
        ? offers.map(({title, price}) => {
          return {
            title: title,
            price: price,
          };
        })
        : null;
    });

    return adapted;
  }


  static adaptPointToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'type': point.type.toLowerCase(),
        'base_price': point.price !== null ? point.price : 0,
        'date_to': point.date.dateFrom !== null ? point.date.dateFrom.toISOString() : null,
        'date_from': point.date.dateTo !== null ? point.date.dateTo.toISOString() : null,
        'is_favorite': point.isFavorite,
        'offers': point.addedOffers !== null ? point.addedOffers : [],
      },
    );

    delete adaptedPoint.city;
    delete adaptedPoint.description;
    delete adaptedPoint.photos;
    delete adaptedPoint.price;
    delete adaptedPoint.date;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.addedOffers;

    return adaptedPoint;
  }
}
