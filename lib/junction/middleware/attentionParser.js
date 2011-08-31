module.exports = function attentionParser(options) {
  options = options || {};
  
  return function attentionParser(stanza, next) {
    if (!stanza.is('message')) { return next(); }
    var attention = stanza.getChild('attention', 'urn:xmpp:attention:0');
    if (!attention) { return next(); }
    
    stanza.attention = true;
    next();
  }
}
