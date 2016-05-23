import _ from 'lodash';

import Service from '../common/service';
import Radio from '../common/radio';
import Model from '../common/model';

import LoginView from './login/view';

var modal = Radio.channel('modal');
var channel = Radio.channel('auth');
var dialog = Radio.channel('dialog');

var User = Model.extend({
  anonymous() {
    return !this.id;
  }
});

var AuthService = Service.extend({
  start() {
    this.user = new User();
    this.loginView = new LoginView();

    channel.reply('user', this.user);
    channel.reply('login', this.login, this);
    channel.reply('logout', this.logout, this);
    channel.reply('register', this.register, this);

    dialog.reply('login', this.login, this);

    return this;
  },

  login() {
    return modal.request('show', {
      title: 'Log in',
      view: this.loginView
    }).then(() => {
      var username = this.loginView.ui.username.val();
      var password = this.loginView.ui.password.val();
      console.log([username, password]);
    }, _.noop);
  },

  logout() {
    this.model.clear();
    channel.trigger('logout');
  },

  register() {
  }
});

export default AuthService;
