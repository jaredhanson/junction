/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');


/**
 * Handle legacy requests for the local time of an XMPP entity.
 *
 * This middleware handles IQ-get requests within the _jabber:iq:time_ XML
 * namespace.  The middleware responds with the UTC time of the entity, and
 * optionally the time zone and a human-readable display string.
 *
 * Options:
 *
 *   - `timezone`  a string containing the time zone, typically a three-letter acronym
 *   - `display`   a string containing the time in a human-readable format
 *
 * Examples:
 *
 *      connection.use(junction.legacyTime());
 *
 *      connection.use(
 *        junction.legacyTime({ timezone: 'MDT', display: 'Tue Sep 10 12:58:35 2002' })
 *      );
 *
 * References:
 * - [XEP-0090: Legacy Entity Time](http://xmpp.org/extensions/xep-0090.html)
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
 
module.exports = function legacyTime(options) {
  options = options || {};
  
  return function legacyTime(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'jabber:iq:time');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var now = options.date || new Date();
    var t = res.c('query', { xmlns: 'jabber:iq:time' });
    t.c('utc').t(LegacyXMPPDateTimeString(now));
    if (options.timezone) { t.c('tz').t(options.timezone); }
    if (options.display) { t.c('display').t(options.display); }
    res.send();
  }
}


function LegacyXMPPDateTimeString(d) {
  function pad(n) { return n < 10 ? '0' + n : n.toString() }
  return d.getUTCFullYear()
    + pad(d.getUTCMonth() + 1)
    + pad(d.getUTCDate()) + 'T'
    + pad(d.getUTCHours()) + ':'
    + pad(d.getUTCMinutes()) + ':'
    + pad(d.getUTCSeconds())
}
