import { getById, clearRoot, createELement, disableMainNav, clearElemsTextContent } from './helpful';
import { root, SERVER_ERR_TEXT } from './variables';
import { apiLogin } from './requests';
import { createHome } from './homePage';
import { EmptyError } from './errs';
import { clearToken, setToken, getToken, clearAccountsArr } from './storage';


export function checkLogin() {
  if (getToken()) {
    createHome();
  } else {
    createLoginPage();
  }
}

export function logout() {
  clearToken();
  clearAccountsArr();
  createLoginPage();
}


export function createLoginPage() {
  clearRoot();
  disableMainNav();
  const loginElem = createLoginForm();
  const sectionLogin = createELement({elemName: 'section', attrs: {'classNames': ['section', 'login']}});
  sectionLogin.append(loginElem);
  root.append((sectionLogin));
}

function createLoginForm() {
  const formWrap = createELement({elemName: 'div', attrs: {'classNames': ['login__wrap']}});
  const h1Title = createELement({elemName: 'h1', attrs: {'text': 'Вход в аккаунт', 'classNames': ['login__title']}});
  const form = createELement({elemName: 'form', attrs: {'classNames': ['login-form']}});
  const loginLabel = createELement({elemName: 'label', attrs: {'classNames': ['login-form__label']}});
  const loginSpan = createELement({elemName: 'span', attrs: {'text': 'Логин', 'classNames': ['label-text']}});
  const loginInput = createELement({elemName: 'input', attrs: {'placeholder': 'Placeholder', 'classNames': ['input', 'text-input', 'login-form__input']}});
  const errLoginWrap = createELement({elemName: 'span', attrs: {'classNames': ['login-form__errs-wrap']}});

  const loginValidationIconWrap = createELement({elemName: 'div', attrs: {'classNames': ['login-form__icon-wrap']}});


  const passwordLabel = createELement({elemName: 'label', attrs: {'classNames': ['login-form__label']}});
  const passwordSpan = createELement({elemName: 'span', attrs: {'text': 'Пароль', 'classNames': ['label-text']}});
  const passwordInput = createELement({elemName: 'input', attrs: {
    'placeholder': 'Placeholder',
    'classNames': ['input', 'text-input', 'login-form__input'],
    'type': 'password',
  }});
  const errPasswordWrap = createELement({attrs: {'classNames': ['login-form__errs-wrap']}});
  const passwordValidationIconWrap = createELement({elemName: 'span', elemName: 'div', attrs: {'classNames': ['login-form__icon-wrap']}});

  loginLabel.append(loginSpan, loginInput, errLoginWrap, loginValidationIconWrap);
  passwordLabel.append(passwordSpan, passwordInput, errPasswordWrap, passwordValidationIconWrap);

  const mainErrsWrap = createELement({attrs: {'classNames': ['login-form__errs-wrap', 'login-form__errs-wrap_main']}});

  const submitBtn = createELement({elemName: 'button', attrs: {'text': 'Войти', 'classNames': ['btn', 'btn-blue', 'btn-blue_small', 'login-form__btn']}});

  form.addEventListener('submit', e => {
    e.preventDefault();
    onLoginSubmit(loginInput, passwordInput, errLoginWrap, errPasswordWrap, loginValidationIconWrap, passwordValidationIconWrap, mainErrsWrap);
  });

  preventInputSpaces([loginInput, passwordInput]);
  listenInputsChange([{'input': loginInput, 'errWrap': errLoginWrap, 'iconWrap': loginValidationIconWrap}, {'input': passwordInput, 'errWrap': errPasswordWrap, 'iconWrap': passwordValidationIconWrap}]);

  form.append(loginLabel, passwordLabel, mainErrsWrap, submitBtn);
  formWrap.append(h1Title, form);
  return formWrap;
}

function onLoginSubmit(loginInput, passwordInput, errLoginWrap, errPasswordWrap, loginIconWrap, passwordIconWrap, mainErrsWrap) {
  const isLoginCorrect = checkInputValue(loginInput, errLoginWrap, loginIconWrap);
  const isPasswordCorrect = checkInputValue(passwordInput, errPasswordWrap, passwordIconWrap);
  if (isLoginCorrect && isPasswordCorrect) {
    apiLogin({login: loginInput.value, password: passwordInput.value,}).then(res => {
      if (res.length) {
         setToken(res);
       } else throw new EmptyError('Произошла ошибка. Попробуйте позже');
      return res;
    }).catch(err => {
      console.log(err)
      if (err.name == 'LoginError') {
        if (err.message == 'Неверный пароль') {
          errorInput(passwordInput, err.message, errPasswordWrap, passwordIconWrap);
        } else if (err.message == 'Неверный логин') {
          errorInput(loginInput, err.message, errLoginWrap, loginIconWrap);
        }
      } else if (err.name == 'AxiosError') {
        mainErrsWrap.textContent = SERVER_ERR_TEXT;
      } else {
        mainErrsWrap.textContent = err.message;
      }
    })

    .then(token => {
      if (token && token !== 'undefined') {
        createHome();
      }
    })
  }

}

function checkInputValue(input, errField, iconWrap) {
  const value = input.value;
  let isCorrect = true;
  let errText = '';
  if (value.length < 6 && value.length > 0) {
    errText = 'Содержится менее 6 символов';
    isCorrect = false;
  } else if (!value.length) {
    errText = 'Передано пустое значение';
    isCorrect = false
  } else {
    clearElemsTextContent(errField);
  }
  if (isCorrect) {
    const successIcon = createELement({elemName: 'span', attrs: {'classNames': ['login-form__icon', 'login-form__icon_success']}});
    iconWrap.innerHTML = '';
    iconWrap.append(successIcon);
    input.classList.remove('input-error');
    input.classList.add('input-success');
    errText = '';
  } else {
    errorInput(input, errText, errField, iconWrap);
  }
  return isCorrect;
}

function errorInput(input, errText, errField, iconWrap) {
  const errIcon = createELement({elemName: 'span', attrs: {'classNames': ['login-form__icon', 'login-form__icon_error']}});
  iconWrap.innerHTML = '';
  iconWrap.append(errIcon);
  input.classList.remove('input-success');
  input.classList.add('input-error');
  errField.textContent = errText;
}

function preventInputSpaces(inputsArr) {
  for (const input of inputsArr) {
    input.addEventListener('keypress', e => {
      if (e.keyCode == 32) {
        e.preventDefault();
      }
    });
    input.addEventListener('paste', e => {
      const data = e.clipboardData.getData('text').replaceAll(' ', '')
      e.preventDefault();
      input.value += data
    })
  }
}

function listenInputsChange(inputsArr) {
  for (const inputObj of inputsArr) {
    inputObj.input.addEventListener('blur', e => {
      const data = e.target.value;
      checkInputValue(e.target, inputObj.errWrap, inputObj.iconWrap);
    })
  }
}





