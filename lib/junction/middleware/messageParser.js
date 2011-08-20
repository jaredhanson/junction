module.exports = function messageParser(options) {
  options = options || {};
  
  return function messageParser(stanza, next) {
    if (!stanza.is('message')) { return next(); }
    
    var subject = stanza.getChild('subject');
    if (subject) { stanza.subject = subject.getText(); }
    
    var body = stanza.getChild('body');
    if (body) { stanza.body = body.getText(); }
    
    var thread = stanza.getChild('thread');
    if (thread) {
      stanza.thread = thread.getText();
      stanza.thread.parent = thread.attrs.parent;
    }
    
    next();
  }
}
