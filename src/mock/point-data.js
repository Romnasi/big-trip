import dayjs from 'dayjs';

const OFFER_MIN_PRICE = 10;
const OFFER_MAX_PRICE = 100;
const OFFER_MIN_COUNT = 1;
const OFFER_MAX_COUNT = 5;

const DESC_MIN_COUNT = 1;
const DESC_MAX_COUNT = 5;

const PHOTO_MIN_COUNT = 1;
const PHOTO_MAX_COUNT = 7;
const PHOTO_MIN_ID = 1;
const PHOTO_MAX_ID = 100;
const PHOTO_URL = 'http://picsum.photos/248/152?r=';

const POINT_MIN_PRICE = 20;
const POINT_MAX_PRICE = 700;

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
];

const names = [
  'Order Uber',
  'Add luggage',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
  'Switch to comfort',
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

// Для дополнительных опций
const generateName = () => getRandomEl(names);
const generatePrice = () => getRandomInteger(OFFER_MIN_PRICE, OFFER_MAX_PRICE);


const generateOffers = (type) => {
  const isOffer = Boolean(getRandomInteger(0, 1));

  if(!isOffer) {
    return null;
  }

  const offersCount = getRandomInteger(OFFER_MIN_COUNT, OFFER_MAX_COUNT);

  const generateOffer = () => {
    return {
      type,
      name: generateName(),
      price: generatePrice(),
    };
  };

  return new Array(offersCount).fill().map(() => generateOffer());
};


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
  const START_TRIP_MIN_DAY = 7;
  const START_TRIP_MAX_DAY = 9;
  const MIN_TRIP_DURATION = 10;
  const MAX_TRIP_DURATION = 1900;

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


export const generatePoint = () => {
  const type = generateType();

  return {
    type,
    city: generateCity(),
    offers: generateOffers(type),
    description: generateDescription(),
    photos: generatePhotoURLs(),
    date: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(POINT_MIN_PRICE, POINT_MAX_PRICE),
  };
};
