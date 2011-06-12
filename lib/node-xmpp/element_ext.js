var Element = require('node-xmpp').Element;

Element.prototype.isIQ = function() {
  return this.is('iq');
};

Element.prototype.isPresence = function() {
  return this.is('presence');
};
