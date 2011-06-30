var util = require('util');
var Element = require('./element');

function Presence(to, from, type) {
  if ('string' != typeof type) {
    type = from;
    from = null;
  }
  
  Element.call(this, 'presence');
  this.to = to || null;
  this.from = from || null;
  this.type = type || null;
}

util.inherits(Presence, Element);

Presence.prototype.xmlAttributes = function() {
  return { to: this.to, from: this.from, type: this.type };
}


exports = module.exports = Presence;
