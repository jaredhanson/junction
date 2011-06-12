var StanzaError = require('../stanzaerror');

module.exports = function errorHandler(options) {
  options = options || {};

  return function errorHandler(err, req, res, next) {
    // An error was encountered, but no response mechanism is available to
    // return information to the requesting entity.
    if (!res) { return next(err); }
    
    var type = 'wait';
    var condition = 'internal-server-error';
    if (err instanceof StanzaError) {
        type = err.type;
        condition = err.condition;
    }
    
    res.attrs.type = 'error';
    var el = res.c('error', { type: type }).c(condition, { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).up();
    if (err.message && err.message.length) {
      // @todo: Implement option to include stack trace in message.
      el.c('text', { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t(err.message)
    }
    // @todo: Insert elements from request stanza that triggered the error.
    // @todo: Allow for application-specific elements to be included.
    res.send();
  }
}
