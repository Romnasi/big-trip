import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';


import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import {generatePoint} from './mock/point-data.js';
import {render, RenderPosition} from './utils/render.js';

const POINT_COUNT = 22;
const points = new Array(POINT_COUNT).fill().map(() => generatePoint());


const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-main');
const tripContainerElement = pageMainElement.querySelector('.page-body__container');


render(navigationElement, new SiteMenuView(), RenderPosition.BEFOREEND);

const tripInfoComponent = new TripInfoView(points);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripCostView(points), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
