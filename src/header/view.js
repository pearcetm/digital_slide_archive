import ItemView from '../common/item-view';
import Radio from '../common/radio';

import template from './template.jade';

export default ItemView.extend({
  template: template,
  tagName: 'nav',
  className: 'header navbar navbar-default navbar-fixed-top',
  collectionEvents: {
    all: 'render'
  },
  ui: {
    brand: '.navbar-brand'
  },
  events: {
    'click @ui.brand': (e) => {
      Radio.request('router', 'navigate', '', {trigger: true});
      e.preventDefault();
    }
  }
});
