/**
 * Module dependencies.
 */
var StanzaError = require('../stanzaerror');


/**
 * Handle requests for information about the software application associated
 * with an XMPP entity.
 *
 * This middleware handles IQ-get requests within the _jabber:iq:version_ XML
 * namespace.  The middleware responds with the application name, version, and
 * operating system.
 *
 * Examples:
 *
 *      connection.use(junction.softwareVersion('IMster', '1.0', 'Linux'));
 *
 * References:
 * - [XEP-0092: Software Version](http://xmpp.org/extensions/xep-0092.html)
 *
 * @param {String} name
 * @param {String} version
 * @param {String} os
 * @return {Function}
 * @api public
 */

module.exports = function softwareVersion(name, version, os) {
  
  return function softwareVersion(req, res, next) {
    if (!req.is('iq')) { return next(); }
    if (req.type == 'result' || req.type == 'error') { return next(); }
    var query = req.getChild('query', 'jabber:iq:version');
    if (!query) { return next(); }
    
    if (req.type != 'get') {
      return next(new StanzaError("Query must be an IQ-get stanza.", 'modify', 'bad-request'));
    }
    
    var ver = res.c('query', { xmlns: 'jabber:iq:version' });
    if (name) { ver.c('name').t(name); }
    if (version) { ver.c('version').t(version); }
    if (os) { ver.c('os').t(os); }
    res.send();
  }
}
