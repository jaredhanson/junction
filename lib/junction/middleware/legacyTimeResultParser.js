module.exports = function legacyTimeResultParser(options) {
  options = options || {};
  
  return function legacyTimeResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var query = stanza.getChild('query', 'jabber:iq:time');
    if (!query) { return next(); }
    
    var utcEl = query.getChild('utc');
    if (utcEl) {
      var match = /(\d{4})(\d{2})(\d{2})T(\d{2}):(\d{2}):(\d{2})/.exec(utcEl.getText());
      if (match) {
        stanza.utcDate = new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
      }
    }
    var tzEl = query.getChild('tz');
    if (tzEl) {
      stanza.timezone = tzEl.getText();
    }
    var displayEl = query.getChild('display');
    if (displayEl) {
      stanza.display = displayEl.getText();
    }
    next();
  }
}
