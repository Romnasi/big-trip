import dayjs from 'dayjs';
import {FilterType} from './../const.js';


export const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.date.dateTo > dayjs()),
  [FilterType.PAST]: (points) => points.filter((point) => point.date.dateFrom < dayjs()),
};
