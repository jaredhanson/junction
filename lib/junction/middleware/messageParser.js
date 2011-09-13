/**
 * Parse message stanzas.
 *
 * This middleware parses the standard elements contained in message stanzas.
 * `stanza.subject` indicates the topic of the message.  `stanza.body` contains
 * the contents of the message.  `stanza.thread` is used to identify a
 * conversation thread.  `stanza.parentThread` is used to identify another
 * thread of which the current thread is an offshoot.
 *
 * Examples:
 *
 *      connection.use(junction.messageParser());
 *
 * References:
 * - [RFC 6121: Extensible Messaging and Presence Protocol (XMPP): Instant Messaging and Presence](http://xmpp.org/rfcs/rfc6121.html#message-syntax)
 *
 * @return {Function}
 * @api public
 */

module.exports = function messageParser() {
  
  return function messageParser(stanza, next) {
    if (!stanza.is('message')) { return next(); }
    
    var subject = stanza.getChild('subject');
    if (subject) { stanza.subject = subject.getText(); }
    
    var body = stanza.getChild('body');
    if (body) { stanza.body = body.getText(); }
    
    var thread = stanza.getChild('thread');
    if (thread) {
      stanza.thread = thread.getText();
      stanza.parentThread = thread.attrs.parent;
    }
    
    next();
  }
}
