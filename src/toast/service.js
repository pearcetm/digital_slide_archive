import toastr from 'toastr';
import 'toastr/build/toastr.css';

import './styles.styl';

import Service from '../common/service';
import Radio from '../common/radio';

var channel = Radio.channel('toast');

var ToastService = Service.extend({
  start() {
    toastr.options.escapeHtml = true;
    toastr.options.closeButton = true;
    toastr.options.preventDuplicates = true;

    toastr.subscribe((arg) => {
      var id = arg.toastId;
      var state = arg.state;
      channel.trigger(state, id, arg.map);
    });

    channel.reply('show', this.show, this);
    channel.reply('hide', this.hide, this);
    channel.reply('remove', this.remove, this);

    return this;
  },

  show(message, options = {}) {
    var title = options.title;
    var type = options.type || 'info';

    return toastr[type](message, title, options);
  },

  hide() {
    return toastr.clear();
  },

  remove() {
    return toastr.remove();
  }
});

export default ToastService;
