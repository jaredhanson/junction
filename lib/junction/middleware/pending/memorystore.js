var util = require('util');
var Store = require('./store');

// TODO: Handle time-out / expiration

function MemoryStore() {
  this._pending = {};
}

util.inherits(MemoryStore, Store);

MemoryStore.prototype.get = function(id, fn) {
  var self = this;
  process.nextTick(function(){
    var re = self._pending[id];
    if (re) {
      re = JSON.parse(re);
      fn(null, re);
    } else {
      fn();
    }
  });
}

MemoryStore.prototype.set = function(id, pending, fn) {
  var self = this;
  process.nextTick(function(){
    self._pending[id] = JSON.stringify(pending);
    fn && fn();
  });
};


module.exports = MemoryStore;
