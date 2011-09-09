module.exports = function lastActivityResultParser(options) {
  options = options || {};
  
  return function lastActivityResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var query = stanza.getChild('query', 'jabber:iq:last');
    if (!query) { return next(); }
    
    stanza.lastActivity = query.attrs.seconds;
    stanza.lastStatus = query.getText();
    next();
  }
}
