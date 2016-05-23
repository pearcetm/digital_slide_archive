import LayoutView from '../common/layout-view';
import Radio from '../common/radio';

import template from './template.jade';

var channel = Radio.channel('modal');

export default LayoutView.extend({
  template: template,
  className: 'modal fade',
  attributes: {
    tabindex: -1,
    role: 'dialog'
  },
  regions: {
    body: '.modal-body'
  },
  triggers: {
    'shown.bs.modal': 'modal:show',
    'hidden.bs.modal': 'modal:hide'
  },
  events: {
    'click .button-dismiss': 'animateOut',
    'click .button-submit': 'onSubmit'
  },
  initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this, 'modal:hide', this.onDismiss);
  },
  onShow() {
    this.$el.modal({
      show: false
    });
  },
  animateIn() {
    channel.trigger('before:render', this);
    return new Promise(resolve => {
      this.once('modal:show', resolve);
      this.$el.modal('show');
    }).then(() => channel.trigger('render', this));
  },
  animateOut() {
    return new Promise(resolve => {
      this.once('modal:hide', resolve);
      this.$el.modal('hide');
    });
  },
  onSubmit(evt) {
    evt.preventDefault();
    channel.trigger('submit', this);
    if (this.body.currentView) {
      this.body.currentView.triggerMethod('submit', this);
    }
    return this.animateOut();
  },
  onDismiss() {
    channel.trigger('dismiss', this);
  }
});
