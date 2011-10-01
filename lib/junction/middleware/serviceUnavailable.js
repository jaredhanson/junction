/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');
require('../../node-xmpp/element_ext');

/**
 * Respond with service-unavailable error to IQ request stanzas.
 *
 * This middleware responds with a service-unavailable stanza error to any
 * IQ-get or IQ-set stanza.  This error is used to indicate that an entity does
 * not provide the requested service.
 *
 * This middleware should be `use()`-ed at the lowest priority level.  This
 * allows higher-priority middleware an opportunity to process the stanza.  If
 * all higher-priority middleware pass on that opportunity, the stanza will be
 * handled by this middleware and a service-unavailable error will be sent to
 * the requesting entity.
 *
 * Examples:
 *
 *      connection.use(junction.ping());
 *      // TODO: Use other application-specific middleware here.
 *      connection.use(junction.serviceUnavailable());
 *
 * References:
 * - [RFC 6120: Extensible Messaging and Presence Protocol (XMPP): Core](http://xmpp.org/rfcs/rfc6120.html)
 *
 * @return {Function}
 * @api public
 */
 
module.exports = function serviceUnavailable() {
  return function serviceUnavailable(req, res, next) {
    if (!req.is('iq')) { return next(); }
    res.attrs.type = 'error';
    res.c('error', { type: 'cancel' }).c('service-unavailable', { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' });
    res.send();
  }
}
