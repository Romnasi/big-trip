import {createSiteMenuTemplate} from './view/site-menu.js';
import {createEventsFilter} from './view/filter-events.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import {createTripSortTemplate} from './view/trip-sort.js';
import {createFormTemplate} from './view/trip-form.js';
import {createEditFromTemplate} from './view/edit-form.js';
import {createPointTemplate} from './view/trip-point.js';

const POINT_COUNT = 3;

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
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');
render(tripInfoElement, createTripCostTemplate(), 'beforeend');
render(eventsElement, createTripSortTemplate(), 'beforeend');
render(eventsElement, createFormTemplate(), 'beforeend');


const eventListElement = pageMainElement.querySelector('.trip-events__list');
render(eventListElement, createEditFromTemplate(), 'afterbegin');

for(let i = 0; i < POINT_COUNT; i++) {
  render(eventListElement, createPointTemplate(), 'beforeend');
}
