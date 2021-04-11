import {createSiteMenuTemplate} from './view/site-menu.js';
import {createEventsFilter} from './view/filter-events.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createTripListTemplate} from './view/trip-list.js';
import {createСreationPointTemplate} from './view/creation-point.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createPointTemplate} from './view/trip-point.js';
import {generatePoint} from './mock/point-data.js';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(() => generatePoint());


const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const eventsElement = pageMainElement.querySelector('.trip-events');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


render(navigationElement, createSiteMenuTemplate(), 'beforeend');
render(filtersElement, createEventsFilter(), 'beforeend');
render(tripMainElement, createTripInfoTemplate(points), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, createTripCostTemplate(points), 'beforeend');
render(eventsElement, createTripSortTemplate(), 'beforeend');
render(eventsElement, createTripListTemplate(), 'beforeend');

const eventListElement = pageMainElement.querySelector('.trip-events__list');

render(eventListElement, createСreationPointTemplate(), 'beforeend');
render(eventListElement, createPointEditTemplate(points[0]), 'afterbegin');

for(let i = 1; i < POINT_COUNT; i++) {
  render(eventListElement, createPointTemplate(points[i]), 'beforeend');
}
