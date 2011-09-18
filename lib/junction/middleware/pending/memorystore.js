/**
 * Module dependencies.
 */
var util = require('util')
  , Store = require('./store');


/**
 * Initialize a new `MemoryStore`.
 *
 * Options:
 *   - `timeout`  expire keys in the store after `timeout` milliseconds
 *
 * @param {Object} options
 */
function MemoryStore(options) {
  options = options || {};
  this._hash = {};
  this._timeout = options.timeout;
}

/**
 * Inherit from `Store`.
 */
util.inherits(MemoryStore, Store);

/**
 * Fetch data with the given `key` from the pending store.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */
MemoryStore.prototype.get = function(key, fn) {
  var self = this;
  process.nextTick(function(){
    var data = self._hash[key];
    if (data) {
      data = JSON.parse(data);
      fn(null, data);
    } else {
      fn();
    }
  });
}

/**
 * Commit `data` associated with the given `key` to the pending store.
 *
 * @param {String} key
 * @param {Object} data
 * @param {Function} fn
 * @api public
 */
MemoryStore.prototype.set = function(key, data, fn) {
  var self = this;
  process.nextTick(function(){
    self._hash[key] = JSON.stringify(data);
    fn && fn();
  });
  if (this._timeout) {
    setTimeout(function() {
      self.remove(key);
    }, this._timeout);
  }
};

/**
 * Remove data associated with the given `key` from the pending store.
 *
 * @param {String} key
 * @param {Function} fn
 * @api public
 */
MemoryStore.prototype.remove = function(key, fn) {
  var self = this;
  process.nextTick(function(){
    delete self._hash[key];
    fn && fn();
  });
};



/**
 * Expose `MemoryStore`.
 */
module.exports = MemoryStore;
