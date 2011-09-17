var util = require('util');

module.exports = function pending(options) {
  options = options || {};
  var store = options.store;
  
  if (!store) throw new Error('pending filter requires a store');
  
  return function pending(stanza, next) {
    if (!stanza.attrs.id || !stanza.pending) {
      return next();
    }
    
    var key = stanza.attrs.to + ':' + stanza.attrs.id;
    store.set(key, stanza.pending, function(err) {
      next(err);
    });
  }
}
