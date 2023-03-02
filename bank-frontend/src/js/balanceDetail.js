import {
  clearRoot,
  displayMainNav,
  createELement,
  createPageCommonTopContent,
  stringToFixed,
} from "./helpful";
import { root } from "./variables";
import { deactivateAllNavs } from './navs';
import { createNewTransferForm } from './detailBlocks/transferForm';
import { createBalanceDynamicBlock, createTransactionsRelationBlock } from './detailBlocks/balanceDynamic';
import { createTransfersHistoryBlock } from './detailBlocks/transferHistory';
import { createChart } from './detailBlocks/barChart';


let accountNumber;
let currentBalanceWrap;
let balance;


export function createBalanceDetailPage(resObj) {
  accountNumber = resObj.account;
  balance = resObj.balance;
  clearRoot();
  deactivateAllNavs();
  displayMainNav();
  root.append(createBalanceDetailContent(resObj));

}


function createBalanceDetailContent(resObj) {
  const sectionName = 'balance-detail';
  const contentWrap = createELement({elemName: 'section', attrs: {classNames: ['section', sectionName]}});
  const topContentObj = createPageCommonTopContent(
    {
      title: 'История баланса',
      numberValue: accountNumber,
      balanceValue: stringToFixed(balance),
      rootClassName: sectionName,
    }
  );
  const topContent = topContentObj.content;
  currentBalanceWrap = topContentObj.balanceWrap;
  const mainContent = createELement({attrs: {classNames: [`${sectionName}__main-content`]}});
  const blocksUl = createELement({elemName: 'ul', attrs: {classNames: [`${sectionName}__blocks`]}});
  const dynamicBlock = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_dynamic`]}});
  const relationBlock = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_relation`]}});
  const transfersBlock = createELement({elemName: 'li', attrs: {classNames: [`${sectionName}__block`, `${sectionName}__block_transfers`]}});

  const dynamicContent = createBalanceDynamicBlock(resObj, 12);
  dynamicBlock.append(dynamicContent);

  const relationContent = createTransactionsRelationBlock(resObj);
  relationBlock.append(relationContent);

  const transfersContent = createTransfersHistoryBlock(resObj, 25);
  transfersBlock.append(transfersContent);

  blocksUl.append(dynamicBlock, relationBlock, transfersBlock);
  mainContent.append(blocksUl);


  contentWrap.append(topContent, mainContent);
  return contentWrap;
}
