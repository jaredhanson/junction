/**
 * Parse legacy information about the local time of an XMPP entity.
 *
 * This middleware parses legacy local time information contained within
 * IQ-result stanzas.  `stanza.utcDate` indicates the UTC time according to the
 * responding entity.  `stanza.timezone` indicates the time zone in which the
 * responding entity is located.  `stanza.display` contains the time in a
 * human-readable format.
 *
 * Examples:
 *
 *      connection.use(junction.legacyTimeResultParser());
 *
 * References:
 * - [XEP-0090: Legacy Entity Time](http://xmpp.org/extensions/xep-0090.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function legacyTimeResultParser() {
  
  return function legacyTimeResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var query = stanza.getChild('query', 'jabber:iq:time');
    if (!query) { return next(); }
    
    var utcEl = query.getChild('utc');
    if (utcEl) {
      var match = /(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(utcEl.getText());
      if (match) {
        stanza.utcDate = new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
      }
    }
    var tzEl = query.getChild('tz');
    if (tzEl) {
      stanza.timezone = tzEl.getText();
    }
    var displayEl = query.getChild('display');
    if (displayEl) {
      stanza.display = displayEl.getText();
    }
    next();
  }
}
