import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'lodash';
Backbone.$ = $;
import Marionette from 'backbone.marionette';
import Radio from 'backbone.radio';

import 'bootstrap';
import 'babel-polyfill';

// replace Wreqr with Radio
Marionette.Application.prototype._initChannel = function () {
  this.channelName = _.result(this, 'channelName') || 'global';
  this.channel = _.result(this, 'channel') || Radio.channel(this.channelName);
};

// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}
