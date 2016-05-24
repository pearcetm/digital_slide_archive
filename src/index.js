import './plugins';

import $ from 'jquery';
import girder from './common/girder';
import App from './app';

import './index.styl';

$(() => {
  var apiRoot = 'http://localhost:8080/api/v1';

  girder.router.enabled(false);
  girder.apiRoot = apiRoot;
  var app = window.app = new App({apiRoot});
  app.start();
});
