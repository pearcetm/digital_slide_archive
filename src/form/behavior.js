import Syphon from 'backbone.syphon';
import Behavior from '../common/behavior';

export default Behavior.extend({
  events: {
    'submit form': 'handleSubmit'
  },

  initialize() {
    this.listenTo(this.view.options.model, 'change', this.onChange);
    this.listenTo(this.view, 'submit', this.handleSubmit);
  },

  serialize() {
    this.view.form = Syphon.serialize(this);
  },

  deserialize() {
    return Syphon.deserialize(this, this.view.form);
  },

  onChange() {
    this.view.form = this.view.model.attributes;
    this.deserialize();
  },

  onBeforeRender() {
    if (this.view.form) {
      this.serialize();
    }
  },

  onDomRefresh() {
    if (!this.view.form) {
      this.view.form = this.view.model.attributes;
    }
    this.deserialize();
  },

  handleSubmit(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    var form = Syphon.serialize(this);
    if (this.view.validate && this.view.validate(this.view.form)) {
      return;
    }
    this.view.model.set(form, {trigger: true});
  }
});
