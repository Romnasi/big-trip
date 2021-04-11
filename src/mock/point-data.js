import dayjs from 'dayjs';

const DESC_MIN_COUNT = 1;
const DESC_MAX_COUNT = 5;

const PHOTO_MIN_COUNT = 1;
const PHOTO_MAX_COUNT = 7;
const PHOTO_MIN_ID = 1;
const PHOTO_MAX_ID = 100;
const PHOTO_URL = 'http://picsum.photos/248/152?r=';

const POINT_MIN_PRICE = 20;
const POINT_MAX_PRICE = 700;

const START_TRIP_MIN_DAY = 7;
const START_TRIP_MAX_DAY = 9;
const MIN_TRIP_DURATION = 10;
const MAX_TRIP_DURATION = 1900;

const types = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const cities = [
  'Geneva',
  'Tokyo',
  'London',
  'San Francisco',
  'Los Angeles',
  'Cape Town',
  'Rio de Janeiro',
];


const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus',
];


export const offers = {
  'Taxi': [
    {name: 'Order Uber', price: 25},
  ],
  'Bus': null,
  'Train': [
    {name: 'Choose seats', price: 25},
  ],
  'Ship': [
    {name: 'Add luggage', price: 50},
    {name: 'Switch to comfort', price: 80},
    {name: 'Choose seats', price: 30},
  ],
  'Transport': null,
  'Drive':  [
    {name: 'Rent a car', price: 200},
  ],
  'Flight': [
    {name: 'Add luggage', price: 50},
    {name: 'Switch to comfort', price: 80},
    {name: 'Choose seats', price: 30},
    {name: 'Travel by train', price: 20},
  ],
  'Check-in': [
    {name: 'Add breakfast', price: 50},
    {name: 'Add meal', price: 70},
  ],
  'Sightseeing': [
    {name: 'Book tickets', price: 40},
    {name: 'Lunch in city', price: 30},
  ],
  'Restaurant': null,
};

let lastPointDate = null;


// helpers
const getRandomInteger = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};

const getRandomEl = (array) => array[getRandomInteger(0, array.length - 1)];


// Генерируем данные для point'а
const generateType = () => getRandomEl(types);
const generateCity = () => getRandomEl(cities);


const generateDescription = () => {
  const sentenceСount = getRandomInteger(DESC_MIN_COUNT, DESC_MAX_COUNT);

  return new Array(sentenceСount).fill().map(() => getRandomEl(descriptions)).join(' ');
};


const generatePhotoURLs = () => {
  const photoURLsСount = getRandomInteger(PHOTO_MIN_COUNT, PHOTO_MAX_COUNT);
  const getRandomID = () => getRandomInteger(PHOTO_MIN_ID, PHOTO_MAX_ID);

  return new Array(photoURLsСount).fill().map(() => PHOTO_URL + getRandomID());
};


const generateDate = () => {
  const getRandomDuration = () => getRandomInteger(MIN_TRIP_DURATION, MAX_TRIP_DURATION);
  const daysGap = getRandomInteger(START_TRIP_MIN_DAY, START_TRIP_MAX_DAY);

  let dateTo = null || dayjs(lastPointDate).add(getRandomDuration(), 'minute').toDate();
  if (lastPointDate === null) {
    dateTo = dayjs().add(daysGap, 'day').toDate();
  }

  const dateFrom = dayjs(dateTo).add(getRandomDuration(), 'minute').toDate();
  lastPointDate = dateFrom;

  return {
    dateTo,
    dateFrom,
  };
};


const generateAddedOffer = (type) => {
  const currentOfers = offers[type];

  if (currentOfers !== null) {
    const addedOffers = [];
    const maxCount = getRandomInteger(0, currentOfers.length - 1);
    for( let i = 0; i < maxCount; i++) {
      addedOffers.push(offers[type][i]);
    }
    return addedOffers;
  }
  return null;
};


export const generatePoint = () => {
  const type = generateType();

  return {
    type,
    city: generateCity(),
    addedOffers: generateAddedOffer(type),
    description: generateDescription(),
    photos: generatePhotoURLs(),
    date: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(POINT_MIN_PRICE, POINT_MAX_PRICE),
  };
};
