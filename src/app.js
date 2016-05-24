import $ from 'jquery';
import Backbone from 'backbone';

import Application from './common/application';
import LayoutView from './layout/view';
import Router from './router';
import Controller from './controller';

import ModalService from './modal/service';
import HeaderService from './header/service';
import AuthService from './auth/service';

export default Application.extend({
  initialize(options = {}) {
    this.mergeOptions(options, ['apiRoot']);
    this.channel.reply('apiRoot', this.apiRoot);

    this.$body = $(document.body);
    this.layout = new LayoutView();

    this.layout.render();

    this.router = new Router({
      controller: new Controller()
    });

    this.headerService = new HeaderService({
      container: this.layout.header
    }).start();

    this.modalService = new ModalService({
      container: this.layout.overlay
    }).start();

    this.authService = new AuthService().start();
  },
  onStart() {
    Backbone.history.start();
  },
  channelName: 'app'
});
