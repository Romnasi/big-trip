import SiteMenuView from './view/site-menu.js';
import StatsView from './view/stats.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';

import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import {isOnline} from './utils/common.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {toast} from './utils/toast.js';
import {MenuItem, UpdateType, FilterType} from './const.js';
import Api from './api/api.js';
import Store from './store.js';
import ApiStore from './api/store.js';
import Provider from './api/provider.js';


const AUTHORIZATION = 'Basic shlakoblok2020';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export const staticDataStore = new Store();

const api = new Api(END_POINT, AUTHORIZATION);
const apiStore = new ApiStore(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, apiStore, staticDataStore);

const tripMainElement = document.querySelector('.trip-main');
const navigationElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const btnNewEventElement = tripMainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const pageMainElement = document.querySelector('.page-main');
const tripContainerElement = pageMainElement.querySelector('.page-body__container');

const siteMenuComponent = new SiteMenuView();
const tripPresenter = new TripPresenter(tripContainerElement, pointsModel, filterModel, staticDataStore, apiWithProvider);
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
      if (!isOnline()) {
        toast('You can\'t create new point offline');
        siteMenuComponent.setMenuItem(MenuItem.TABLE);
        break;
      }
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


Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints(),
]).then(([, , points]) => {
  pointsModel.setPoints(UpdateType.INIT, points);
  render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick, btnNewEventElement);
})
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);

    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick, btnNewEventElement);
  });

filterPresenter.init();
tripPresenter.init();


window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});


window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});


window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
