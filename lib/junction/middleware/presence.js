/**
 * Module dependencies.
 */
var events = require('events');
var util = require('util');
require('../../node-xmpp/element_ext');


/**
 * Handle presence stanzas.
 *
 * This middleware allows applications to handle presence stanzas.  Applications
 * provide a `callback(handler)` which the middleware calls with an instance of
 * `EventEmitter`.  Listeners can be attached to `handler` in order to process
 * presence stanza.
 *
 * Events:
 *   - `available`    the sending entity is available for communication
 *   - `unavailable`  the sending entity is no longer available for communication
 *   - `probe`        the sending entity requests the recipient's current presence
 *   - `subscribe`    the sending entity wishes to subscribe to the recipient's presence
 *   - `subscribed`   the sending entity has allowed the recipient to receive their presence
 *   - `unsubscribe`  the sending entity is unsubscribing from the recipient's presence
 *   - `unsubscribed` the sending entity has denied a subscription request or has canceled a previously granted subscription
 *   - `err`          an error has occurred regarding processing of a previously sent presence stanza
 *
 * Examples:
 *
 *      connection.use(
 *        junction.presence(function(handler) {
 *          handler.on('available', function(stanza) {
 *            console.log('someone is available!');
 *          });
 *          handler.on('unavailable', function(stanza) {
 *            console.log('someone is unavailable.');
 *          });
 *        })
 *      );
 *
 * References:
 * - [RFC 6121: Extensible Messaging and Presence Protocol (XMPP): Instant Messaging and Presence](http://xmpp.org/rfcs/rfc6121.html#presence-syntax-type)
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

module.exports = function presence(fn) {
  if (!fn) throw new Error('presence middleware requires a callback function');
  
  var handler = new Handler();
  fn.call(this, handler);
  
  return function presence(stanza, next) {
    if (!stanza.is('presence')) { return next(); }
    handler._handle(stanza);
    next();
  }
}


/**
 * Initialize a new `Handler`.
 *
 * @api private
 */
function Handler() {
  events.EventEmitter.call(this);
};

/**
 * Inherit from `EventEmitter`.
 */
util.inherits(Handler, events.EventEmitter);

/**
 * Handle a presence stanza.
 *
 * @param {XMLElement} stanza
 * @api private
 */
Handler.prototype._handle = function(stanza) {
  if (!stanza.attrs.type) {
    this.emit('available', stanza);
  } if (stanza.attrs.type == 'error') {
    // If there is no listener for an 'error' event, Node's default action is to
    // print a stack trace and exit the program.  This behavior is not
    // desirable for error stanzas, so they will instead be emitted as 'err'
    // events.
    this.emit('err', stanza);
  } else {
    this.emit(stanza.attrs.type, stanza);
  }
};
