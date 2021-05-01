export const getDescByCity = (city, destinations) => destinations.find((destination) => destination.name == city).description;
export const getPhotosByCity = (city, destinations) => destinations.find((destination) => destination.name == city).pictures;

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


export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
