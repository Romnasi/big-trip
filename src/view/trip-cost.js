export const createTripCostTemplate = (points) => {

  const pointPrice = points.reduce((total, point) => total + parseInt(point.price, 10), 0);

  const countOfferPrice = (offers) => {
    return offers !== null ? offers.reduce((total, offer) => total + offer.price, 0) : 0;
  };

  // Считает только, то что было выбрано раньше и пришло по серверу
  // Не считает в онлайне (при кликах по офферам и изменении цен в форме - ничего не изменится) нужно вешать обработчики
  // При подсчете не учитывает форму создания, т.к. там нет живых данных
  const addedOfferPrice = points.reduce((total, point) => total + countOfferPrice(point.addedOffers), 0);

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${pointPrice + addedOfferPrice}</span>
  </p>`;
};
