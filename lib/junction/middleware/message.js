var events = require('events');
var util = require('util');
require('../../node-xmpp/element_ext');

module.exports = function message(fn) {
  if (!fn) throw new Error('message middleware requires a callback function');
  
  var handler = new Handler();
  fn.call(this, handler);
  
  return function message(stanza, next) {
    if (!stanza.isMessage()) { return next(); }
    handler._handle(stanza);
    next();
  }
}


function Handler() {
  events.EventEmitter.call(this);
};

util.inherits(Handler, events.EventEmitter);

Handler.prototype._handle = function(stanza) {
  if (!stanza.attrs.type) {
    this.emit('normal', stanza);
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
