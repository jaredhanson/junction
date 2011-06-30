var util = require('util');
var Element = require('./element');

function Message(to, from, type) {
  if ('string' != typeof type) {
    type = from;
    from = null;
  }
  
  Element.call(this, 'message');
  this.to = to || null;
  this.from = from || null;
  this.type = type || null;
}

util.inherits(Message, Element);

Message.prototype.xmlAttributes = function() {
  return { to: this.to, from: this.from, type: this.type };
}


exports = module.exports = Message;
