/**
 * Parse presence stanzas.
 *
 * This middleware parses the standard elements contained in presence stanzas.
 * `stanza.show` indicates the availability sub-state of an entity.
 * `stanza.status` contains a human-readable description of an entity's
 * availability.  `stanza.priority` specifies the priority level of the
 * resource.
 *
 * Examples:
 *
 *      connection.use(junction.presenceParser());
 *
 * References:
 * - [RFC 6121: Extensible Messaging and Presence Protocol (XMPP): Instant Messaging and Presence](http://xmpp.org/rfcs/rfc6121.html#presence-syntax)
 *
 * @return {Function}
 * @api public
 */

module.exports = function presenceParser() {
  
  return function presenceParser(stanza, next) {
    if (!stanza.is('presence')) { return next(); }
    
    var show = stanza.getChild('show');
    if (show) {
      stanza.show = show.getText();
    } else if (!stanza.attrs.type) {
      stanza.show = 'online';
    }
    
    var status = stanza.getChild('status');
    if (status) { stanza.status = status.getText(); }
    
    var priority = stanza.getChild('priority');
    if (priority) {
      stanza.priority = parseInt(priority.getText());
    } else {
      stanza.priority = 0;
    }
    
    next();
  }
}
