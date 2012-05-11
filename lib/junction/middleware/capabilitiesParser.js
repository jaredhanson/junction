/**
 * Parse entity capabilities broadcast in presence stanzas.
 *
 * This middleware parses entity capabilities present in presence stanzas.
 * `stanza.capabilities.node` will be set to a URI that uniquely identifies a
 * software application.  `stanza.capabilities.verification` will be set to a
 * string used to verify the identity and supported features of the entity.
 * `stanza.capabilities.hash` will indicate the hashing algorithm used to
 * generate the verification string
 *
 * Examples:
 *
 *      connection.use(junction.capabilitiesParser());
 *
 * References:
 * - [XEP-0115: Entity Capabilities](http://xmpp.org/extensions/xep-0115.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function capabilitiesParser() {
  
  return function capabilitiesParser(stanza, next) {
    if (!stanza.is('presence')) { return next(); }
    var c = stanza.getChild('c', 'http://jabber.org/protocol/caps');
    if (!c) { return next(); }
    
    stanza.caps =
    stanza.capabilities = {};
    stanza.capabilities.node = c.attrs.node;
    stanza.capabilities.ver =
    stanza.capabilities.verification = c.attrs.ver;
    stanza.capabilities.hash = c.attrs.hash;
    next();
  }
}
