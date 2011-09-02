var JID = require('node-xmpp').JID;

module.exports = function legacyDelayParser(options) {
  options = options || {};
  
  return function legacyDelayParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var delay = stanza.getChild('x', 'jabber:x:delay');
    if (!delay) { return next(); }
    
    stanza.delayedBy = new JID(delay.attrs.from);
    var match = /(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(delay.attrs.stamp);
    if (match) {
      stanza.originallySentAt = new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
    }
    
    next();
  }
}
