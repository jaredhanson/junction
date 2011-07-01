var StanzaError = require('../stanzaerror');
require('../../node-xmpp/element_ext');

module.exports = function serviceUnavailable() {
  return function serviceUnavailable(req, res, next) {
    if (!req.isIQ()) { return next(); }
    res.attrs.type = 'error';
    res.c('error', { type: 'cancel' }).c('service-unavailable', { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' });
    res.send();
  }
}
