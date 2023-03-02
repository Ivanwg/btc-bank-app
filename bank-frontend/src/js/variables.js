import {getById} from './helpful';


export const GOOGLE_TOKEN = '';
export const DEFAULT_SORT_PREFERENCE = 'BALANCE';

// CITY IS MOSCOW
export const ATM_CITY_LATITUDE = 55.751;
export const ATM_CITY_LONGITUDE = 37.618;


export const root = getById('root');
export const mainNav = getById('main-nav');


export const toMainBtn = getById('to-main-btn');
export const toAtmsBtn = getById('to-atms-btn');
export const toAccountsBtn = getById('to-accounts-btn');
export const toCurrencyBtn = getById('to-currency-btn');
export const logoutBtn = getById('logout-btn');

export const mainBlue = '#116ACC';
export const blueHover = 'rgba(17, 106, 204, 0.7)';
export const black = '#000000';
export const pink = '#FD4E5D';
export const green = '#76CA66';

export const SERVER_ERR_TEXT = 'Ошибка сервера. Попробуйте позже';
export const UNIDENTIFIED_ERR_TEXT = 'Произошла непредвиденная ошибка. Повторите запрос позднее.';

export const MONTHS_LABELS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сент', 'окт', 'ноя', 'дек'];
