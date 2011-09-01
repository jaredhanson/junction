var StanzaError = require('../stanzaerror');

module.exports = function ping(options) {
  options = options || {};
  
  return function ping(req, res, next) {
    if (!req.is('iq')) { return next(); }
    var ping = req.getChild('ping', 'urn:xmpp:ping');
    if (!ping) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Ping must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    // Send ping response.
    res.send();
  }
}
