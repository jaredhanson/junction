var events = require('events');
var util = require('util');
require('../../node-xmpp/element_ext');

module.exports = function presence(fn) {
  if (!fn) throw new Error('presence middleware requires a callback function');
  
  var handler = new Handler();
  fn.call(this, handler);
  
  return function presence(stanza, next) {
    if (!stanza.isPresence()) { return next(); }
    handler._parse(stanza);
    next();
  }
}


function Handler() {
  events.EventEmitter.call(this);
};

util.inherits(Handler, events.EventEmitter);

Handler.prototype._parse = function(stanza) {
  if (!stanza.attrs.type) {
    this.emit('available', stanza);
  } if (stanza.attrs.type == 'error') {
    // If there is no listener for an 'error' event, Node's default action is to
    // print a stack trace and exit the program.  This behavior is not
    // desirable for error stanzas, so they will instead be emitted as 'err'
    // events.
    this.emit('err', stanza);
  } else {
    this.emit(stanza.attrs.type, stanza);
  }
};
