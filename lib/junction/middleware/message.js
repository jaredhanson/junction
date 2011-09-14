/**
 * Module dependencies.
 */
var events = require('events');
var util = require('util');
require('../../node-xmpp/element_ext');


/**
 * Handle message stanzas.
 *
 * This middleware allows applications to handle message stanzas.  Applications
 * provide a `callback(handler)` which the middleware calls with an instance of
 * `EventEmitter`.  Listeners can be attached to `handler` in order to process
 * presence stanza.
 *
 * Events:
 *   - `chat`       the message is sent in the context of a one-to-one chat session
 *   - `groupchat`  the message is sent in the context of a multi-user chat environment
 *   - `normal`     the message is a standalone message that is sent outside the context of a one-to-one conversation or multi-user chat environment, and to which it is expected that the recipient will reply
 *   - `headline`   the message provides an alert, a notification, or other transient information to which no reply is expected
 *   - `err`        an error has occurred regarding processing of a previously sent message stanza
 *
 * Examples:
 *
 *      connection.use(
 *        junction.message(function(handler) {
 *          handler.on('chat', function(stanza) {
 *            console.log('someone is chatting!');
 *          });
 *          handler.on('groupchat', function(stanza) {
 *            console.log('someone is group chatting!');
 *          });
 *        })
 *      );
 *
 * References:
 * - [RFC 6121: Extensible Messaging and Presence Protocol (XMPP): Instant Messaging and Presence](http://xmpp.org/rfcs/rfc6121.html#message-syntax-type)
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */
 
module.exports = function message(fn) {
  if (!fn) throw new Error('message middleware requires a callback function');
  
  var handler = new Handler();
  fn.call(this, handler);
  
  return function message(stanza, next) {
    if (!stanza.isMessage()) { return next(); }
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
 * Handle a message stanza.
 *
 * @param {XMLElement} stanza
 * @api private
 */
Handler.prototype._handle = function(stanza) {
  if (!stanza.attrs.type) {
    this.emit('normal', stanza);
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
