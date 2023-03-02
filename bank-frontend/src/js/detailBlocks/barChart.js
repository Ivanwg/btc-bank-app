import { createELement, stringToFixed } from '../helpful';
import { getBalanceMonthsArr, getActualLabelsArr } from './commonFuncs';
import{ mainBlue, blueHover, black, pink, green } from '../variables';

import Chart from 'chart.js/auto';



export function createChart(resObj, count) {
  const canvas = createELement({elemName: 'canvas', attrs: {classNames: ['canvas']}});
  const labels = getActualLabelsArr(count);
  const dataArray = getBalanceMonthsArr(resObj, count);
  const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { left, top, width, height } } = chart;

      ctx.save();
      ctx.strokeStyle = black;
      ctx.lineWidth = 1;
      ctx.strokeRect(left + 1, top, width, height);
      ctx.restore();
    }
  };
  const data = {
    labels: labels,
    datasets: [{
      label: '',
      data: dataArray,
      backgroundColor: mainBlue,
      hoverBackgroundColor: blueHover,
      borderWidth: 0
    }]
  };
  const chart = new Chart(canvas, {
    type: 'bar',
    plugins: [ chartAreaBorder ],
    data: data,
    borderColor: mainBlue,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        background: null,
        padding: 0,
      },
      scales: {
        y: {
          position: 'right',
          beginAtZero: true,
          max: Math.max(...dataArray),
          grid: {
            display: false,
          },
          ticks: {
            backdropPadding: 10,
            stepSize: Math.max(...dataArray),
            maxTicksLimit: 3,
            callback: function(val, index) {
              const twoArr = [0, Math.max(...dataArray)]
              if (index < twoArr.length) return stringToFixed(twoArr.sort((a, b) => a - b)[index]);
              else return
            },

            font: {
              family: 'WorkSans',
              weight: 500,
              size: 20,
              // lineHeight: 1.2,
            },
            color: black,
            padding: 8,

          },
          afterFit: (axis) => {
            axis.paddingLeft = 0;
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'WorkSans',
              weight: 700,
              size: 20,
            },
            color: black,

          },
        },
      },
      plugins: {
        tooltip: {
          enabled: false
        },
        legend: {
          display: null
        },
      },
    },
  });
  return canvas;
}


export function createRelationChart(resObj) {
  const count = 12;
  const canvas = createELement({elemName: 'canvas', attrs: {classNames: ['canvas']}});
  const labels = getActualLabelsArr(count);
  const dataRelationsObj = getBalanceMonthsArr(resObj, count, true);
  const dataArray = dataRelationsObj.balanceArr;
  const relationsArray = dataRelationsObj.relations;
  const ticksArr = [0, Math.max(...dataArray) - Math.min(...dataArray), Math.max(...relationsArray)];
  const chartAreaBorder = {
    id: 'chartAreaBorderRelation',
    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { left, top, width, height } } = chart;

      ctx.save();
      ctx.strokeStyle = black;
      ctx.lineWidth = 1;
      ctx.strokeRect(left + 1, top, width, height);
      ctx.restore();
    }
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: dataArray,
        backgroundColor: green,
        borderWidth: 0,
        order: 2,
      },
      {
        label: '',
        data: relationsArray,
        backgroundColor: pink,
        borderWidth: 0,
        order: 1,
      }
    ]
  };
  const chart = new Chart(canvas, {
    type: 'bar',
    plugins: [ chartAreaBorder ],
    data: data,
    borderColor: mainBlue,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        background: null,
        padding: 0,
      },
      scales: {
        y: {
          position: 'right',
          beginAtZero: true,
          max: Math.max(...dataArray),
          grid: {
            display: false,
          },
          ticks: {
            backdropPadding: 10,
            // stepSize: Math.max(...dataArray) - Math.min(...dataArray) ,
            maxTicksLimit: 4,
            callback: function(val, index) {
              if (index < ticksArr.length) return stringToFixed(ticksArr.sort((a, b) => a - b)[index]);
              else return
            },
            font: {
              family: 'WorkSans',
              weight: 500,
              size: 20,
              // lineHeight: 1.2,
            },
            color: black,
            padding: 8,

          },
          afterFit: (axis) => {
            axis.paddingLeft = 0;
          }
        },
        x: {
          stacked: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'WorkSans',
              weight: 700,
              size: 20,
            },
            color: black,

          },
        },
      },
      plugins: {
        tooltip: {
          enabled: false
        },
        legend: {
          display: null
        },
      },
    },
  });
  return canvas;
}
