import { createELement, getSortedByDateFromNowArr, formatNumberDate, stringToFixed } from '../helpful';

let accountNumber;

export function createTransactionsTable(resObj, count) {
  accountNumber = resObj.account;
  const blockName = 'transfers-table';
  const table = createELement({elemName: 'table', attrs: {classNames: [blockName]}});
  const thead = createELement({elemName: 'thead', attrs: {classNames: [`${blockName}__head`]}});
  const theadTr = createELement({elemName: 'tr', attrs: {classNames: [`${blockName}__tr`, `${blockName}__tr_head`]}});
  const arr = ['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата']
  for (const nameIndex in arr) {
    const th = createELement({elemName: 'th', attrs: {classNames: [`${blockName}__th`]}});
    const title = createELement({attrs: {text: arr[nameIndex], classNames: [`${blockName}__title`]}});
    th.append(title);
    theadTr.append(th);
  }
  thead.append(theadTr);

  const tbody = createELement({elemName: 'tbody', attrs: {classNames: [`${blockName}__body`]}});
  const transactionsArr = getSortedByDateFromNowArr(resObj.transactions.slice(0, count));

  for (const transaction of transactionsArr) {
    const tr = createELement({elemName: 'tr', attrs: {classNames: [`${blockName}__tr`, `${blockName}__tr_body`]}});

    const fromWrap = createELement({attrs: {text: `${transaction.from}`, classNames: [`${blockName}__item`]}});
    const toWrap = createELement({attrs: {text: `${transaction.to}`, classNames: [`${blockName}__item`]}});
    const dateWrap = createELement({attrs: {text: formatNumberDate(transaction.date), classNames: [`${blockName}__item`]}});
    const priceText = transaction.from === accountNumber ? `- ${stringToFixed(transaction.amount)} ₽` : `+ ${stringToFixed(transaction.amount)} ₽`;
    const priceStyle = transaction.from === accountNumber ? 'negative' : 'positive';
    const priceWrap = createELement({attrs: {text: priceText, classNames: [`${blockName}__item`, priceStyle]}});
    for (const elem of [fromWrap, toWrap, priceWrap, dateWrap]) {
      const td = createELement({elemName: 'td', attrs: {classNames: [`${blockName}__td`]}});
      td.append(elem);
      tr.append(td);
    }
    tbody.append(tr);
  }




  table.append(thead, tbody);

  return table;
}
