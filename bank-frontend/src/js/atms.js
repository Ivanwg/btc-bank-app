import { clearRoot, createELement, displayMainNav } from './helpful';
import { root, mainBlue, toAtmsBtn, ATM_CITY_LATITUDE, ATM_CITY_LONGITUDE, GOOGLE_TOKEN, SERVER_ERR_TEXT } from './variables';
import { deactivateAllOpenOne } from './navs';
import { apiATMsCoordinates } from './requests';
import { setATMsArrSessions, getATMsArrSessions } from './storage';

import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: GOOGLE_TOKEN,
  version: 'weekly',
});


export function createATMsPage() {
  clearRoot();
  deactivateAllOpenOne(toAtmsBtn);
  displayMainNav();

  root.append(createATMSContent())
}

function createATMSContent() {
  const contentWrap = createELement({elemName: 'section', attrs: {classNames: ['section', 'section_without-r-btn', 'atms']}});
  const topContent = createELement({attrs: {classNames: ['atms__top-content']}});
  const titleH1 = createELement({elemName: 'h1', attrs: {text: 'Карта банкоматов', classNames: ['title-h1', 'atms__title']}});
  topContent.append(titleH1);

  const mainContent = createELement({attrs: {classNames: ['atms__main-content']}});
  const mapWrap = createELement({attrs: {classNames: ['atms__map-wrap']}});
  const mapErr = createELement({attrs: {text: 'Errrrr rrrrr rrrrrrrrrr', classNames: ['atms__map-err'], id: 'err-map'}});
  const map = createMap(mapErr);
  mapWrap.append(map, mapErr);

  mainContent.append(mapWrap);


  contentWrap.append(topContent, mainContent);
  return contentWrap;
}

function createMap(errBlock) {
  errBlock.innerHTML = '';
  const session_locations = getATMsArrSessions();
  const mapBlock = createELement({attrs: {classNames: ['atms__map'], id: 'google-map'}});

  let map;
  // const uluru = { lat: 55.751, lng: 37.617 };
  loader.load().then(() => {
    map = new google.maps.Map(mapBlock, {
      center: { lat: ATM_CITY_LATITUDE, lng: ATM_CITY_LONGITUDE },
      zoom: 10,
    });
    const infowindow =  new google.maps.InfoWindow({
      content: '<b>COIN.</b>',
      map: map
    });
    if (session_locations) {
      const markers = session_locations.map((position, i) => {
        const marker = new google.maps.Marker({
          position,
          map: map,
          icon: new google.maps.MarkerImage('img/atm_red.svg',
          null, null, null, new google.maps.Size(35, 40)),
        });
        marker.addListener('mouseover', function() {
          infowindow.open(map, this);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        });
      });
    }

    !session_locations && apiATMsCoordinates().then(locations => {
      setATMsArrSessions(locations);
      const markers = locations.map((position, i) => {
        const marker = new google.maps.Marker({
          position,
          map: map,
          icon: new google.maps.MarkerImage('img/atm_red.svg',
          null, null, null, new google.maps.Size(35, 40)),
        });
        marker.addListener('mouseover', function() {
          infowindow.open(map, this);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        });
      });
    }).catch(err => {
      errBlock.textContent = SERVER_ERR_TEXT;
    })

  });

  return mapBlock;
}
