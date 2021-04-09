import dayjs from 'dayjs';

export const createPointTemplate = (point) => {
  const HOUR_IN_MINUTES = 60;
  const DAY_IN_MINUTES = 1440;

  const {type, city, offers, date, isFavorite, price} = point;


  // Форматирование дат
  const dayOfMonth = dayjs(date.dateTo).format('MMM D');
  const dateForDatetime = dayjs(date.dateTo).format('YYYY-MM-DD');

  const dateTo = dayjs(date.dateTo).format('HH:mm');
  const dateToForDatetime = dayjs(date.dateTo).format('YYYY-MM-DDTHH:mm');
  const dateFrom = dayjs(date.dateFrom).format('HH:mm');
  const dateFromDatetime = dayjs(date.dateFrom).format('YYYY-MM-DDTHH:mm');


  // Деление без остатка
  const getQuotientWithoutRemainder = (val, by) => {
    return (val - val % by) / by;
  };


  const getTwoDigitFormat = (digit) => {
    return digit > 9 ? digit : '0' + digit;
  };


  // Возвращает минуты в формате вида '02H 44M' или '12H 00M'
  const getFormatWithHours = (min) => {
    const hours = getQuotientWithoutRemainder(min, HOUR_IN_MINUTES);
    const minutes = min - hours * HOUR_IN_MINUTES;

    return  `${getTwoDigitFormat(hours)}H ${getTwoDigitFormat(minutes)}M`;
  };


  // Возвращает минуты в формате вида '01D 02H 30M' или '07D 00H 00M'
  const getFormatWithDays = (min) => {
    const days = getQuotientWithoutRemainder(min, DAY_IN_MINUTES);
    const remainderWithoutDays = min - days * DAY_IN_MINUTES;

    return  `${getTwoDigitFormat(days)}D ${getFormatWithHours(remainderWithoutDays)}`;
  };


  const getDurationFormat = (min) => {
    let duration = '';

    // Более суток: дни часы минуты (например, 01D 02H 30M или 07D 00H 00M, если часы и/или минуты равны нулю).
    if (min >= DAY_IN_MINUTES) {
      duration = `${getFormatWithDays(min)}`;

      // Менее суток: часы минуты (например, 02H 44M или 12H 00M, если минуты равны нулю);
    } else if (min > HOUR_IN_MINUTES) {
      duration = `${getFormatWithHours(min)}`;

      // Менее часа: минуты (например, 23M);
    } else {
      duration = `${getTwoDigitFormat(min)}M`;
    }

    return duration;
  };

  const getDuration = () => {
    const dateStart = dayjs(point.date.dateTo);
    const dateFinish = dayjs(point.date.dateFrom);
    const durationInMin = dateFinish.diff(dateStart, 'minute');

    return getDurationFormat(durationInMin);
  };

  const duration = getDuration();

  const favorite = isFavorite === false
    ? ''
    : 'event__favorite-btn--active';


  const createOffers = () => {
    return `${offers !== null ? Object.values(offers).map(({name, price}) => `<li class="event__offer">
      <span class="event__offer-title">${name}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`).join('') : '' }`;
  };

  const currentOffers = createOffers();

  const createOffersList = () => {
    return `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${currentOffers}
      </ul>`;
  };


  const getOfferList = () => {
    return offers === null ? '' : createOffersList();
  };


  const offerList = getOfferList();


  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateForDatetime}">${dayOfMonth}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type ${type} icon">
      </div>
      <h3 class="event__title">${type} ${city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateToForDatetime}">${dateTo}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateFromDatetime}">${dateFrom}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${offerList}
      <button class="event__favorite-btn  ${favorite}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
