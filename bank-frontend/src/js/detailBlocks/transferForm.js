import {
  createELement,
  stringToFixed,
  clearElemsTextContent,
  clearInputsValues,
  clearElemsInnerHtml,
  removeClassNameFromElemsArr,
  getLastFromArr,
} from "../helpful";
import { SERVER_ERR_TEXT } from "../variables";
import { apiTransfer } from '../requests';
import { getToken, updateEarlierTransferAccounts, getEarlierTransferAccounts, clearAccountsArr } from '../storage';


let accountNumber;
let balance;
let currentBalanceWrap;


export function createNewTransferForm(number, balanceValue, balanceWrap) {
  accountNumber = number;
  balance = balanceValue;
  currentBalanceWrap = balanceWrap;
  const formWrap = createELement({attrs: {classNames: ['transfer', 'account-detal__transfer']}});
  const title = createELement({elemName: 'h2', attrs: {text: 'Новый перевод', classNames: ['transfer__title']}});
  const form = createELement({elemName: 'form', attrs: {classNames: ['transfer__form']}});
  const accountLabel = createELement({elemName: 'label', attrs: {'classNames': ['transfer__label']}});
  const accountSpan = createELement({elemName: 'span', attrs: {'text': 'Номер счёта получателя', 'classNames': ['transfer__label-text']}});
  const accountInput = createELement({elemName: 'input', attrs: {
    'placeholder': 'Placeholder',
    'classNames': ['input', 'text-input', 'transfer__input', 'transfer__input_select'],
    'type': 'number',
  }});
  const accountListSpan = createELement({elemName: 'span', attrs: {classNames: ['open-list-icon']}});
  const errAccountWrap = createELement({elemName: 'span', attrs: {'classNames': ['transfer__errs-wrap']}});

  const accountValidationIconWrap = createELement({attrs: {'classNames': ['transfer__icon-wrap']}});
  const dropDownObj = createEarliarAccounts();
  const dropDown = dropDownObj.wrap;
  const accountsUl = dropDownObj.ul;


  const sumLabel = createELement({elemName: 'label', attrs: {'classNames': ['transfer__label']}});
  const sumSpan = createELement({elemName: 'span', attrs: {'text': 'Сумма перевода', 'classNames': ['transfer__label-text']}});
  const sumInput = createELement({elemName: 'input', attrs: {
    'placeholder': 'Placeholder',
    'classNames': ['input', 'text-input', 'transfer__input'],
    'type': 'number',
    'step': '0.01'
  }});
  const errSumWrap = createELement({attrs: {'classNames': ['transfer__errs-wrap']}});
  const sumValidationIconWrap = createELement({elemName: 'span', elemName: 'div', attrs: {'classNames': ['transfer__icon-wrap']}});

  accountLabel.append(accountSpan, accountInput, errAccountWrap, accountValidationIconWrap, accountListSpan, dropDown);
  sumLabel.append(sumSpan, sumInput, errSumWrap, sumValidationIconWrap);

  const mainErrsWrap = createELement({attrs: {'classNames': ['transfer__errs-wrap', 'transfer__errs-wrap_main']}});

  const submitBtn = createELement({elemName: 'button', attrs: {'text': 'Отправить', 'classNames': ['btn', 'btn-blue', 'btn-blue_normal', 'btn-blue_letter', 'transfer__btn']}});

  form.addEventListener('submit', e => {
    e.preventDefault();
    onTransferSubmit(accountInput, sumInput, errAccountWrap, errSumWrap, accountValidationIconWrap, sumValidationIconWrap, mainErrsWrap);
  });

  preventInputSigns(accountInput);
  preventInputSigns(sumInput, true);
  listenAccountInput(accountInput, dropDown, accountsUl, accountListSpan, checkInputValue.bind(null, accountInput, errAccountWrap, accountValidationIconWrap, 'account'));
  listenBalanceInputBlur(sumInput, checkInputValue.bind(null, sumInput, errSumWrap, sumValidationIconWrap, 'sum'));

  form.append(accountLabel, sumLabel, mainErrsWrap, submitBtn);
  formWrap.append(title, form);

  return {formWrap: formWrap, closeDropDownFnc: closeDropDown.bind(null, dropDown, accountListSpan)};
}


function onTransferSubmit(accountInput, sumInput, errAccountWrap, errSumWrap, accountIconWrap, sumIconWrap, mainErrsWrap) {
  const isAccountCorrect = checkInputValue(accountInput, errAccountWrap, accountIconWrap, 'account');
  const isSumCorrect = checkInputValue(sumInput, errSumWrap, sumIconWrap, 'sum');
  if (isAccountCorrect && isSumCorrect) {
    apiTransfer({from: accountNumber, to: accountInput.value, amount: sumInput.value}).then(res => {
      console.log(res)
      updateEarlierTransferAccounts(accountInput.value);
      clearInputsValues([accountInput, sumInput]);
      clearElemsInnerHtml([accountIconWrap, sumIconWrap]);
      removeClassNameFromElemsArr([accountInput, sumInput], 'input-error');
      removeClassNameFromElemsArr([accountInput, sumInput], 'input-success');
      currentBalanceWrap.textContent = stringToFixed(res.balance) + ' ₽';
      clearAccountsArr();
    }).catch(err => {
      console.log(err, err.message)
      if (err.name === 'InvalidAccountError') {
        errorInput(accountInput, err.message, errAccountWrap, accountIconWrap);
      } else if (err.name === 'OverdraftError') {
        errorInput(sumInput, err.message, errSumWrap, sumIconWrap);
      } else {
        mainErrsWrap.textContent = SERVER_ERR_TEXT;
      }
    });
  }

}

function checkInputValue(input, errField, iconWrap, type) {
  const value = input.value;
  let isCorrect = true;
  let errText = '';
  if (Number(value) < 0) {
    errText = 'Содержится отрицательное';
    isCorrect = false;
  } else if (!value.length) {
    errText = 'Передано пустое значение';
    isCorrect = false
  } else if (type === 'sum' && Number(value) < 0.01) {
    errText = 'Минимальная сумма: 0.01 ₽';
    isCorrect = false
  } else if (type === 'sum' && Number(value) > balance) {
    errText = 'Недостаточно средств на счёте';
    isCorrect = false
  } else if (type === 'account' && input.value === accountNumber) {
    errText = 'Перевод на этот же счет невозможен';
    isCorrect = false
  } else {
    clearElemsTextContent(errField);
  }
  if (isCorrect) {
    const successIcon = createELement({elemName: 'span', attrs: {'classNames': ['transfer__icon', 'transfer__icon_success']}});
    iconWrap.innerHTML = '';
    iconWrap.append(successIcon);
    input.classList.remove('input-error');
    input.classList.add('input-success');
    errText = '';
  }
  else {
    errorInput(input, errText, errField, iconWrap);
  }
  return isCorrect;
}

function errorInput(input, errText, errField, iconWrap) {
  const errIcon = createELement({elemName: 'span', attrs: {'classNames': ['transfer__icon', 'transfer__icon_error']}});
  iconWrap.innerHTML = '';
  iconWrap.append(errIcon);
  input.classList.remove('input-success');
  input.classList.add('input-error');
  errField.textContent = errText;
}

function preventInputSigns(input, floatPossible=false) {
  const restricedSigns = floatPossible ? [32, 44, 45, 101] : [32, 44, 45, 46, 101];
  const regex = floatPossible ? /[e\s-]/ig : /[e\s-.,]/ig;
  input.addEventListener('keypress', e => {
    const inputValue = e.target.value;
    if (restricedSigns.includes(e.keyCode)) {
      e.preventDefault();
    } else if (floatPossible && (!inputValue.length && e.keyCode == 46) || (inputValue.length > 3 && inputValue.slice(-3).startsWith('.'))) {
      e.preventDefault();
    }
  });
  input.addEventListener('paste', e => {
    let data = e.clipboardData.getData('text').replaceAll(regex, '')
    data = floatPossible ? stringToFixed(data) : data;
    e.preventDefault();
    input.value += data;
  });

}

function listenAccountInput(input, dropDown, accountsUl, icon, onBlur) {
  let storageAccounts = [];
  let isDropDownOpened = false;
  input.addEventListener('focus', e => {
    storageAccounts = getEarlierTransferAccounts();
  });

  input.addEventListener('click', e => {
    e._dropDOwnClicked = true;
  });

  input.addEventListener('input', e => {
    const accountsToDisplay = [];
    if (e.target.value) {
      for (const accountStorageNumb of storageAccounts) {
        if (accountStorageNumb.startsWith(e.target.value) && accountStorageNumb!== accountNumber) {
          accountsToDisplay.push(accountStorageNumb);
        }
      }
    } else accountsToDisplay.length = 0;
    if (accountsToDisplay.length) {
      fillEarliarAccounts(getLastFromArr(accountsToDisplay, 5, true), accountsUl, input, closeDropDown.bind(null, dropDown, icon));
      if (!isDropDownOpened) {
        isDropDownOpened = true;
      }
      openDropDown(dropDown, icon);

    } else {
      closeDropDown(dropDown, icon);
      isDropDownOpened = false;
    }
  });

  input.addEventListener('blur', e => {
    // closeDropDown(input, dropDown, icon);
    // isDropDownOpened = false;
    onBlur();
  });
}

function listenBalanceInputBlur(input, onBlur) {

  input.addEventListener('blur', e => {
    onBlur();
  });
}

function openDropDown(dropDown, icon) {
  icon.classList.add('rotated180');
  dropDown.classList.remove('disabled');
}

function closeDropDown(dropDown, icon) {
  dropDown.classList.add('disabled');
  icon.classList.remove('rotated180');
}


function createEarliarAccounts() {
  // const contentWrap = createELement({attrs: {classNames: ['dropdown', 'dropdown_earlier-accounts', 'disabled']}});
  const contentWrap = createELement({attrs: {classNames: ['dropdown', 'dropdown_earlier-accounts', 'disabled']}});
  const accountsUl = createELement({elemName: 'ul', attrs: {classNames: ['dropdown__list']}});

  contentWrap.addEventListener('click', e => {
    e._dropDOwnClicked = true;
  });

  // for (const storageAccount of accountsArr) {
  //   const accountItem = createELement({elemName: 'li', attrs: {classNames: ['dropdown__item']}});
  //   const accountNumbBtn = createELement({elemName: 'button', attrs: {text: storageAccount, classNames: ['btn', 'dropdown__btn']}});

  //   accountItem.append(accountNumbBtn);
  //   accountsUl.append(accountItem);
  // }

  contentWrap.append(accountsUl);
  return {wrap: contentWrap, ul: accountsUl};
}

function fillEarliarAccounts(accountsArr, parentUl, input, onClick) {
  parentUl.innerHTML = '';
  for (const storageAccount of accountsArr) {
    const accountItem = createELement({elemName: 'li', attrs: {classNames: ['dropdown__item']}});
    const accountNumbBtn = createELement({elemName: 'button', attrs: {text: storageAccount, classNames: ['btn', 'dropdown__btn']}});

    accountNumbBtn.addEventListener('click', e => {
      input.value = e.target.textContent;
      e.preventDefault();
      onClick();
    });

    accountItem.append(accountNumbBtn);
    parentUl.append(accountItem);
  }
  return parentUl;
}





