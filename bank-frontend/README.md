# Coin. - проект банковской системы хранения и совершения операций над криптовалютными средствами.

* Проект реализован как SIngle Page Application

## Для сборки проекта используется сборщик Webpack@5. Основные команды:
  * npm run watch
  * npm run build

  *** для открытия проекта после build сборки нужно использовать serve -s dist -p НОМЕР ПОРТА (например serve -s dist -p 5000 )

## Для HTTP-запросов к серверу используется библиотека axios


### Проект поделен на модули:
  1. Модули стилей - для каждой страницы используется отдельный файл .scss , которые для удобства отслеживания собираются (импортируются) в общий файл sttyle.scss, который в свою очереднь импортируется в точку входа - файл index.js
  2. Модули JS - каждый скриптовый файл отвечает за рендеринг каждой страницы.
  * Существуют также доп.файлы:
      * errs.js - кастомные ошибки
      * requests.js - запросы к серверу
      * storage.js - взаимодействие с LocalStorage и SessionStorage
      * helpful.js - общие для всей модулей функции
      * variables.js - общие константы для всего проекта

### Также проект покрыт end-to-end тестами на базовый функционал на основе фреймворка Cypress:
  * Для запуска используйте команду npx cypress open,
  * Дождитесь открытия окна программы,
  * Выберите тип - e2e тесты как на скрине
      ![]https://docs.cypress.io/img/guides/getting-started/opening-the-app/launchpad.png,
  * Выберите тип браузера - например, гугл,
      как на скрине ![]https://docs.cypress.io/img/guides/getting-started/opening-the-app/select-browser.png,
  * Во вкладке Specs нажмите на файл coin.cy.js и тесты запустятся

<img scr="https://docs.cypress.io/img/guides/getting-started/opening-the-app/launchpad.png">