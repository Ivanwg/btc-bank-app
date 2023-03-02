import axios from 'axios';
import { LoginError, UnidentifiedApiError, OverdraftError, InvalidAccountError } from './errs';
import { getToken } from './storage';

const BASE_URL = 'http://localhost:3000';
const WEBSOCKET_URL = 'ws://localhost:3000';

function createHeadersWithToken() {
  let headers = {
    'Content-Type': 'application/json;charset=utf-8'
  };
  const token = getToken();
  if (token) {
    headers = Object.assign(headers, {'Authorization': `Basic ${getToken()}`})
  }
  return { headers: headers };
}


export function apiLogin({login, password}) {
  const headers = createHeadersWithToken();
  const response = axios.post(`${BASE_URL}/login`,
  {
    login: login,
    password: password,
  },
  headers).then(res => {
    let token;
    try {
      if (res.data.payload) {
        token = res.data.payload.token;
      }
      else if (res.data.error) {
        let errMessage = res.data.error;
        if (res.data.error == 'Invalid password') errMessage = 'Неверный пароль';
        else if (res.data.error == 'No such user') errMessage = 'Неверный логин';
        throw new LoginError(`${errMessage}`);
      }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      if (err.name == 'LoginError') {
        throw err;
      }
      else throw new UnidentifiedApiError;
    }
    return token;
  })
  return response
}

export function apiATMsCoordinates() {
  const headers = createHeadersWithToken();
  const response = axios.get(`${BASE_URL}/banks`,
  headers).then(res => {
    let coordinates;
    try {
      if (res.data.payload) {
        coordinates = formatATMsKeys(res.data.payload);
      }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      console.log(err);
    }
    return coordinates;
  })
  return response
}

function formatATMsKeys(atmsArr) {
  const new_arr = atmsArr ? atmsArr.map((obj) => {
    return {'lat': obj.lat, 'lng': obj.lon};
  }) : [];
  return new_arr;
}


export function apiUserAccounts() {
  const headers = createHeadersWithToken();
  const response = axios.get(`${BASE_URL}/accounts`,
  headers).then(res => {
    let accounts;
    try {
      if (res.data.payload) {
        accounts = res.data.payload;
      } else if (res.data.error == 'Unauthorized') {
        throw new LoginError('Отсутствует токен');
      }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      console.log(err);
      if (err.name == 'LoginError' || err.name == 'UnidentifiedApiError') {
        throw err;
      }
    }
    return accounts;
  })
  return response;
}

export function createNewAccount() {
  const headers = createHeadersWithToken();
  const response = axios.post(`${BASE_URL}/create-account`,
  {}, headers).then(res => {
    let newAccount;
    try {
      if (res.data.payload) {
        newAccount = res.data.payload;
      }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      console.log(err);
    }
    return newAccount;
  })
  return response
}


export function apiTransfer({from, to, amount}) {
  const headers = createHeadersWithToken();
  const response = axios.post(`${BASE_URL}/transfer-funds`,
  {from, to, amount}, headers).then(res => {
    console.log(res)
    try {
      if (res.data.payload) {
        return res.data.payload;
      } else if (res.data.error = 'Invalid account to') {
        throw new InvalidAccountError;
      } else if (res.data.error = 'Overdraft prevented') {
        throw new OverdraftError;
      }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      // console.log(err.name, err.message)
      throw err;
    }
  });
  return response;
}

export function apiUserAccountDetail(id) {
  const headers = createHeadersWithToken();
  const response = axios.get(`${BASE_URL}/account/${id}`,
  headers).then(res => {
    let data;
    try {
      if (res.data.payload) {
        data = res.data.payload;
      }
      // else if (res.data.error == 'Unauthorized') {
      //   throw new LoginError('Отсутствует токен');
      // }
      else throw new UnidentifiedApiError;
    }
    catch (err) {
      console.log(err);
      data = [];
    }
    return data;
  })
  return response;
}

export function webSocket() {
  let socket = new WebSocket(WEBSOCKET_URL + '/currency-feed');
  socket.onopen = function(e) {
    console.log("[open] Соединение установлено");
    console.log("Отправляем данные на сервер");
    socket.send("Меня зовут Джон");
  };

  socket.onmessage = function(event) {
    console.log(`[message] Данные получены с сервера: ${event.data}`);
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
      // например, сервер убил процесс или сеть недоступна
      // обычно в этом случае event.code 1006
      console.log('[close] Соединение прервано');
    }
  };

  socket.onerror = function(error) {
    console.log(`[error]`);
  };
}
