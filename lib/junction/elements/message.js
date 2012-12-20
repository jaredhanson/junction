/**
 * Module dependencies.
 */
var util = require('util')
  , Element = require('./element');

/**
 * Initialize a new `Message` element.
 *
 * @param {String} to
 * @param {String} from
 * @param {String} type
 * @api public
 */
function Message(to, from, type) {
  if ('string' != typeof type) {
    type = from;
    from = null;
  }
  
  Element.call(this, 'message');
  this.id = null;
  this.to = to || null;
  this.from = from || null;
  this.type = type || null;
}

/**
 * Inherit from `Element`.
 */
util.inherits(Message, Element);

/**
 * Build XML attributes.
 *
 * @api private
 */
Message.prototype.xmlAttributes = function() {
  var attrs = {};
  if (this.id) { attrs.id = this.id };
  if (this.to) { attrs.to = this.to };
  if (this.from) { attrs.from = this.from };
  if (this.type) { attrs.type = this.type };
  return attrs;
}


/**
 * Expose `Message`.
 */
exports = module.exports = Message;
