/**
 * Parse information about the software application associated with an XMPP
 * entity.
 *
 * This middleware parses software application information contained within 
 * IQ-result stanzas.  `stanza.application` indicates the name of the software
 * application.  `stanza.version` indicates the specific version of the
 * application.  `stanza.os` indicates the operating system on which the
 * application is executing.
 *
 * Examples:
 *
 *      connection.use(junction.softwareVersionResultParser());
 *
 * References:
 * - [XEP-0092: Software Version](http://xmpp.org/extensions/xep-0092.html)
 *
 * @return {Function}
 * @api public
 */

module.exports = function softwareVersionResultParser() {
  
  return function softwareVersionResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var query = stanza.getChild('query', 'jabber:iq:version');
    if (!query) { return next(); }
    
    var nameEl = query.getChild('name');
    if (nameEl) {
      stanza.application = nameEl.getText();
    }
    var versionEl = query.getChild('version');
    if (versionEl) {
      stanza.version = versionEl.getText();
    }
    var osEl = query.getChild('os');
    if (osEl) {
      stanza.os = osEl.getText();
    }
    next();
  }
}
