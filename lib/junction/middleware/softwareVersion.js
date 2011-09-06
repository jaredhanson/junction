var StanzaError = require('../stanzaerror');

module.exports = function softwareVersion(name, version, os) {
  
  return function softwareVersion(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'jabber:iq:version');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var ver = res.c('query', { xmlns: 'jabber:iq:version' });
    if (name) { ver.c('name').t(name); }
    if (version) { ver.c('version').t(version); }
    if (os) { ver.c('os').t(os); }
    res.send();
  }
}
