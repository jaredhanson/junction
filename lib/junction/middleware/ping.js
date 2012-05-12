/**
 * Module dependencies.
 */
 
var StanzaError = require('../stanzaerror');


/**
 * Handle application-level pings sent over XMPP stanzas.
 *
 * Examples:
 *
 *      connection.use(junction.ping());
 *
 * References:
 * - [XEP-0199: XMPP Ping](http://xmpp.org/extensions/xep-0199.html)
 *
 * @return {Function}
 * @api public
 */
 
module.exports = function ping() {
  
  return function ping(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var ping = req.getChild('ping', 'urn:xmpp:ping');
    if (!ping) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Ping must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    // Send ping response.
    res.send();
  }
}
