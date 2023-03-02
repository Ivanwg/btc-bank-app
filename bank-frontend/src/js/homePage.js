import { getById, clearRoot, createELement, displayMainNav, clearElemsTextContent } from './helpful';
import { createAccountsListPage } from './accountsList';

export function createHome() {
  clearRoot();
  displayMainNav();
  console.log('createHome')
  createAccountsListPage();
}
