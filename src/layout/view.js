import './styles.styl';

import LayoutView from '../common/layout-view';
import template from './template.jade';

export default LayoutView.extend({
  el: '.application',
  template: template,
  regions: {
    header: '.app-header',
    content: '.app-content',
    overlay: '.app-overlay'
  }
});
