var util = require('util');
var MemoryStore = require('./pending/memorystore');

function pending(options) {
  options = options || {};
  var store = options.store;
  
  if (!store) throw new Error('pending middleware requires a store');
  
  return function pending(stanza, next) {
    if (!stanza.id || !(stanza.type == 'result' || stanza.type == 'error')) {
      return next();
    }
    
    store.get(stanza.id, function(err, re) {
      if (err) {
        next(err);
      } else if (!re) {
        next();
      } else {
        stanza.regarding = re;
        next();
      }
    });
  }
}


exports = module.exports = pending;
exports.MemoryStore = MemoryStore;
