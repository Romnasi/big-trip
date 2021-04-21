// mock
export const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

export const getRandomEl = (array) => array[getRandomInteger(0, array.length - 1)];

// format-date.js
// Деление без остатка
export const getQuotientWithoutRemainder = (val, by) => {
  return (val - val % by) / by;
};
