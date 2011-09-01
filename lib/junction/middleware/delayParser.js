module.exports = function delayParser(options) {
  options = options || {};
  
  return function delayParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var delay = stanza.getChild('delay', 'urn:xmpp:delay');
    if (!delay) { return next(); }
    
    stanza.sentAt = new Date(delay.attrs.stamp);
    next();
  }
}
