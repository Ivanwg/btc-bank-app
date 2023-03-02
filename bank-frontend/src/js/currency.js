import { clearRoot, createELement, displayMainNav } from "./helpful";
import { root, toCurrencyBtn } from "./variables";
import { deactivateAllOpenOne } from './navs';
import { webSocket } from './requests';


export function createCurrencyPage() {
  clearRoot();
  deactivateAllOpenOne(toCurrencyBtn);
  displayMainNav();

  root.append(createCurrencyContent())
}

function createCurrencyContent() {
  const className = 'currency';
  const sectionCurrency = createELement({elemName: 'section', attrs: {classNames: ['section', 'section_without-r-btn', className]}});
  const topContent = createELement({attrs: {classNames: [`${className}__top-content`]}});
  const titleH1 = createELement({elemName: 'h1', attrs: {text: 'Валютный обмен', classNames: ['title-h1', `${className}__title`]}});
  topContent.append(titleH1);

  const mainContent = createELement({attrs: {classNames: [`${className}__main-content`]}});
  sectionCurrency.append(topContent, mainContent);

  webSocket()

  return sectionCurrency;
}
