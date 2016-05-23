import Service from '../common/service';
import Radio from '../common/radio';
import Collection from '../common/collection';
import View from './view';

var channel = Radio.channel('header');

var HeaderService = Service.extend({
  start() {
    this.collection = new Collection();
    this.view = new View({
      collection: this.collection
    });
    this.getOption('container').show(this.view);

    channel.reply('add', this.add, this);
    channel.reply('remove', this.remove, this);
    channel.reply('activate', this.activate, this);

    return this;
  },
  add(model) {
    this.collection.add(model);
  },
  remove(model) {
    model = this.collection.findWhere(model);
    this.collection.remove(model);
  },
  activate(model) {
    this.collection.invoke('set', 'active', false);
    model = this.collection.findWhere(model);
    if (model) {
      model.set('active', true);
    }
  }
});

export default HeaderService;
