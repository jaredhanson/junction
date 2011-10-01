/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');


/**
 * Handle requests for the local time of an XMPP entity.
 *
 * This middleware handles IQ-get requests within the _urn:xmpp:time_ XML
 * namespace.  The middleware responds with the UTC time of the entity, as well
 * as the offset from UTC.
 *
 * Examples:
 *
 *      connection.use(junction.time());
 *
 * References:
 * - [XEP-0202: Entity Time](http://xmpp.org/extensions/xep-0202.html)
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function time(options) {
  options = options || {};
  
  return function time(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var te = req.getChild('time', 'urn:xmpp:time');
    if (!te) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Time must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var now = options.date || new Date();
    var tzo = (typeof options.timezoneOffset !== 'undefined') ? options.timezoneOffset : now.getTimezoneOffset();
    var t = res.c('time', { xmlns: 'urn:xmpp:time' });
    t.c('utc').t(XSDDateTimeString(now));
    t.c('tzo').t(XSDTimeZoneString(tzo));
    res.send();
  }
}


// CREDIT: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date
function XSDDateTimeString(d) {
  function pad(n) { return n < 10 ? '0' + n : n }
  return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate()) + 'T'
    + pad(d.getUTCHours()) + ':'
    + pad(d.getUTCMinutes()) + ':'
    + pad(d.getUTCSeconds()) + 'Z'
}

function XSDTimeZoneString(tzo) {
  function sign(n) { return n > 0 ? '+' : '-' }
  function pad(n) { return n < 10 ? '0' + n : n.toString() }
  return sign(0 - tzo)
    + pad(Math.floor(Math.abs(tzo) / 60)) + ':'
    + pad(Math.abs(tzo) % 60);
}
