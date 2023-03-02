import { clearRoot, displayMainNav, createELement, getById, formatDate, stringToFixed, returnDateOrNow } from "./helpful";
import { root, toAccountsBtn, UNIDENTIFIED_ERR_TEXT, SERVER_ERR_TEXT } from "./variables";
import { deactivateAllOpenOne } from './navs';
import { apiUserAccounts, createNewAccount } from './requests';
import { getToken, setSortType, getSortType, getAccountsArr, setAccountsArr, clearAccountsArr } from './storage';
import { createLoginPage } from './log-in-out';
import { createAccountDetailPage } from './accountDetail';

const SORT_BTN = createELement({elemName: 'button', attrs: {text: 'Сортировка', classNames: ['input', 'select', 'accounts__sort-btn']}});
const DROPDOWN = createDropDown();
const CARDS_UL = createELement({elemName: 'ul', attrs: {classNames: ['accounts-list', 'accounts__list']}});
const MAIN_ERR_WRAP = createELement({attrs: {classNames: ['accounts__errs-wrap']}});

SORT_BTN.addEventListener('click', e => {
  e.preventDefault();
  e._dropDownClicked = true;
  toggleSortDropDown();
});

export function createAccountsListPage() {
  clearRoot();
  deactivateAllOpenOne(toAccountsBtn);
  displayMainNav();
  root.append(createAccountsListContent());
}

function createAccountsListContent() {
  const contentWrap = createELement({elemName: 'section', attrs: {classNames: ['section', 'accounts']}});

  const topContent = createELement({attrs: {classNames: ['accounts__top-content']}})
  const topLeftContent = createELement({attrs: {classNames: ['accounts__top-left']}})
  const titleH1 = createELement({elemName: 'h1', attrs: {text: 'Ваши счета', classNames: ['title-h1']}});
  const sortBlock = createELement({attrs: {classNames: ['accounts__sort-wrap']}});

  sortBlock.append(SORT_BTN, DROPDOWN);


  const topRightContent = createELement({attrs: {classNames: []}});

  const accountsWrap = createELement({attrs: {classNames: ['accounts__cards-wrap']}});
  fillAccountsUl();

  const createNewAcBtn = createNewAccountBtn();

  topLeftContent.append(titleH1, sortBlock);
  topRightContent.append(createNewAcBtn);
  topContent.append(topLeftContent, topRightContent);

  accountsWrap.append(MAIN_ERR_WRAP, CARDS_UL);
  contentWrap.append(topContent, accountsWrap);

  listenThisPage(contentWrap);

  return contentWrap;
}


function fillAccountsUl() {
  MAIN_ERR_WRAP.innerHTML = '';
  CARDS_UL.innerHTML = '';
  const storageAccounts = getAccountsArr();
  storageAccounts.length && fillWithCards(storageAccounts);
  !storageAccounts.length && apiUserAccounts().then(accounts => {
    setAccountsArr(accounts);
    fillWithCards(accounts);
  }).catch(err => {
    if (err.name == 'LoginError' && !getToken()) {
       createLoginPage()
    } else if (err.name == 'AxiosError') {
      MAIN_ERR_WRAP.textContent = SERVER_ERR_TEXT;
    } else {
      MAIN_ERR_WRAP.textContent = UNIDENTIFIED_ERR_TEXT;
      console.log(err)
    }
  });
}

function createAccountCard({accountNumber, balance=0, lastTransactionDate=null}) {
  balance = stringToFixed(balance);
  const cardWrap = createELement({attrs: {classNames: ['account-card']}});
  const topWrap = createELement({attrs: {classNames: []}});
  const bottomWrap = createELement({attrs: {classNames: ['account-card__footer']}});

  const titleH2 = createELement({elemName: 'h2', attrs: {text: accountNumber, classNames: ['account-card__title']}});
  const balanceElem = createELement({elemName: 'p', attrs: {text: `${stringToFixed(balance)} ₽`, classNames: ['account-card__balance']}});
  topWrap.append(titleH2, balanceElem);

  const bottomLeft = createELement({attrs: {classNames: ['account-card__b-left']}});
  const bottomRight = createELement({attrs: {classNames: []}});

  if (lastTransactionDate) {
    const titleH3 = createELement({elemName: 'h3', attrs: {text: 'Последняя транзакция:', classNames: ['account-card__title-l2']}});
    const dateValue = createELement({elemName: 'p', attrs: {text: lastTransactionDate, classNames: ['account-card__date']}});
    bottomLeft.append(titleH3, dateValue);
  } else {
    const titleH3 = createELement({elemName: 'h3', attrs: {text: 'Транзакции отсутствуют', classNames: ['account-card__title-l2']}});
    bottomLeft.append(titleH3);
  }

  const openAccBtn = createELement({elemName: 'button', attrs: {text: 'Открыть', classNames: ['btn', 'btn-blue', 'btn-blue_normal', 'account-card__btn']}});
  openAccBtn.addEventListener('click', e => {
    e.preventDefault();
    createAccountDetailPage(accountNumber, balance);
  });
  bottomRight.append(openAccBtn);


  bottomWrap.append(bottomLeft, bottomRight);
  cardWrap.append(topWrap, bottomWrap);

  return cardWrap;
}

function createNewAccountBtn() {
  const btn = createELement({elemName: 'button', attrs: {text: 'Создать новый счёт',
    classNames: ['btn', 'btn-blue', 'btn-blue_normal', 'accounts__create-acc-btn']}});

  btn.addEventListener('click', e => {
    createNewAccount().then(newAccount => {
      clearAccountsArr();
      fillAccountsUl();
    });
  });

  return btn;
}

function createDropDown() {
  const contentWrap = createELement({attrs: {classNames: ['dropdown', 'dropdown_select', 'disabled']}});
  const accountsUl = createELement({elemName: 'ul', attrs: {classNames: ['dropdown__list']}});

  const byNumberBtn = createELement({elemName: 'button', attrs: {text: 'По номеру', classNames: ['btn', 'dropdown__btn']}});
  const byBalanceBtn = createELement({elemName: 'button', attrs: {text: 'По балансу', classNames: ['btn', 'dropdown__btn']}});
  const byLastTransactionBtn = createELement({elemName: 'button', attrs: {text: 'По последней транзакции', classNames: ['btn', 'dropdown__btn']}});
  const btnsArr = [byNumberBtn, byBalanceBtn, byLastTransactionBtn];
  for (const btn of btnsArr) {
    const elemLi  = createELement({elemName: 'li', attrs: {classNames: ['dropdown__item']}});
    elemLi.append(btn);
    accountsUl.append(elemLi);
  }

  let defaultBtn;
  const storageType = getSortType();
  if (storageType === 'ACCOUNT') {
    defaultBtn = byNumberBtn;
  } else if (storageType === 'BALANCE') {
    defaultBtn = byBalanceBtn;
  } else if (storageType === 'DATE') {
    defaultBtn = byLastTransactionBtn;
  }
  addOneClearOtherClasses('dropdown__btn_select-open', defaultBtn, btnsArr);


  byNumberBtn.addEventListener('click', e => {
    e.preventDefault();
    closeSortDropDown();
    const typeName = 'ACCOUNT';
    if (typeName === getSortType()) {
      return;
    }
    addOneClearOtherClasses('dropdown__btn_select-open', e.target, btnsArr);
    setSortType(typeName);
    fillAccountsUl();
  });

  byBalanceBtn.addEventListener('click', e => {
    e.preventDefault();
    closeSortDropDown();
    const typeName = 'BALANCE';
    if (typeName === getSortType()) {
      return;
    }
    addOneClearOtherClasses('dropdown__btn_select-open', e.target, btnsArr);
    setSortType(typeName);
    fillAccountsUl();
  });

  byLastTransactionBtn.addEventListener('click', e => {
    e.preventDefault();
    closeSortDropDown();
    const typeName = 'DATE';
    if (typeName === getSortType()) {
      return;
    }
    addOneClearOtherClasses('dropdown__btn_select-open', e.target, btnsArr);
    setSortType(typeName);
    fillAccountsUl();
  });

  contentWrap.addEventListener('click', e => {
    e._dropDownClicked = true;
  });

  contentWrap.append(accountsUl);
  return contentWrap;
}


function openSortDropDown() {
  SORT_BTN.classList.add('accounts__sort-btn_open');
  DROPDOWN.classList.remove('disabled');
}

function closeSortDropDown() {
  SORT_BTN.classList.remove('accounts__sort-btn_open');
  DROPDOWN.classList.add('disabled');
}

function toggleSortDropDown() {
  SORT_BTN.classList.toggle('accounts__sort-btn_open');
  DROPDOWN.classList.toggle('disabled');
}

function listenThisPage(mainWrap) {
  mainWrap.addEventListener('click', e => {
    if (e._dropDownClicked) return;
    closeSortDropDown()
  })
}

function sortDepenOnLocalStorage(arr) {
  let newArr;
  const sortType = getSortType();
  if (sortType === 'BALANCE') {
    newArr = arr.sort((a, b) => a.balance - b.balance);
  } else if (sortType === 'DATE') {
    newArr = arr.sort((a, b) => new Date(returnDateOrNow(a.transactions)) - new Date(returnDateOrNow(b.transactions)));
  } else if (sortType === 'ACCOUNT') {
    newArr = arr.sort((a, b) => parseInt(a.account) - parseInt(b.account));
  } else return arr;
  return newArr;
}

function fillWithCards(arr) {
  const sortedArray = sortDepenOnLocalStorage(arr);

  for ( const accountObj of sortedArray ) {
      const itemLi = createELement({elemName: 'li'});
      const lastTransactionDate = accountObj.transactions.length ? formatDate(accountObj.transactions[0].date) : null;
      const card = createAccountCard(
        {
          accountNumber: accountObj.account,
          balance: accountObj.balance,
          lastTransactionDate: lastTransactionDate,
        }
      );
      itemLi.append(card);
      CARDS_UL.append(itemLi);
    }
}

function addOneClearOtherClasses(className, elem, elemsArr) {
  for (const elem of elemsArr) {
    elem.classList.remove(className);
  }

  elem.classList.add(className);

}
