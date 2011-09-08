var util = require('util');
var StanzaError = require('../stanzaerror');

module.exports = function serviceDiscovery(identities, features) {
  identities = identities || [];
  features = features || [];
  if (!Array.isArray(identities)) { identities = [ identities ]; }
  if (!Array.isArray(features)) { features = [ features ]; }
  
  return function serviceDiscovery(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'http://jabber.org/protocol/disco#info');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    if (query.attrs.node) {
      return next(new StanzaError("", 'cancel', 'item-not-found'));
    }
    
    var info = res.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' });
    identities.forEach(function(identity) {
      var ide = info.c('identity', { category: identity.category,
                                     type: identity.type });
      if (identity.name) { ide.attrs.name = identity.name };
    });
    features.forEach(function(feature) {
      info.c('feature', { var: feature });
    });
    res.send();
  }
}
