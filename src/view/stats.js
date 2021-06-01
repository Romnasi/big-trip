import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';

import {getDurationFormat, getDiffDate} from './../utils/date.js';
import {Bar} from './../const.js';


const renderMoneyChart = (moneyCtx, money, types) => {
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: Bar.TYPE,
    data: {
      labels: types,
      datasets: [{
        data: money,
        backgroundColor: Bar.BACKGROUND_COLOR,
        hoverBackgroundColor: Bar.HOVER_BACKGROUND_COLOR,
        anchor: Bar.DATA_ANCHOR,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: Bar.DATA_LABELS_FONTSIZE,
          },
          color: Bar.DATA_LABELS_COLOR,
          anchor: Bar.DATA_LABELS_ANCHOR,
          align: Bar.DATA_LABELS_ALIGN,
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: Bar.TITLE_DISPLAY,
        text: Bar.MONEY_CHART_TITLE,
        fontColor: Bar.TITLE_FONT_COLOR,
        fontSize: Bar.TITLE_FONTSIZE,
        position: Bar.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Bar.Y_TICKS_FONT_COLOR,
            padding: Bar.Y_TICKS_PADDING,
            fontSize: Bar.Y_TICKS_FONTSIZE,
          },
          gridLines: {
            display: Bar.Y_GRID_LINES_DISPLAY,
            drawBorder: Bar.Y_GRID_LINES_DRAW_BORDER,
          },
          barThickness: Bar.Y_BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: Bar.X_TICKS_DISPLAY,
            beginAtZero: Bar.X_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: Bar.X_GRID_LINES_DISPLAY,
            drawBorder: Bar.X_GRID_LINES_DRAW_BORDER,
          },
          minBarLength: Bar.X_MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: Bar.LEGEND_DISPLAY,
      },
      tooltips: {
        enabled: Bar.TOOLTIPS_ENABLED,
      },
    },
  });
};


const renderTypeChart = (typeCtx, numbers, types) => {
  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: Bar.TYPE,
    data: {
      labels: types,
      datasets: [{
        data: numbers,
        backgroundColor: Bar.BACKGROUND_COLOR,
        hoverBackgroundColor: Bar.HOVER_BACKGROUND_COLOR,
        anchor: Bar.DATA_ANCHOR,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: Bar.DATA_LABELS_FONTSIZE,
          },
          color: Bar.DATA_LABELS_COLOR,
          anchor: Bar.DATA_LABELS_ANCHOR,
          align: Bar.DATA_LABELS_ALIGN,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: Bar.TITLE_DISPLAY,
        text: Bar.TYPE_CHART_TITLE,
        fontColor: Bar.TITLE_FONT_COLOR,
        fontSize: Bar.TITLE_FONTSIZE,
        position: Bar.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Bar.Y_TICKS_FONT_COLOR,
            padding: Bar.Y_TICKS_PADDING,
            fontSize: Bar.Y_TICKS_FONTSIZE,
          },
          gridLines: {
            display: Bar.Y_GRID_LINES_DISPLAY,
            drawBorder: Bar.Y_GRID_LINES_DRAW_BORDER,
          },
          barThickness: Bar.Y_BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: Bar.X_TICKS_DISPLAY,
            beginAtZero: Bar.X_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: Bar.X_GRID_LINES_DISPLAY,
            drawBorder: Bar.X_GRID_LINES_DRAW_BORDER,
          },
          minBarLength: Bar.X_MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: Bar.LEGEND_DISPLAY,
      },
      tooltips: {
        enabled: Bar.TOOLTIPS_ENABLED,
      },
    },
  });
};

const renderTimeSpendChart = (timeCtx, time, types) => {
  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: Bar.TYPE,
    data: {
      labels: types,
      datasets: [{
        data: time,
        backgroundColor: Bar.BACKGROUND_COLOR,
        hoverBackgroundColor: Bar.HOVER_BACKGROUND_COLOR,
        anchor: Bar.DATA_ANCHOR,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: Bar.DATA_LABELS_FONTSIZE,
          },
          color: Bar.DATA_LABELS_COLOR,
          anchor: Bar.DATA_LABELS_ANCHOR,
          align: Bar.DATA_LABELS_ALIGN,
          formatter: (val) => `${getDurationFormat(val)}`,
        },
      },
      title: {
        display: Bar.TITLE_DISPLAY,
        text: Bar.TIME_CHART_TITLE,
        fontColor: Bar.TITLE_FONT_COLOR,
        fontSize: Bar.TITLE_FONTSIZE,
        position: Bar.TITLE_POSITION,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Bar.Y_TICKS_FONT_COLOR,
            padding: Bar.Y_TICKS_PADDING,
            fontSize: Bar.Y_TICKS_FONTSIZE,
          },
          gridLines: {
            display: Bar.Y_GRID_LINES_DISPLAY,
            drawBorder: Bar.Y_GRID_LINES_DRAW_BORDER,
          },
          barThickness: Bar.Y_BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: Bar.X_TICKS_DISPLAY,
            beginAtZero: Bar.X_TICKS_BEGIN_AT_ZERO,
          },
          gridLines: {
            display: Bar.X_GRID_LINES_DISPLAY,
            drawBorder: Bar.X_GRID_LINES_DRAW_BORDER,
          },
          minBarLength: Bar.X_MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: Bar.LEGEND_DISPLAY,
      },
      tooltips: {
        enabled: Bar.TOOLTIPS_ENABLED,
      },
    },
  });
};


const createStatsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};


export default class Stats extends SmartView {
  constructor(points) {
    super();

    this._points = points;
    this._types = [...new Set(this._points.map( ({type}) => type))];


    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;


    this._setCharts();
  }


  getTemplate() {
    return createStatsTemplate(this._data);
  }


  restoreHandlers() {
    this._setCharts();
  }


  _sortMapByValues(mapToSort) {
    const sortedMap = new Map([...mapToSort.entries()]
      .sort((firstEntry, secondEntry) => {
        return secondEntry[1] - firstEntry[1];
      }));
    return sortedMap;
  }

  _getPrices() {
    const prices = new Map();

    this._points.forEach((point) => {
      if (prices.has(point.type)) {
        const total = prices.get(point.type) + point.price;
        prices.set(point.type, total);
      } else {
        prices.set(point.type, point.price);
      }
    });

    return this._sortMapByValues(prices);
  }


  _getQuantities() {
    const quantities = new Map();

    this._points.forEach((point) => {
      if (quantities.has(point.type)) {
        const countByType = quantities.get(point.type) + 1;
        quantities.set(point.type, countByType);
      } else {
        quantities.set(point.type, 1);
      }
    });

    return this._sortMapByValues(quantities);
  }


  _getTime() {
    const time = new Map();

    this._points.forEach((point) => {
      if (time.has(point.type)) {
        const total = time.get(point.type) + getDiffDate(point.date.dateFrom, point.date.dateTo);
        time.set(point.type, total);
      } else {
        time.set(point.type, getDiffDate(point.date.dateFrom, point.date.dateTo));
      }
    });


    return this._sortMapByValues(time);
  }


  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }


    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const barNumber = this._types.length;
    const ctxHeight = Bar.HEIGHT * barNumber;
    moneyCtx.height = ctxHeight;
    typeCtx.height = ctxHeight;
    timeCtx.height = ctxHeight;


    const prices = this._getPrices();
    const moneyChartTypes = Array.from(prices.keys());
    const moneyChartMoney = Array.from(prices.values());


    const quantities = this._getQuantities();
    const typeChartTypes = Array.from(quantities.keys());
    const typeChartQuantities = Array.from(quantities.values());


    const time = this._getTime();
    const timeChartTypes = Array.from(time.keys());
    const timeChartTime = Array.from(time.values());


    this._moneyChart = renderMoneyChart(moneyCtx, moneyChartMoney, moneyChartTypes);
    this._typeChart = renderTypeChart(typeCtx, typeChartQuantities, typeChartTypes);
    this._timeChart = renderTimeSpendChart(timeCtx, timeChartTime, timeChartTypes);
  }
}
