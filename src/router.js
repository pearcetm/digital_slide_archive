import _ from 'lodash';
import Backbone from 'backbone';

import AppRouter from './common/app-router';
import Radio from './common/radio';

var channel = Radio.channel('router');

export default AppRouter.extend({
  appRoutes: {
    '': 'index',
    'user/:userid': 'index'
  },
  initialize() {
    channel.reply('navigate', this.navigate, this);
  },
  onRoute(name, path, args) {
    var query = {};
    var search = this.getSearch();
    if (search) {
      args.pop();
      _.each(search.split('&'), (val) => {
        val = val.split('=');
        query[val[0]] = val[1];
      });
    }
    channel.trigger('route', name, path, args, query);
  },
  getSearch() {
    var match = Backbone.history.location.href.replace(/#[^?]*/, '').match(/\?(.+)/);
    return match ? match[1] : '';
  }
});
