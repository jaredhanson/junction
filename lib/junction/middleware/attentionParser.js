/**
 * Parse elements intended to get the attention of a user.
 *
 * This middleware parses elements within the _urn:xmpp:attention:0_ namespace.
 * If attention is requested, `stanza.attention` will be set to `true`.
 *
 * Examples:
 *
 *      connection.use(junction.attentionParser());
 *
 * References:
 * - [XEP-0224: Attention](http://xmpp.org/extensions/xep-0224.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function attentionParser(options) {
  
  return function attentionParser(stanza, next) {
    if (!stanza.is('message')) { return next(); }
    var attention = stanza.getChild('attention', 'urn:xmpp:attention:0');
    if (!attention) { return next(); }
    
    stanza.attention = true;
    next();
  }
}
