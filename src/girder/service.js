import $ from 'jquery';
import girder from 'girder';

import Service from '../common/service';
import Radio from '../common/radio';

var modal = Radio.channel('modal');
var channel = Radio.channel('girder');
var toast = Radio.channel('toast');
var girderModal;

// convert girder alert types to toastr types
var typeMap = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  danger: 'error'
};

var GirderService = Service.extend({
  start() {
    this.alert = girder.alert;
    // girder.alert = _.bind(this.alert, this);

    girderModal = $.fn.girderModal;
    $.fn.girderModal = this.modal;
  },

  stop() {
    girder.alert = this.alert;
    $.fn.girderModal = this.girderModal;
  },

  alert(options = {}) {
    var message = options.text;
    var opts = {
      type: typeMap[options.type] || 'info'
    };

    channel.trigger('alert', options, opts);
    toast.request('show', message, opts);
  },

  modal(view) {
    var $this = $(this);
    if (view === 'close') {
      modal.request('hide');
      return $this;
    }
    return girderModal.apply(this, arguments);
  }
});

export default GirderService;
