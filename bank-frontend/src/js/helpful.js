import { root, mainNav } from './variables';
import { createHome } from './homePage';
import moment from 'moment';

export function getById(id) {
  const elem = document.getElementById(id);
  return elem;
}

export function createELement({elemName='div', attrs={}}) {
  const elem = document.createElement(elemName);
  if (Object.keys(attrs).length) {
    for (const attrKey of Object.keys(attrs)) {
      if (attrKey == 'classNames') {
        classListAddFromArr(elem, attrs[attrKey]);
      }
      else if (attrKey == 'text') {
        elem.textContent = attrs[attrKey];
      }
      else elem.setAttribute(attrKey, attrs[attrKey]);
    }
  }

  return elem;
}

export function clearRoot() {
  root.innerHTML = '';
}

export function clearElemsTextContent(elem) {
  elem.textContent = '';
}

export function classListAddFromArr(elem, classNamesList) {
  for (const className of classNamesList) {
    elem.classList.add(className);
  }
}

export function makeDisabled(elem) {
  elem.classList.add('disabled');
}

export function disableMainNav() {
  mainNav.classList.add('disabled');
}

export function displayMainNav() {
  mainNav.classList.remove('disabled');
}


export function formatDate(date, g=false) {
  const format = g ? 'LL' : 'D MMMM YYYY';
  moment.locale('ru');
  const dateDate = new Date(date);
  return moment(dateDate).format(format);
}

export function formatNumberDate(date) {
  const format = 'L';
  moment.locale('ru');
  const dateDate = new Date(date);
  return moment(dateDate).format(format);
}


export function createPageCommonTopContent({title, numberValue, balanceValue, rootClassName}) {
  const contentWrap = createELement({attrs: {classNames: ['common-top', `${rootClassName}__top-content`]}});
  const top = createELement({attrs: {classNames: ['common-top__top', `${rootClassName}__top-of-top`]}});
  const bottom = createELement({attrs: {classNames: ['common-top__bottom', `${rootClassName}__bottom-of-top`]}});

  const titleH1 = createELement({elemName: 'h1', attrs: {text: title, classNames: ['title-h1', `${rootClassName}__title`]}});
  const accNumber = createELement({elemName: 'p', attrs: {text: `№ ${numberValue}`, classNames: ['common-top__numbers', `${rootClassName}__numbers`]}});

  const balance = createELement({elemName: 'div', attrs: {classNames: ['common-top__balance-wrap', `${rootClassName}__balance-wrap`]}});
  const balanceKey = createELement({elemName: 'p', attrs: {text: 'Баланс', classNames: ['common-top__balance-key', `${rootClassName}__balance-key`]}});
  const balanceContent = createELement({elemName: 'p', attrs: {text: `${stringToFixed(balanceValue)} ₽`, classNames: ['common-top__balance-value', `${rootClassName}__balance-value`]}});
  balance.append(balanceKey, balanceContent);

  const btn = createELement({elemName: 'button', attrs: {
    text: 'Вернуться назад',
    classNames: [
      'btn',
      'btn-blue',
      'btn-blue_normal',
      'btn-blue_with-arrow',
      'common-top__btn',
      `${rootClassName}__btn`
    ],
  }});

  btn.addEventListener('click', e => {
    e.preventDefault();
    createHome();
  })

  top.append(titleH1, btn);
  bottom.append(accNumber, balance);


  contentWrap.append(top, bottom);

  return {content: contentWrap, balanceWrap: balanceContent};
}

export function stringToFixed(numbStr) {
  let res;
  try {
    res = (parseInt(Number(numbStr) * 100)) / 100;

  }
  catch (err) {
    res = 0.00
  }
  return Number.isInteger(res) ? `${res}` + '.0' : `${res}`;
}

export function clearInputsValues(inputsArr) {
  for (const input of inputsArr) {
    input.value = '';
  }
}

export function clearElemsInnerHtml(elemsArr) {
  for (const elem of elemsArr) {
    elem.innerHTML = '';
  }
}

export function removeClassNameFromElemsArr(elemsArr, className) {
  for (const elem of elemsArr) {
    elem.classList.remove(className);
  }
}

export function getLastFromArr(arr, amount, reverse=false) {
  const sign = amount * -1;
  if (arr) {
    arr.lenthg > amount ? arr.slice(sign) : arr;
    return reverse ? arr.reverse() : arr;
  } else return [];
}

export function returnDateOrNow(transactionsArr) {
  return transactionsArr.length ? transactionsArr[0].date : new Date(Date.now()).toISOString();
}

export function getSortedByDateFromNowArr(arr) {
  return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getSortedByDateToNowArr(arr) {
  return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function checkArrLength(obj, key) {
  try {
    if (obj[key].length) {
      return true;
    }
    else return false;
  } catch (err) {
    return false;
  }
}
