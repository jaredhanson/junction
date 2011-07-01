var StanzaError = require('../stanzaerror');

module.exports = function errorHandler(options) {
  options = options || {};
  
  var includeStanza = options.includeStanza || false;
  var showStack = options.showStack || false;
  var dumpExceptions = options.dumpExceptions || false;

  return function errorHandler(err, req, res, next) {
    if (dumpExceptions) { console.error(err.stack); }
    
    // An error was encountered, but no response mechanism is available to
    // return information to the requesting entity.
    if (!res) { return next(err); }
    
    var type = err.type || 'wait';
    var condition = err.condition || 'internal-server-error';
    var message = err.message || '';
    if (showStack) {
      message += '\n';
      message += err.stack;
    }
    
    res.attrs.type = 'error';
    if (includeStanza) {
      // TODO: Implement support for including XML stanza that triggered the
      //       error.
    }
    var errorEl = res.c('error', { type: type }).c(condition, { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).up();
    if (message && message.length) {
      errorEl.c('text', { xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas' }).t(message)
    }
    if (err.specificCondition && err.specificCondition.name) {
      errorEl.c(err.specificCondition.name, { xmlns: err.specificCondition.xmlns })
    }
    res.send();
  }
}
