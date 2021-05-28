import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import TripInfoView from './view/trip-info.js';
import TripCostView from './view/trip-cost.js';

import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';


import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType, FilterType} from './const.js';
import Api from './api.js';
import Store from './store.js';


const AUTHORIZATION = 'Basic eo0w590ik29889s';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

export const store = new Store();

const api = new Api(END_POINT, AUTHORIZATION, store);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const btnNewEventElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-main');
const tripContainerElement = pageMainElement.querySelector('.page-body__container');

const siteMenuComponent = new SiteMenuView();


const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, store, api);
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
      remove(statsComponent);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();

      btnNewEventElement.disabled = true;
      tripPresenter.createPoint(handlePointNewFormClose);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statsComponent);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(tripContainerElement, statsComponent, RenderPosition.BEFOREEND);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};


api
  .getAllData()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);

    const tripInfoComponent = new TripInfoView(points);
    render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(tripInfoComponent, new TripCostView(points), RenderPosition.BEFOREEND);

    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick, btnNewEventElement);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);

    const tripInfoComponent = new TripInfoView([]);
    render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);
    render(tripInfoComponent, new TripCostView([]), RenderPosition.BEFOREEND);

    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick, btnNewEventElement);
  });


filterPresenter.init();
tripPresenter.init();
