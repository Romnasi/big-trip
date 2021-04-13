import {getTripDuration} from './../format-date.js';


const MAX_COUNT_CITY = 3;

const getUniqueCities = (points) => {
  return [...new Set(points.map((point) => point.city))];
};


const getTitle = (points) => {
  let cities = getUniqueCities(points);
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


export const createTripInfoTemplate = (points) => {

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTitle(points)}</h1>

      <p class="trip-info__dates">${getTripDuration(points)}</p>
    </div>
  </section>`;
};
