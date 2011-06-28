var util = require('util');
var Element = require('./element');

function IQ(to, from, type) {
  if ('string' != typeof type) {
    type = from;
    from = null;
  }
  type = type || 'get';
  
  Element.call(this, 'iq');
  this.id = null;
  this.to = to;
  this.from = from;
  this.type = type;
}

util.inherits(IQ, Element);

IQ.prototype.xmlAttributes = function() {
  return { id: this.id, to: this.to, from: this.from, type: this.type };
}


exports = module.exports = IQ;
