module.exports = function timeResultParser(options) {
  options = options || {};
  
  return function timeResultParser(stanza, next) {
    if (!stanza.is('iq')) { return next(); }
    if (stanza.type != 'result') { return next(); }
    var time = stanza.getChild('time', 'urn:xmpp:time');
    if (!time) { return next(); }
    
    var utcEl = time.getChild('utc');
    if (utcEl) {
      stanza.utcDate = new Date(utcEl.getText());
    }
    var tzoEl = time.getChild('tzo');
    if (tzoEl) {
      stanza.timezoneOffset = timezoneOffsetFromUTC(tzoEl.getText());
    }
    next();
  }
}


function timezoneOffsetFromUTC(tzo) {
  function parse(s) {
    var match = /([+\-])([0-9]{2}):(\d{2})/.exec(s);
    if (match) {
      var min = (parseInt(match[2], 10) * 60) + parseInt(match[3], 10);
      return match[1] == '+' ? min : 0 - min;
    }
    return 0;
  }
  return 0 - parse(tzo);
}
