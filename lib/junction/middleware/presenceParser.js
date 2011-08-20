module.exports = function presenceParser(options) {
  options = options || {};
  
  return function presenceParser(stanza, next) {
    if (!stanza.is('presence')) { return next(); }
    
    var show = stanza.getChild('show');
    if (show) {
      stanza.show = show.getText();
    } else if (!stanza.attrs.type) {
      stanza.show = 'online';
    }
    
    var status = stanza.getChild('status');
    if (status) { stanza.status = status.getText(); }
    
    var priority = stanza.getChild('priority');
    if (priority) {
      stanza.priority = priority.getText();
    } else {
      stanza.priority = 0;
    }
    
    next();
  }
}
