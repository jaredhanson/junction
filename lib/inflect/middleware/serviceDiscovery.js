var util = require('util');
var StanzaError = require('./../stanzaerror');

module.exports = function serviceDiscovery(connection, identities, features) {
  identities = identities || [];
  features = features || [];
  
  return function serviceDiscovery(stanza, response, next) {
    if (!stanza.is('iq') || response === undefined) {
      next();
      return;
    }
    var query = stanza.getChild('query', 'http://jabber.org/protocol/disco#info');
    if (!query) {
      next();
      return;
    }
    
    
    var queryEl = response.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' });
    
    identities.forEach(function(identity) {
      var identityEl = queryEl.c('identity', { category: identity.category,
                                               type: identity.type });
      if (identity.name) { identityEl.attrs.name = identity.name };
    });
    
    features.forEach(function(feature) {
      queryEl.c('feature', { var: feature });
    });
    
    response.send();
  }
}
