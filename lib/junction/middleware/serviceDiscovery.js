var util = require('util');
require('../../node-xmpp/element_ext');

module.exports = function serviceDiscovery(identities, features) {
  identities = identities || [];
  features = features || [];
  
  return function serviceDiscovery(req, res, next) {
    if (!req.isIQ() || !res) { return next(); }
    var query = req.getChild('query', 'http://jabber.org/protocol/disco#info');
    if (!query) { return next(); }
    
    var el = res.c('query', { xmlns: 'http://jabber.org/protocol/disco#info' });
    identities.forEach(function(identity) {
      var iel = el.c('identity', { category: identity.category,
                                   type: identity.type });
      if (identity.name) { iel.attrs.name = identity.name };
    });
    features.forEach(function(feature) {
      el.c('feature', { var: feature });
    });
    res.send();
  }
}
