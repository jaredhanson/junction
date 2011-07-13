var util = require('util');

module.exports = function pending(options) {
  options = options || {};
  var store = options.store;
  
  if (!store) throw new Error('pending filter requires a store');
  
  return function pending(stanza, next) {
    if (!stanza.attrs.id || !stanza.pending) {
      return next();
    }
    
    store.set(stanza.attrs.id, stanza.pending, function(err) {
      // TODO: Implement error handling
      next();
    });
  }
}
