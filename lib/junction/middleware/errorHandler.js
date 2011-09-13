/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');


/**
 * Flexible error handler, providing error responses containing a message,
 * application-specific error conditions, and optional stack traces.
 *
 * Options:
 *
 *   - `includeStanza`   include the original stanza in the error response. Defaults to `false` (_not implemented_)
 *   - `showStack`       respond with both the error message and stack trace. Defaults to `false`
 *   - `dumpExceptions`  dump exceptions to stderr (without terminating the process). Defaults to `false`
 *
 * Examples:
 *
 *      connection.use(junction.errorHandler());
 *
 *      connection.use(
 *        junction.errorHandler({ showStack: true, dumpExceptions: true })
 *      );
 *
 *   Middleware can then `next()` with an error:
 *
 *      next(new Error("You're doing it wrong!"));
 *
 *      next(new StanzaError("Administrator privileges required.", "auth", "forbidden"));
 *
 *      var err = new StanzaError('', 'modify', 'bad-request');
 *      err.specificCondition = { name: 'invalid-jid', xmlns: 'http://jabber.org/protocol/pubsub#errors' };
 *      next(err);
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */
 
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
