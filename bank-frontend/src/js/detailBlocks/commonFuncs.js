import { stringToFixed, getSortedByDateFromNowArr, createELement } from '../helpful';
import { MONTHS_LABELS } from '../variables';




export function getBalanceMonthsArr(respObj, count=12, relations=false) {
  const newBalanceMonthsObj = {};
  const newRelationsObj = {};
  let nowBalance = respObj.balance;
  const mainAccount = respObj.account;
  const monthsBalancesObject = {};
  const relationsObj = {};
  const transactions = getSortedByDateFromNowArr(respObj.transactions);
  const minDayOnj = new Date(new Date().setMonth(new Date().getMonth() - 11))
  const minDate = new Date(
    minDayOnj.getFullYear(),
    minDayOnj.getMonth(),
    1,
    0, 0, 0, 0
  );


  // очищаем транзакции от устаревших и заполняем календарный словарь
  for (const transactionIndex in transactions) {
    const transaction = transactions[transactionIndex]
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (date >= minDate) {
      if (!monthsBalancesObject.hasOwnProperty(year)) monthsBalancesObject[year] = {};
      const monthObj = monthsBalancesObject[year];

      // if (!monthObj.hasOwnProperty(month)) monthObj[month] = [];
      // const transactionsArr = monthObj[month];

      // transactionIndex === '0' && transactionsArr.push(nowBalance);

      // if (transaction.from === mainAccount) {
      //   nowBalance += transaction.amount;
      // } else {
      //   nowBalance -= transaction.amount;
      // }
      // transactionsArr.push(nowBalance);

      if (!monthObj.hasOwnProperty(month)) monthObj[month] =  0;


      if (transaction.to === mainAccount) {
        monthObj[month] += transaction.amount;
      }
      if (relations) {
        if (!relationsObj.hasOwnProperty(year)) relationsObj[year] = {};
        const monthRelationsObj = relationsObj[year];
        if (!monthRelationsObj.hasOwnProperty(month)) monthRelationsObj[month] = 0;
        if (transaction.from === mainAccount) {
          monthRelationsObj[month] += transaction.amount;
        }
      }

    }
    else {
      break;
    }
  }
  // для каждого месяца вычисляем максимальный баланс
  // for (const yearKey of Object.keys(monthsBalancesObject)) {
  //   for (const monthKey of Object.keys(monthsBalancesObject[yearKey])) {
  //     monthsBalancesObject[yearKey][monthKey] = Math.max(...monthsBalancesObject[yearKey][monthKey]);
  //   }
  // }


  Object.keys(monthsBalancesObject)
    .forEach(yearObj => {
      Object.keys(monthsBalancesObject[yearObj]).forEach(month => {
        newBalanceMonthsObj[month] = monthsBalancesObject[yearObj][month]
     });
    });

  relations && Object.keys(relationsObj)
  .forEach(yearObj => {
    Object.keys(relationsObj[yearObj]).forEach(month => {
      newRelationsObj[month] = relationsObj[yearObj][month]
   });
  });
  return relations ? {
    relations: getActualBalancesArr(newRelationsObj, count),
    balanceArr: getActualBalancesArr(newBalanceMonthsObj, count),
  } : getActualBalancesArr(newBalanceMonthsObj, count);
}

function getActualBalancesArr(obj, count) {
  const monthIndex = new Date().getMonth() + 1;
  const objArr = Object.keys(obj);
  const actualArr = [];
  for (let i=0; i < 12; i++) {
    if (objArr.includes(`${i}`)) {
      actualArr.push(obj[`${i}`]);
    } else {
      actualArr.push(0);
    }
  }
  const newArr = actualArr.slice(monthIndex).concat(actualArr.slice(0, monthIndex));
  return count === 12 ? newArr : newArr.slice(count, 12);
}

export function getActualLabelsArr(amount) {
  const monthIndex = new Date().getMonth() + 1;
  const newArr = MONTHS_LABELS.slice(monthIndex).concat(MONTHS_LABELS.slice(0, monthIndex));
  return amount === 12 ? newArr : newArr.slice(amount, 12);
}


export function createEmptyTransactionsFiller() {
  const wrap = createELement({attrs: {text: 'Пока тут пусто. Начните тратить, и всё появится', classNames: ['account-block-filler']}});
  return wrap;
}
