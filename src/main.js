import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';


import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import {generatePoint} from './mock/point-data.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';

const POINT_COUNT = 22;
const points = new Array(POINT_COUNT).fill().map(() => generatePoint());


const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const btnNewEventElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-main');
const tripContainerElement = pageMainElement.querySelector('.page-body__container');

const siteMenuComponent = new SiteMenuView();
render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tripInfoComponent = new TripInfoView(points);
render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripCostView(points), RenderPosition.BEFOREEND);


const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);


const handlePointNewFormClose = () => {
  btnNewEventElement.disabled = false;
  siteMenuComponent.getElement().querySelector(`[data-type=${MenuItem.TABLE}]`).classList.add('trip-tabs__btn--active');
  siteMenuComponent.getElement().querySelector(`[data-type=${MenuItem.TABLE}]`).focus();
};


let statsComponent = null;


const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_EVENT:
      // Скрыть статистику
      remove(statsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();

      btnNewEventElement.disabled = true;
      tripPresenter.createPoint(handlePointNewFormClose);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.TABLE:
      // tripPresenter.destroy();
      tripPresenter.init();
      // Скрыть статистику
      remove(statsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      // Показать статистику
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripContainerElement, statsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick, btnNewEventElement);

filterPresenter.init();
tripPresenter.init();
// render(tripContainerElement, new StatsView(pointsModel.getPoints()), RenderPosition.BEFOREEND);
