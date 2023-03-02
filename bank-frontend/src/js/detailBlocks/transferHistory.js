import { createELement, checkArrLength } from '../helpful';
import { createBalanceDetailPage } from '../balanceDetail';
import { createTransactionsTable } from './table';
import { createEmptyTransactionsFiller } from './commonFuncs';



export function createTransfersHistoryBlock(resObj=null, count=0) {
  const wrap = createELement({attrs: {classNames: ['transfer-history']}});
  const contentWrap = createELement({attrs: {classNames: ['transfer-history__content']}});
  const title = createELement({elemName: 'h2', attrs: {text: 'История переводов', classNames: ['transfer-history__title']}});
  const tableWrap = createELement({attrs: {classNames: ['transfer-history__table-wrap']}});
  const filler = createELement({attrs: {text: 'Подождите', classNames: ['account-block-filler', 'balance-history__filler']}});

  contentWrap.append(title);
  if (!resObj) {
    contentWrap.append(filler);
  } else {
    const table = checkArrLength(resObj, 'transactions') ? createTransactionsTable(resObj, count) : createEmptyTransactionsFiller();
    tableWrap.append(table);
    contentWrap.append(tableWrap);
  }
  wrap.append(contentWrap);

  if (resObj && checkArrLength(resObj, 'transactions') && count === 10) {
    wrap.classList.add('pointered');
    wrap.addEventListener('click', e => {
      createBalanceDetailPage(resObj);
    });
  }

  return wrap;
}
