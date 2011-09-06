module.exports = function softwareVersionResultParser(options) {
  options = options || {};
  
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
