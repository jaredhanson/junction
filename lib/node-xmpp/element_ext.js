var Element = require('node-xmpp').Element;

Element.prototype.isIQ = function() {
  return this.is('iq');
};

Element.prototype.isMessage = function() {
  return this.is('message');
};

Element.prototype.isPresence = function() {
  return this.is('presence');
};
