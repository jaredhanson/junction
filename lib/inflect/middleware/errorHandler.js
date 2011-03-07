var StanzaError = require('./../stanzaerror');

module.exports = function errorHandler(connection, options) {
  options = options || {};

  // TODO: Implement options
  
  return function errorHandler(err, stanza, response, next) {
    // Error encountered, but no response mechanism available.
    if (response === undefined) {
      next(err);
      return;
    }
    
    
    var type = 'wait';
    var condition = 'internal-server-error';
    
    if (err instanceof StanzaError) {
        type = err.type;
        condition = err.condition;
    }
    
    response.attrs.type = 'error';
    
    var errEl = response.c('error', { type: type })
      .c(condition, { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).up();
    
    if (err.message && err.message.length) {
      // TODO: Implement options to include stack trace in message.
      errEl.c('text', { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t(err.message)
    }
    
    // TODO: Insert elements from stanza that triggered the error.
    // TODO: Allow for application-specific elements to be included.
    
    response.send();
  }
}
