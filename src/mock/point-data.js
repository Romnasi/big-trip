import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger} from './../utils/common.js';
import {getRandomEl} from './../utils/common.js';
import {getDescByCity} from './../utils/common.js';
import {getPhotosByCity} from './../utils/common.js';


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


export const destinations = [
  {
    description: 'Tokyo (東京, Tōkyō) is Japan\'s capital and the world\'s most populous metropolis. It is also one of Japan\'s 47 prefectures, consisting of 23 central city wards and multiple cities, towns and villages west of the city center.',
    name: 'Tokyo',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=1',
        description: 'Tokyo 1',
      },
      {
        src: 'http://picsum.photos/248/152?r=4',
        description: 'Tokyo 3',
      },
      {
        src: 'http://picsum.photos/248/152?r=2',
        description: 'Tokyo 2',
      },
      {
        src: 'http://picsum.photos/248/152?r=5',
        description: 'Tokyo 5',
      },
      {
        src: 'http://picsum.photos/248/152?r=6',
        description: 'Tokyo 6',
      },
      {
        src: 'http://picsum.photos/248/152?r=7',
        description: 'Tokyo 7',
      },
      {
        src: 'http://picsum.photos/248/152?r=8',
        description: 'Tokyo 8',
      },
    ],
  },
  {
    description: 'London is the capital of the United Kingdom and England. London is the city region with the highest population in the United Kingdom. With it being located along River Thames, London has been a central city since it was founded by the Romans two millennia ago under the name Londinium.',
    name: 'London',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=11',
        description: 'London 11',
      },
      {
        src: 'http://picsum.photos/248/152?r=12',
        description: 'London 12',
      },
      {
        src: 'http://picsum.photos/248/152?r=13',
        description: 'London 13',
      },
      {
        src: 'http://picsum.photos/248/152?r=141',
        description: 'London 141',
      },
      {
        src: 'http://picsum.photos/248/152?r=15',
        description: 'London 15',
      },
    ],
  },
  {
    description: 'San Francisco, city and port, coextensive with San Francisco county, northern California, U.S., located on a peninsula between the Pacific Ocean and San Francisco Bay. It is a cultural and financial centre of the western United States and one of the country\'s most cosmopolitan cities.',
    name: 'San Francisco',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=66',
        description: 'San Francisco 66',
      },
      {
        src: 'http://picsum.photos/248/152?r=77',
        description: 'San Francisco 88',
      },
      {
        src: 'http://picsum.photos/248/152?r=99',
        description: 'San Francisco 99',
      },
      {
        src: 'http://picsum.photos/248/152?r=22',
        description: 'San Francisco 22',
      },
      {
        src: 'http://picsum.photos/248/152?r=111',
        description: 'San Francisco 111',
      },
    ],
  },
  {
    description: 'The city of Los Angeles (also known simply as L.A., and nicknamed the "City of Angels") is the most populous city in California. Located on a broad basin in Southern California, the city is surrounded by vast mountain ranges, valleys, forests, beautiful beaches along the Pacific Ocean, and nearby desert.',
    name: 'Los Angeles',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=35',
        description: 'Los Angeles 35',
      },
      {
        src: 'http://picsum.photos/248/152?r=555',
        description: 'Los Angeles 555',
      },
      {
        src: 'http://picsum.photos/248/152?r=666',
        description: 'Los Angeles 666',
      },
    ],
  },
  {
    description: 'Known as the “Mother City”, Cape Town is the oldest city in South Africa. Perched between the ocean and the mountain, with a national park as its heart, there is nowhere like Cape Town. Cape Town, the “Mother City”, is the oldest city in South Africa and has a cultural heritage spanning more than 300 years.',
    name: 'Cape Town',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=777',
        description: 'Cape Town 777',
      },
      {
        src: 'http://picsum.photos/248/152?r=999',
        description: 'Cape Town 999',
      },
      {
        src: 'http://picsum.photos/248/152?r=111',
        description: 'Cape Town 111',
      },
      {
        src: 'http://picsum.photos/248/152?r=222',
        description: 'Cape Town 222',
      },
      {
        src: 'http://picsum.photos/248/152?r=333',
        description: 'Cape Town 333',
      },
    ],
  },
  {
    description: 'Rio de Janeiro is the second largest city in Brazil, on the South Atlantic coast. Rio is famous for its breathtaking landscape, its laid back beach culture and its annual carnival. Although, their soccer skills here are very well recognized.',
    name: 'Rio de Janeiro',
    pictures: [
      {
        src: 'http://picsum.photos/248/152?r=123',
        description: 'Rio de Janeiro 123',
      },
      {
        src: 'http://picsum.photos/248/152?r=345',
        description: 'Rio de Janeiro 345',
      },
      {
        src: 'http://picsum.photos/248/152?r=87',
        description: 'Rio de Janeiro 87',
      },
      {
        src: 'http://picsum.photos/248/152?r=90',
        description: 'Rio de Janeiro 90',
      },
    ],
  },
];


export const offers = {
  'Taxi': [
    {name: 'Order Uber', price: 25},
    {name: 'Choose the radio station', price: 15},
    {name: 'Upgrade to a business class', price: 120},
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


// Генерируем данные для point'а
const generateType = () => getRandomEl(types);


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
    const maxCount = getRandomInteger(1, currentOfers.length - 1);
    for( let i = 0; i < maxCount; i++) {
      addedOffers.push(offers[type][i]);
    }
    return addedOffers;
  }
  return null;
};


const getCities = () => Object.values(destinations).map(({name}) => name).slice();
const cities = getCities();


export const generatePoint = () => {
  const type = generateType();
  const city = getRandomEl(destinations).name;

  return {
    id: nanoid(),
    type,
    city,
    cities,
    description: getDescByCity(city, destinations),
    destination: getRandomEl(destinations, destinations),
    addedOffers: generateAddedOffer(type),
    photos: getPhotosByCity(city, destinations),
    date: generateDate(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    price: getRandomInteger(POINT_MIN_PRICE, POINT_MAX_PRICE),
  };
};
