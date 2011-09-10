/**
 * Module dependencies.
 */
var JID = require('node-xmpp').JID;


/**
 * Parse information indicating an XMPP stanza has been delivered with a delay.
 *
 * This middleware parses delay information contained within message and
 * presence stanzas.  `stanza.delayedBy` indicates the Jabber ID of the entity
 * that delayed the delivery of the stana.  `stanza.originallySentAt` indicates
 * the time the stanza was originally sent.
 *
 * Examples:
 *
 *      connection.use(junction.delayParser());
 *
 * References:
 * - [XEP-0203: Delayed Delivery](http://xmpp.org/extensions/xep-0203.html)
 *
 * @return {Function}
 * @api public
 */
 
module.exports = function delayParser() {
  
  return function delayParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var delay = stanza.getChild('delay', 'urn:xmpp:delay');
    if (!delay) { return next(); }
    
    stanza.delayedBy = new JID(delay.attrs.from);
    stanza.originallySentAt = new Date(delay.attrs.stamp);
    next();
  }
}
