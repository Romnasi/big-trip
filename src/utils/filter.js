import dayjs from 'dayjs';
import {FilterType} from './../const.js';


export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => {
    return point.date.dateTo > dayjs() || point.date.dateTo < dayjs() && point.date.dateFrom > dayjs();
  }),
  [FilterType.PAST]: (points) => points.filter((point) => {
    return point.date.dateFrom < dayjs() || point.date.dateTo < dayjs() && point.date.dateFrom > dayjs();
  }),
};
