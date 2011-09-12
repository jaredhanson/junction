/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');


/**
 * Handle requests for the last activity associated with an XMPP entity.
 *
 * This middleware handles IQ-get requests within the _jabber:iq:last_ XML
 * namespace.  By default, the middleware responds with the uptime of the
 * entity, measured in seconds.
 *
 * Examples:
 *
 *      connection.use(junction.lastActivity());
 *
 *      connection.use(
 *        junction.lastActivity(function() {
 *          return 31556926;
 *        })
 *      );
 *
 * References:
 * - [XEP-0012: Last Activity](http://xmpp.org/extensions/xep-0012.html)
 *
 * @param {Function} callback
 * @return {Function}
 * @api public
 */
 
module.exports = function lastActivity(callback) {
  callback = callback || uptime;
  
  var start = Date.now();
  function uptime() {
    return Math.round((Date.now() - start) / 1000);
  }
  
  return function lastActivity(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'jabber:iq:last');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var now = Date.now();
    var q = res.c('query', { xmlns: 'jabber:iq:last', seconds: callback() });
    res.send();
  }
}
