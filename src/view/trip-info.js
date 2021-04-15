import {createElement} from './../utils.js';
import {getTripDuration} from './../format-date.js';


const MAX_COUNT_CITY = 3;


const getTitle = (points) => {
  let cities = [...new Set(points.map((point) => point.city))];
  const firstCity = cities[0];
  const lastCity = cities[cities.length - 1];

  if (cities.length > MAX_COUNT_CITY) {
    cities = [firstCity, '...', lastCity].join(' &mdash; ');
  } else if (cities.length <= MAX_COUNT_CITY && cities.length > 1) {
    cities = [...cities].join(' &mdash; ');
  } else {
    cities = firstCity;
  }
  return cities;
};


const createTripInfoTemplate = (points) => {

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTitle(points)}</h1>

      <p class="trip-info__dates">${getTripDuration(points)}</p>
    </div>
  </section>`;
};


export default class TripInfo {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
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
