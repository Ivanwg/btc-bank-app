import { createELement, checkArrLength } from '../helpful';
import { apiUserAccountDetail } from '../requests';
import { getBalanceMonthsArr, getActualLabelsArr, createEmptyTransactionsFiller } from './commonFuncs';
import { createBalanceDetailPage } from '../balanceDetail';
import{ mainBlue, blueHover, black } from '../variables';
import { createChart, createRelationChart } from './barChart';


export function createBalanceDynamicBlock(resObj=null, count=0) {
  const wrap = createELement({attrs: {classNames: ['balance-history']}});
  const contentWrap = createELement({attrs: {classNames: ['balance-history__content']}});
  const title = createELement({elemName: 'h2', attrs: {text: 'Динамика баланса', classNames: ['balance-history__title']}});
  const chartWrap = createELement({attrs: {classNames: ['balance-history__chart-wrap']}});
  const filler = createELement({attrs: {text: 'Подождите', classNames: ['account-block-filler', 'balance-history__filler']}});



  contentWrap.append(title);
  if (!resObj) {
    contentWrap.append(filler);
  } else {
    const canvas = resObj.transactions.length ? createChart(resObj, count) : createEmptyTransactionsFiller();
    chartWrap.append(canvas);
    contentWrap.append(chartWrap);

    if (resObj && checkArrLength(resObj, 'transactions') && count === 6) {
      wrap.classList.add('pointered');
      wrap.addEventListener('click', e => {
        createBalanceDetailPage(resObj);
      });
    }

  }
  wrap.append(contentWrap);



  return wrap;
}


export function createTransactionsRelationBlock(resObj=null) {
  const wrap = createELement({attrs: {classNames: ['balance-history']}});
  const contentWrap = createELement({attrs: {classNames: ['balance-history__content']}});
  const title = createELement({elemName: 'h2', attrs: {text: 'Соотношение входящих исходящих транзакций', classNames: ['balance-history__title']}});
  const chartWrap = createELement({attrs: {classNames: ['balance-history__chart-wrap']}});


  // const canvas = ''
  const canvas = resObj.transactions.length ? createRelationChart(resObj) : createEmptyTransactionsFiller();
  chartWrap.append(canvas);

  contentWrap.append(title, chartWrap);

  wrap.append(contentWrap);



  return wrap;
}




