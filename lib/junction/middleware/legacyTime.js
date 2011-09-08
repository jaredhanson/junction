var StanzaError = require('../stanzaerror');

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
  function pad(n) { return n < 10 ? '0' + n : n }
  return d.getUTCFullYear()
    + pad(d.getUTCMonth() + 1)
    + pad(d.getUTCDate()) + 'T'
    + pad(d.getUTCHours()) + ':'
    + pad(d.getUTCMinutes()) + ':'
    + pad(d.getUTCSeconds())
}
