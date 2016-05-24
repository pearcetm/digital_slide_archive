import _ from 'lodash';

import girder from '../common/girder';

import Service from '../common/service';
import Radio from '../common/radio';

import LoginView from './login/view';
import RegisterView from './register/view';

var header = Radio.channel('header');
var modal = Radio.channel('modal');
var channel = Radio.channel('auth');
var dialog = Radio.channel('dialog');

var AuthService = Service.extend({
  start() {
    var User = girder.models.UserModel;
    this.user = new User();

    this.listenTo(this.user, 'change', this.update);

    channel.reply('user', this.user);
    channel.reply('login', this.login, this);
    channel.reply('logout', this.logout, this);
    channel.reply('register', this.register, this);

    dialog.reply('login', this.login, this);
    dialog.reply('register', this.register, this);
    dialog.reply('logout', this.logout, this);

    this.listenTo(girder.events, 'g:logout.success', this.logout);

    this.listenTo(girder.events, 'g:login.success', () => {
      this.user.set(girder.currentUser.attributes);
      channel.trigger('login', this.user.attributes);
    });

    girder.fetchCurrentUser()
      .then(() => {
        channel.trigger('login', this.user.attributes);
      });
    this.update();
    return this;
  },

  login() {
    var loginView = new LoginView();
    return modal.request('show', {
      title: 'Log in',
      view: loginView
    }).then(() => {
      if (this.user.id) {
        this.logout();
      }
      var username = loginView.ui.username.val();
      var password = loginView.ui.password.val();
      return girder.login(username, password);
    }, _.noop);
  },

  logout() {
    this.user.clear();
    return new Promise((resolve) => {
      resolve();
    });
  },

  register() {
    var registerView = new RegisterView();
    var form;
    return modal.request('show', {
      title: 'Register',
      view: registerView
    }).then(() => {
      form = registerView.form;
      channel.trigger('before:register', form);
      return this.user.register(form);
    }).then(() => {
      return girder.login(form.username, form.password);
    });
  },

  update() {
    header.request('remove', {
      class: 'auth'
    });
    if (!this.user.id) {
      header.request('add', {
        name: 'Register',
        align: 'right',
        path: '?dialog=register',
        class: 'auth'
      });

      header.request('add', {
        name: 'Login',
        align: 'right',
        path: '?dialog=login',
        class: 'auth'
      });
    } else {
      header.request('add', {
        name: 'Logout',
        align: 'right',
        path: '?dialog=logout',
        class: 'auth'
      });
    }
  }
});

export default AuthService;
