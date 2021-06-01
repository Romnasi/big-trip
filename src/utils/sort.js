import {getDiffDate} from './date.js';


// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};


export const sortByDateUp = (pointA, pointB) => {
  const dateToA = pointA.date.dateTo;
  const dateToB = pointB.date.dateTo;
  const weight = getWeightForNullDate(dateToA, dateToB);
  if (weight !== null) {
    return weight;
  }

  return getDiffDate(dateToA, dateToB);
};


export const sortByPriceDown = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.price, pointB.price);

  if (weight !== null) {
    return weight;
  }

  return pointB.price - pointA.price;
};


export const sortByTimeDown = (pointA, pointB) => {
  const durationA = getDiffDate(pointA.date.dateFrom, pointA.date.dateTo);
  const durationB = getDiffDate(pointB.date.dateFrom, pointB.date.dateTo);
  const weight = getWeightForNullDate(durationA, durationB);

  if (weight !== null) {
    return weight;
  }

  return durationB - durationA;
};
