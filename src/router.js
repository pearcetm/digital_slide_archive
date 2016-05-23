import _ from 'lodash';
import Backbone from 'backbone';

import AppRouter from './common/app-router';
import Radio from './common/radio';

var dialog = Radio.channel('dialog');
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
    var parsed = this.parseFragment();
    if (_.has(parsed.query, 'dialog')) {
      dialog.request(parsed.query.dialog)
        .then(() => {
          this.navigate(this.removeQuery('dialog'), {replace: true});
        });
    }

    channel.trigger('route', name, path, args, parsed.query);
  },

  /**
   * Parse a query string into an object key/value pair.
   */
  parseQuery(fragment, query) {
    query = query || {};
    _.each(
      fragment.replace(/^.*\?/, '').split('&'),
      (value) => {
        value = value.split('=');
        query[value[0]] = value[1];
      }
    );
    return query;
  },

  /**
   * Split a fragment into components.
   */
  parseFragment() {
    var url = Backbone.history.getFragment();
    return {
      path: url.replace(/\?.*/, ''),
      query: this.parseQuery(url)
    };
  },

  getURLString(url) {
    var query = url.query || {};
    var search = _.map(query, (value, key) => {
      return value ? key + '=' + value : key;
    }).join('&');
    return url.path + (search ? '?' + search : '');
  },

  /**
   * Remove the given (or all) query parameter from the url.
   */
  removeQuery(arg) {
    var parsed = this.parseFragment();
    if (arg) {
      delete parsed.query[arg];
    } else {
      parsed.query = {};
    }
    return this.getURLString(parsed);
  }
});
