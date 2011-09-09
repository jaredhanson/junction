var StanzaError = require('../stanzaerror');

module.exports = function lastActivity(fn) {
  fn = fn || uptime;
  
  var start = Date.now();
  function uptime() {
    return Math.round((Date.now() - start) / 1000);
  }
  
  return function lastActivity(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'jabber:iq:last');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var now = Date.now();
    var q = res.c('query', { xmlns: 'jabber:iq:last', seconds: fn() });
    res.send();
  }
}
