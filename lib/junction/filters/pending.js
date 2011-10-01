/**
 * Module dependencies.
 */
var util = require('util');


/**
 * Save pending data to pending store.
 *
 * This filter processes outgoing stanzas, saving any data attached to the
 * `pending` property to the pending store.  Pending data is typically set by
 * applying additional `filter()`'s to the connection.  Such filters process
 * outgoing stanzas and record any data necessary to interpret the eventual
 * response.
 *
 * When used in conjunction with the `pending` middleware, the data saved in the
 * pending store will be loaded when the corresponding response stanza arrives.
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
 *   - `store`  pending store instance
 *
 * Examples:
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
