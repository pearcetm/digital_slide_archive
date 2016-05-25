import _ from 'lodash';

import Mn from './marionette';
import View from './view';

/**
 * Wrap a backbone view to simulate a Marionette view.
 */
export default (view) => {
  // Attach DOM monitoring events
  Mn.MonitorDOMRefresh(view);

  return _.defaultsDeep(view, View.prototype);
};
