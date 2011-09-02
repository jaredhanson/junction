module.exports = function nicknameParser(options) {
  options = options || {};
  
  return function nicknameParser(stanza, next) {
    if (!(stanza.is('message') || stanza.is('presence'))) { return next(); }
    var nick = stanza.getChild('nick', 'http://jabber.org/protocol/nick');
    if (!nick) { return next(); }
    
    stanza.nickname = nick.getText();
    next();
  }
}
