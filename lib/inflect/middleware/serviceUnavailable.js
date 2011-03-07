var StanzaError = require('./../stanzaerror');

module.exports = function serviceUnavailable(connection) {
  return function serviceUnavailable(stanza, response, next) {
    if (stanza.is('iq') && response !== undefined) {
      var err = new StanzaError();
      err.type = 'cancel';
      err.condition = 'service-unavailable';
      next(err);
    } else {
      next();
    }
  }
}
