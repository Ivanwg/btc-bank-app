import { getById } from './helpful';
import { logout } from './log-in-out';
import { root, toMainBtn, toAtmsBtn, toAccountsBtn, toCurrencyBtn, logoutBtn } from './variables';
import { createATMsPage } from './atms';
import { createAccountsListPage } from './accountsList';
import { createCurrencyPage } from './currency';

const activeClassName = 'btn-white_active';

export function listenNavs() {

  toMainBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!checkIsNavBtnActive(toAccountsBtn)) {
      createAccountsListPage();
    }
  });

  toAtmsBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!checkIsNavBtnActive(e.target)) {
      deactivateAllOpenOne(e.target);
      createATMsPage();
    }
  });

  toAccountsBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!checkIsNavBtnActive(e.target)) {
      deactivateAllOpenOne(e.target);
      createAccountsListPage();
    }
  });

  toCurrencyBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!checkIsNavBtnActive(e.target)) {
      deactivateAllOpenOne(e.target);
      createCurrencyPage();
    }
  });

  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    deactivateAllNavs();
    logout();
  });
}

export function deactivateAllNavs() {
  for (const btnElem of [toAtmsBtn, toAccountsBtn, toCurrencyBtn]) {
    btnElem.classList.remove(activeClassName);
  }
}

function activateBtn(btnELem) {
  btnELem.classList.add(activeClassName);
}

export function deactivateAllOpenOne(btnELem) {
  deactivateAllNavs();
  activateBtn(btnELem);
}

function checkIsNavBtnActive(btnELem) {
  return btnELem.classList.contains(activeClassName)
}
