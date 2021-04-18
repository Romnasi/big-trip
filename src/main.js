import SiteMenuView from './view/site-menu.js';
import FilterListView from './view/filter-list.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';
import TripSortView from './view/trip-sort.js';
import TripListView from './view/trip-list.js';
import CreationPointView from './view/creation-point.js';
import PointEditView from './view/point-edit.js';
import PointView from './view/trip-point.js';
import NoPointView from './view/no-point.js';
import {generatePoint} from './mock/point-data.js';
import {render, RenderPosition} from './utils.js';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(() => generatePoint());


const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const eventsElement = pageMainElement.querySelector('.trip-events');


const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point);

  const replacePointToForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};


render(navigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersElement, new FilterListView().getElement(), RenderPosition.BEFOREEND);

// Header
const tripInfoComponent = new TripInfoView(points);
render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripInfoComponent.getElement(), new TripCostView(points).getElement(), RenderPosition.BEFOREEND);
render(eventsElement, new TripSortView().getElement(), RenderPosition.BEFOREEND);

// Trip list
const tripListComponent = new TripListView();
// По условию заглушка должна показываться, когда нет точек.
if (points.length === 0) {
  render(eventsElement, new NoPointView().getElement(), RenderPosition.BEFOREEND);
} else {
  render(eventsElement, tripListComponent.getElement(), RenderPosition.BEFOREEND);
  render(tripListComponent.getElement(), new CreationPointView().getElement(), RenderPosition.BEFOREEND);
}


for(let i = 0; i < POINT_COUNT; i++) {
  renderPoint(tripListComponent.getElement(), points[i]);
}
