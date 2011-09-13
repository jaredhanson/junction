/**
 * Parse user nicknames.
 *
 * This middleware parses user nicknames contained within presence subscription
 * requests and messages.  `stanza.nickname` indicates the nickname, asserted by
 * the sending XMPP user.
 *
 * Examples:
 *
 *      connection.use(junction.nicknameParser());
 *
 * References:
 * - [XEP-0172: User Nickname](http://xmpp.org/extensions/xep-0172.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function nicknameParser() {
  
  return function nicknameParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var nick = stanza.getChild('nick', 'http://jabber.org/protocol/nick');
    if (!nick) { return next(); }
    
    stanza.nickname = nick.getText();
    next();
  }
}
