import {
  clearRoot,
  displayMainNav,
  createELement,
  createPageCommonTopContent,
  stringToFixed,
  clearElemsInnerHtml,
} from "./helpful";
import { root } from "./variables";
import { deactivateAllNavs } from './navs';
import { createNewTransferForm } from './detailBlocks/transferForm';
import { createBalanceDynamicBlock } from './detailBlocks/balanceDynamic';
import { createTransfersHistoryBlock } from './detailBlocks/transferHistory';
import { apiUserAccountDetail } from './requests';


let accountNumber;
let balance;
let currentBalanceWrap;



export function createAccountDetailPage(accountNumberProp, balanceProp=0) {
  accountNumber = accountNumberProp;
  balance = balanceProp;
  clearRoot();
  deactivateAllNavs();
  displayMainNav();
  root.append(createAccountsListContent());

}

function createAccountsListContent() {
  const sectionName = 'account-detal';
  const contentWrap = createELement({elemName: 'section', attrs: {classNames: ['section', sectionName]}});
  const topContentObj = createPageCommonTopContent(
    {
      title: 'Просмотр счёта ',
      numberValue: accountNumber,
      balanceValue: `${balance}`,
      rootClassName: sectionName,
    }
  );
  const topContent = topContentObj.content;
  currentBalanceWrap = topContentObj.balanceWrap;
  const mainContent = createELement({attrs: {classNames: [`${sectionName}__main-content`]}});
  const blocksUl = createELement({elemName: 'ul', attrs: {classNames: [`${sectionName}__blocks`]}});
  const blockTransfer = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_transfer`]}});
  const transferContentObj = createNewTransferForm(accountNumber, balance, currentBalanceWrap);
  const transferContent = transferContentObj.formWrap;
  blockTransfer.append(transferContent);

  const blockBalanceHistory = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_balance-history`]}});
  let balanceHistoryContent = createBalanceDynamicBlock();
  blockBalanceHistory.append(balanceHistoryContent);

  const blockTransferHistory = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_transfer-history`]}});
  let transferHistoryContent = createTransfersHistoryBlock();
  blockTransferHistory.append(transferHistoryContent);

  blocksUl.append(blockTransfer, blockBalanceHistory, blockTransferHistory);
  mainContent.append(blocksUl);
  contentWrap.append(topContent, mainContent);

  apiUserAccountDetail(accountNumber).then(res => {
    clearElemsInnerHtml([currentBalanceWrap, blockBalanceHistory, blockTransferHistory])
    currentBalanceWrap.textContent = stringToFixed(res.balance);
    balanceHistoryContent = createBalanceDynamicBlock(res, 6);
    blockBalanceHistory.append(balanceHistoryContent);
    transferHistoryContent = createTransfersHistoryBlock(res, 10);
    blockTransferHistory.append(transferHistoryContent);
  });

  listeThisPage(contentWrap, transferContentObj.closeDropDownFnc);
  return contentWrap;
}





function listeThisPage(mainWrap, onClick) {
  mainWrap.addEventListener('click', e => {
    if (e._dropDOwnClicked) return;
    onClick();
  });
}



