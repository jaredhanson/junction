/**
 * Module dependencies.
 */
var JID = require('node-xmpp').JID;


/**
 * Parse legacy information indicating an XMPP stanza has been delivered with a
 * delay.
 *
 * This middleware parses legacy delay information contained within message and
 * presence stanzas.  `stanza.delayedBy` indicates the Jabber ID of the entity
 * that delayed the delivery of the stana.  `stanza.originallySentAt` indicates
 * the time the stanza was originally sent.
 *
 * Examples:
 *
 *      connection.use(junction.legacyDelayParser());
 *
 * References:
 * - [XEP-0091: Legacy Delayed Delivery](http://xmpp.org/extensions/xep-0091.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function legacyDelayParser() {
  
  return function legacyDelayParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var delay = stanza.getChild('x', 'jabber:x:delay');
    if (!delay) { return next(); }
    
    stanza.delayedBy = new JID(delay.attrs.from);
    var match = /(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(delay.attrs.stamp);
    if (match) {
      stanza.originallySentAt = new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
    }
    
    next();
  }
}
