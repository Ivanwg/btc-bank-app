import { DEFAULT_SORT_PREFERENCE } from './variables';


export function setToken(token) {
  sessionStorage.setItem('TOKEN', token);
}

export function getToken() {
  return sessionStorage.getItem('TOKEN')
}

export function clearToken() {
  sessionStorage.removeItem('TOKEN');
}


export function setATMsArrSessions(atms) {
  sessionStorage.setItem('ATMs', JSON.stringify(atms));
}

export function getATMsArrSessions() {
  return JSON.parse(sessionStorage.getItem('ATMs'));
}

export function setEarlierTransferAccounts(dataArr=[]) {
  localStorage.setItem('TRANSFER_ACCOUNTS', JSON.stringify(dataArr));
}

export function clearEarlierTransferAccounts() {
  localStorage.removeItem('TRANSFER_ACCOUNTS');
}

export function getEarlierTransferAccounts() {
  const accountsArr = JSON.parse(localStorage.getItem('TRANSFER_ACCOUNTS'));
  return accountsArr ? accountsArr  : [];
}

export function updateEarlierTransferAccounts(accountString) {
  const accountsArr = getEarlierTransferAccounts();
  console.log()
  const new_account = `${accountString}`;
  if (accountsArr.length && !accountsArr.includes(new_account)) {
    accountsArr.push(new_account);
    setEarlierTransferAccounts(accountsArr);
  } else if (!accountsArr.length) {
    setEarlierTransferAccounts([new_account]);
  }
}

export function setSortType(preference) {
  localStorage.setItem('SORT_PREFERENCE', preference);
}

export function getSortType() {
  const preference = localStorage.getItem('SORT_PREFERENCE');
  !preference && setSortType(DEFAULT_SORT_PREFERENCE);
  return localStorage.getItem('SORT_PREFERENCE');
}

export function setAccountsArr(arr) {
  arr.length && sessionStorage.setItem('ACCOUNTS_LIST', JSON.stringify(arr));
}

export function getAccountsArr() {
  const accounts = JSON.parse(sessionStorage.getItem('ACCOUNTS_LIST'));
  return Array.isArray(accounts) ? accounts : [];
}

export function clearAccountsArr() {
  sessionStorage.removeItem('ACCOUNTS_LIST');
}
