import SiteMenuView from './view/site-menu.js';
import EventsFilterView from './view/filter-events.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripCostTemplate} from './view/trip-cost.js';
import TripSortView from './view/trip-sort.js';
import TripListView from './view/trip-list.js';
import CreationPointView from './view/creation-point.js';
import {createPointEditTemplate} from './view/point-edit.js';
import {createPointTemplate} from './view/trip-point.js';
import {generatePoint} from './mock/point-data.js';
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(() => generatePoint());


const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const eventsElement = pageMainElement.querySelector('.trip-events');


renderElement(navigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderElement(filtersElement, new EventsFilterView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(tripMainElement, createTripInfoTemplate(points), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');
renderTemplate(tripInfoElement, createTripCostTemplate(points), 'beforeend');
renderElement(eventsElement, new TripSortView().getElement(), RenderPosition.BEFOREEND);

const tripListComponent = new TripListView();
renderElement(eventsElement, tripListComponent.getElement(), RenderPosition.BEFOREEND);

renderElement(tripListComponent.getElement(), new CreationPointView().getElement(), RenderPosition.BEFOREEND);
renderTemplate(tripListComponent.getElement(), createPointEditTemplate(points[0]), 'afterbegin');

for(let i = 1; i < POINT_COUNT; i++) {
  renderTemplate(tripListComponent.getElement(), createPointTemplate(points[i]), 'beforeend');
}
