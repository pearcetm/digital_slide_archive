import Model from '../../common/model';
import ItemView from '../../common/item-view';
import FormBehavior from '../../form/behavior';

import template from './template.jade';

export default ItemView.extend({
  template: template,

  behaviors: {
    form: {
      behaviorClass: FormBehavior
    }
  },

  initialize() {
    this.model = new Model();
  },

  validate() {
  }
});
