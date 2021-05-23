export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};


export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  NEW_EVENT: 'new-event',
  TABLE: 'Table',
  STATS: 'Stats',
};

export const Bar = {
  HEIGHT: 55,

  TYPE: 'horizontalBar',
  BACKGROUND_COLOR: '#ffffff',
  HOVER_BACKGROUND_COLOR: '#ffffff',
  DATA_ANCHOR: 'start',

  DATA_LABELS_FONTSIZE: 13,
  DATA_LABELS_COLOR: '#000000',
  DATA_LABELS_ANCHOR: 'end',
  DATA_LABELS_ALIGN: 'start',

  MONEY_CHART_TITLE: 'MONEY',
  TYPE_CHART_TITLE: 'TYPE',
  TIME_CHART_TITLE: 'TIME-SPEND',

  TITLE_DISPLAY: true,
  TITLE_FONT_COLOR: '#000000',
  TITLE_FONTSIZE: 23,
  TITLE_POSITION: 'left',

  Y_TICKS_FONT_COLOR: '#000000',
  Y_TICKS_PADDING: 5,
  Y_TICKS_FONTSIZE: 13,

  Y_GRID_LINES_DISPLAY: false,
  Y_GRID_LINES_DRAW_BORDER: false,

  Y_BAR_THICKNESS: 44,

  X_TICKS_DISPLAY: false,
  X_TICKS_BEGIN_AT_ZERO: true,

  X_GRID_LINES_DISPLAY: false,
  X_GRID_LINES_DRAW_BORDER: false,

  X_MIN_BAR_LENGTH: 70,

  LEGEND_DISPLAY: false,

  TOOLTIPS_ENABLED: false,
};
