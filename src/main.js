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
import {render, RenderPosition, replace} from './utils/render.js';

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
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.setEditClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, pointComponent, RenderPosition.BEFOREEND);
};


render(navigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(filtersElement, new FilterListView(), RenderPosition.BEFOREEND);

// Header
const tripInfoComponent = new TripInfoView(points);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripCostView(points), RenderPosition.BEFOREEND);
render(eventsElement, new TripSortView(), RenderPosition.BEFOREEND);

// Trip list
const tripListComponent = new TripListView();
// По условию заглушка должна показываться, когда нет точек.
if (points.length === 0) {
  render(eventsElement, new NoPointView(), RenderPosition.BEFOREEND);
} else {
  render(eventsElement, tripListComponent, RenderPosition.BEFOREEND);
  render(tripListComponent, new CreationPointView(), RenderPosition.BEFOREEND);
}


for(let i = 0; i < POINT_COUNT; i++) {
  renderPoint(tripListComponent, points[i]);
}
