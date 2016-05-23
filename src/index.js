import './plugins';

import _ from 'lodash';
import $ from 'jquery';
import App from './app';

import './index.styl';

var app = new App({apiRoot: 'https://data.kitware.com/api/v1'});
window.app = app;
$(_.bind(app.start, app));

export default app;
