/**
 * Module dependencies.
 */
var util = require('util')
  , StanzaError = require('../stanzaerror');


/**
 * Handle requests for discovering information about an XMPP entity
 *
 * This middleware handles IQ-get requests for information about the identity
 * and capabilities of an XMPP entity.  These requests are contained within the
 * _http://jabber.org/protocol/disco#info_ XML namespace.
 *
 * This middleware is intentionally simple, providing only the most basic, yet
 * widely used, features of the service discovery protocol.  Specifically, it
 * has no support for item discovery or for querying nodes.  For a
 * feature-complete implementation of service discovery, [Junction/Disco](https://github.com/jaredhanson/junction-disco)
 * should be used.
 *
 * Examples:
 *
 *      connection.use(
 *        junction.serviceDiscovery([ { category: 'conference', type: 'text', name: 'Play-Specific Chatrooms' },
 *                                    { category: 'directory', type: 'chatroom' } ],
 *                                  [ 'http://jabber.org/protocol/disco#info', 
 *                                    'http://jabber.org/protocol/muc' ])
 *      );
 *
 *      connection.use(
 *        junction.serviceDiscovery( { category: 'client', type: 'pc' },
 *                                   'http://jabber.org/protocol/disco#info' )
 *      );
 *
 * References:
 * - [XEP-0030: Software Version](http://xmpp.org/extensions/xep-0030.html)
 *
 * @param {Array|String} identities
 * @param {Array|String} features
 * @return {Function}
 * @api public
 */
 
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
