import AbstractView from './abstract.js';
import {getTripDuration} from './../utils/format-date.js';


const MAX_COUNT_CITY = 3;


const getTitle = (points) => {
  let cities = points.map((point) => point.city);
  const firstCity = cities[0];
  const lastCity = cities[cities.length - 1];
  const uniqCitiesCount = [...new Set(cities)].length;

  if (uniqCitiesCount > MAX_COUNT_CITY) {
    cities = [firstCity, '...', lastCity].join(' &mdash; ');
  } else if (uniqCitiesCount <= MAX_COUNT_CITY && uniqCitiesCount > 1) {
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


export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}
