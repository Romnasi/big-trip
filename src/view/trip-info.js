import dayjs from 'dayjs';

export const createTripInfoTemplate = (points) => {
  const MAX_COUNT_CITY = 3;

  // Если две и более точек подряд из одного города - остается только одна
  const cleanCities = (cities) => {
    let prevCity = '';
    const cityFortitle = [];

    cities.forEach((city) => {
      if (prevCity === '') {
        prevCity = city;
        cityFortitle.push(city);
      } else {
        if (prevCity !== city) {
          cityFortitle.push(city);
          prevCity = city;
        }
      }
    });
    return cityFortitle;
  };


  const getTitle = () => {
    let cities = points.map((point) => point.city);
    cities = cleanCities(cities);
    if (cities.length > MAX_COUNT_CITY) {
      cities = [cities[0], '...', cities[cities.length - 1]];
    }
    return cities.join(' &mdash; ');
  };


  // Исходим из того, что данные уже остортированы от старого к новому
  // Если с сервера будут приходить другие данные необходима функция сортировки
  const getTripDuration = () => {
    const dateToList = points.map((point) => point.date.dateTo);
    const dateFromList = points.map((point) => point.date.dateTo);
    const tripStartDate = dayjs(dateToList[0]).format('DD MMM');
    const tripFinishDate = dayjs(dateFromList[dateFromList.length - 1]).format('DD MMM');

    return `${tripStartDate + '&nbsp;&mdash;&nbsp;' + tripFinishDate}`;
  };


  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTitle()}</h1>

      <p class="trip-info__dates">${getTripDuration()}</p>
    </div>
  </section>`;
};
