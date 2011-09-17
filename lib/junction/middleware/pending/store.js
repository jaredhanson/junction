/**
 * Initialize abstract `Store`.
 *
 * @api public
 */
function Store() {
}

/**
 * Get data from the pending store.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {String} key
 * @param {Function} callback
 * @api protected
 */
Store.prototype.get = function(key, callback) {
  throw new Error('Store#get must be overridden by subclass');
}

/**
 * Set data to the pending store.
 *
 * This function must be overridden by subclasses.  In abstract form, it always
 * throws an exception.
 *
 * @param {String} key
 * @param {Object} data
 * @param {Function} callback
 * @api protected
 */
Store.prototype.set = function(key, data, callback) {
  throw new Error('Store#set must be overridden by subclass');
}


/**
 * Expose `Store`.
 */
module.exports = Store;
