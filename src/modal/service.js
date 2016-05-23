import _ from 'lodash';

import Service from '../common/service';
import Radio from '../common/radio';
import Model from '../common/model';
import View from './view';

var channel = Radio.channel('modal');

var ModalService = Service.extend({
  start() {
    this.model = new Model();
    this.view = new View({
      model: this.model
    });
    this.getOption('container').show(this.view);

    channel.reply('show', this.show, this);
    channel.reply('hide', this.hide, this);

    return this;
  },

  show(content = {}) {
    this.model.set('title', content.title);
    if (_.has(content, 'view')) {
      this.view.body.show(content.view);
    }
    return new Promise((resolve, reject) => {
      this.listenToOnce(channel, 'submit', (view) => {
        this.stopListening(channel);
        resolve(view);
      });
      this.listenToOnce(channel, 'dismiss', (view) => {
        this.stopListening(channel);
        reject(view);
      });
      this.view.animateIn();
    });
  },

  hide() {
    return this.view.animateOut();
  }
});

export default ModalService;
