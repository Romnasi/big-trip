import AbstractView from './abstract.js';
import {MenuItem} from './../const.js';

const activeItemClass = 'trip-tabs__btn--active';


const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn ${activeItemClass}"
      href="#" data-type="${MenuItem.TABLE}">
      ${MenuItem.TABLE}
    </a>
    <a class="trip-tabs__btn"
      href="#" data-type="${MenuItem.STATS}">
      ${MenuItem.STATS}
    </a>
  </nav>`;
};


export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }


  getTemplate() {
    return createSiteMenuTemplate();
  }


  _menuClickHandler(evt) {
    evt.preventDefault();

    if (!evt.target.classList.contains(activeItemClass)) {
      this._callback.menuClick(evt.target.dataset.type);
    }
  }


  setMenuClickHandler(callback, btnNewEventElement) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
    btnNewEventElement.addEventListener('click', this._menuClickHandler);
  }


  setMenuItem(menuItem) {
    const menuItemTable = this.getElement().querySelector(`[data-type=${MenuItem.TABLE}]`);
    const menuItemStats = this.getElement().querySelector(`[data-type=${MenuItem.STATS}]`);

    if (menuItem === MenuItem.TABLE) {
      menuItemTable.classList.add(activeItemClass);
      menuItemStats.classList.remove(activeItemClass);
      return;
    }

    if (menuItem === MenuItem.STATS) {
      menuItemStats.classList.add(activeItemClass);
      menuItemTable.classList.remove(activeItemClass);
    }
  }
}
