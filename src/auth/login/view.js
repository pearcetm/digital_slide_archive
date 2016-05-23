import ItemView from '../../common/item-view';

import template from './template.jade';

export default ItemView.extend({
  template: template,
  tagName: 'form',

  ui: {
    username: '#username',
    password: '#password'
  }
});
