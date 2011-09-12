/**
 * Parse information about the local time of an XMPP entity.
 *
 * This middleware parses local time information contained within IQ-result
 * stanzas.  `stanza.utcDate` indicates the UTC time according to the responding
 * entity.  `stanza.timezoneOffset` indicates the timezone offset from UTC, in
 * minutes, for the responding entity.
 *
 * The time-zone offset is the difference, in minutes, between UTC and local
 * time.  Note that this means that the offset is positive if the local timezone
 * is behind UTC and negative if it is ahead.  For example, if your time zone is
 * UTC+10 (Australian Eastern Standard Time), -600 will be returned.  This
 * matches the semantics of `getTimezoneOffset()` provided by JavaScript's
 * built-in `Date` class.
 *
 * Examples:
 *
 *      connection.use(junction.timeResultParser());
 *
 * References:
 * - [XEP-0202: Entity Time](http://xmpp.org/extensions/xep-0202.html)
 *
 * @return {Function}
 * @api public
 */
 
module.exports = function timeResultParser() {
  
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
