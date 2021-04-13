import dayjs from 'dayjs';
import {getQuotientWithoutRemainder} from './utils.js';


const HOUR_IN_MINUTES = 60;
const DAY_IN_MINUTES = 1440;


// trip-info.js
export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};


// trip-point.js

// Исходим из того, что данные уже остортированы от старого к новому
// Если с сервера будут приходить другие данные необходима функция сортировки
export const getTripDuration = (points) => {
  const dateToList = points.map((point) => point.date.dateTo);
  const dateFromList = points.map((point) => point.date.dateTo);
  const tripStartDate = dayjs(dateToList[0]).format('DD MMM');
  const tripFinishDate = dayjs(dateFromList[dateFromList.length - 1]).format('DD MMM');

  return `${tripStartDate + '&nbsp;&mdash;&nbsp;' + tripFinishDate}`;
};


// Форматирование дат
export const getDayOfMonth = (dateTo) => dayjs(dateTo).format('MMM D');
export const getDatetime = (dateTo) => dayjs(dateTo).format('YYYY-MM-DD');
export const getHoursMinutes = (date) => dayjs(date).format('HH:mm');
export const getDatetimeWithHM = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');


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


export const getDuration = (dateTo, dateFrom) => {
  const dateStart = dayjs(dateTo);
  const dateFinish = dayjs(dateFrom);
  const durationInMin = dateFinish.diff(dateStart, 'minute');

  return getDurationFormat(durationInMin);
};
