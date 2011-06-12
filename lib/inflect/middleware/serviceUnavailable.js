var StanzaError = require('../stanzaerror');

module.exports = function serviceUnavailable() {
  return function serviceUnavailable(req, res, next) {
    if (req.isIQ() && res) {
      var err = new StanzaError();
      err.type = 'cancel';
      err.condition = 'service-unavailable';
      next(err);
    } else {
      next();
    }
  }
}
