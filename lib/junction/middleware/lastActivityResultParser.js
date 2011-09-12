/**
 * Parse information about the last activity associated with an XMPP entity.
 *
 * This middleware parses last activity information contained within IQ-result
 * stanzas.  `stanza.lastActivity` indicates the time of last activity of the
 * entity, in seconds.  `stanza.lastStatus` indicates last status of the entity.
 *
 * Examples:
 *
 *      connection.use(junction.lastActivityResultParser());
 *
 * References:
 * - [XEP-0012: Last Activity](http://xmpp.org/extensions/xep-0012.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function lastActivityResultParser() {
  
  return function lastActivityResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var query = stanza.getChild('query', 'jabber:iq:last');
    if (!query) { return next(); }
    
    stanza.lastActivity = query.attrs.seconds;
    stanza.lastStatus = query.getText();
    next();
  }
}
