import _ from 'lodash';
import Backbone from 'backbone';
import Cookie from 'js-cookie';

import Service from '../common/service';
import Radio from '../common/radio';
import Model from '../common/model';

import LoginView from './login/view';
import RegisterView from './register/view';

var header = Radio.channel('header');
var modal = Radio.channel('modal');
var channel = Radio.channel('auth');
var dialog = Radio.channel('dialog');
var token = Cookie.get('girderToken') || null;
var _ajax = Backbone.ajax;

var User = Model.extend({
  anonymous() {
    return !token;
  },
  login(username, password) {
    var apiRoot = Radio.request('app', 'apiRoot');
    var auth = 'Basic ' + window.btoa(username + ':' + password);
    return Backbone.ajax({
      method: 'GET',
      url: apiRoot + '/user/authentication',
      headers: {'Girder-Authorization': auth}
    }).then((data) => {
      var opts = {};
      var date = new Date(data.authToken.expires);
      if (date.toUTCString() !== 'Invalid Date') {
        opts.expire = date;
      }
      Cookie.set('girderToken', data.authToken.token, opts);
      token = data.authToken.token;
      this.set(data.user);
    });
  },
  logout() {
    Cookie.remove('girderToken');
    token = null;
    this.clear();
  },
  fetchUser() {
    var apiRoot = Radio.request('app', 'apiRoot');
    return Backbone.ajax({
      girder: true,
      method: 'GET',
      url: apiRoot + '/user/me'
    }).then((data) => {
      if (data) {
        this.set(data);
      }
    }, _.noop)
    .then(() => {
      this.trigger('change');
      return this;
    });
  }
});

var AuthService = Service.extend({
  start() {
    this.user = new User();
    this.loginView = new LoginView();
    this.registerView = new RegisterView();

    Backbone.ajax = function (opts) {
      if (opts.girder && token) {
        opts.headers = opts.header || {};
        opts.headers['Girder-Token'] = token;
      }
      return _ajax.apply(this, arguments);
    };

    this.listenTo(this.user, 'change', this.update);
    this.user.fetchUser();
    channel.reply('token', token);
    channel.reply('user', this.user);
    channel.reply('login', this.login, this);
    channel.reply('logout', this.logout, this);
    channel.reply('register', this.register, this);

    dialog.reply('login', this.login, this);
    dialog.reply('register', this.register, this);
    dialog.reply('logout', this.logout, this);

    return this;
  },

  login() {
    this.logout();
    return modal.request('show', {
      title: 'Log in',
      view: this.loginView
    }).then(() => {
      var username = this.loginView.ui.username.val();
      var password = this.loginView.ui.password.val();
      return this.user.login(username, password);
    }, _.noop);
  },

  logout() {
    this.user.logout();
    channel.trigger('logout');
    return new Promise((resolve) => {
      resolve();
    });
  },

  register() {
    this.logout();
    return modal.request('show', {
      title: 'Register',
      view: this.registerView
    }).then(() => {
    });
  },

  update() {
    header.request('remove', {
      class: 'auth'
    });
    if (this.user.anonymous()) {
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
