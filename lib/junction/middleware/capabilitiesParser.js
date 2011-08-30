module.exports = function capabilitiesParser(options) {
  options = options || {};
  
  return function capabilitiesParser(stanza, next) {
    if (!stanza.is('presence')) { return next(); }
    var c = stanza.getChild('c', 'http://jabber.org/protocol/caps');
    if (!c) { return next(); }
    
    stanza.capabilities = {};
    stanza.capabilities.node = c.attrs.node;
    stanza.capabilities.hash = c.attrs.hash;
    stanza.capabilities.verification = c.attrs.ver;
    next();
  }
}
