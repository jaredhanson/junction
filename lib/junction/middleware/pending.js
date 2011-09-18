/**
 * Module dependencies.
 */
var util = require('util')
  , Store = require('./pending/store')
  , MemoryStore = require('./pending/memorystore');


/**
 * Setup pending store with the given `options`.
 *
 * This middleware processes incoming response stanzas, restoring any pending
 * data set when the corresponding request was sent.  Pending data is typically
 * set by applying `filter()`'s to the connection.  The pending data can be
 * accessed via the `stanza.irt` property, also aliased to `stanza.inReplyTo`,
 * `stanza.inResponseTo` and `stanza.regarding`.  Data is (generally) serialized
 * as JSON by the store.
 *
 * This allows a stateless, shared-nothing architecture to be utilized in
 * XMPP-based systems.  This is particularly advantageous in systems employing
 * XMPP component connections with round-robin load balancing strategies.  In
 * such a scenario, requests can be sent via one component instance, while the
 * result can be received and processed by an entirely separate component
 * instance.
 *
 * Options:
 *
 *   - `store`       pending store instance
 *   - `autoRemove`  automatically remove data when the response is received. Defaults to `true`
 *
 * Examples:
 *
 *      connection.use(junction.pending({ store: new junction.pending.MemoryStore() }));
 *
 *
 *      var store = new junction.pending.MemoryStore();
 *
 *      connection.filter(disco.filters.infoQuery());
 *      connection.filter(junction.filters.pending({ store: store }));
 *
 *      connection.use(junction.pending({ store: store }));
 *      connection.use(function(stanza, next) {
 *        if (stanza.inResponseTo) {
 *          console.log('response received!');
 *          return;
 *        }
 *        next();
 *      });
 *
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
function pending(options) {
  options = options || {};
  var store = options.store;
  var autoRemove = options.autoRemove || true;
  
  if (!store) throw new Error('pending middleware requires a store');
  
  return function pending(stanza, next) {
    if (!stanza.id || !(stanza.type == 'result' || stanza.type == 'error')) {
      return next();
    }
    
    var key = stanza.from + ':' + stanza.id;
    store.get(key, function(err, data) {
      if (err) {
        next(err);
      } else if (!data) {
        next();
      } else {
        stanza.irt =
        stanza.inReplyTo = 
        stanza.inResponseTo =
        stanza.regarding = data;
        // TODO: Write test case for autoRemove functionality
        if (autoRemove) { store.remove(key); }
        next();
      }
    });
  }
}


/**
 * Expose the middleware.
 */
exports = module.exports = pending;

/**
 * Expose constructors.
 */
exports.Store = Store;
exports.MemoryStore = MemoryStore;
