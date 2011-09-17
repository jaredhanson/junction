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
  return { to: this.to, from: this.from, type: this.type };
}


/**
 * Expose `Message`.
 */
exports = module.exports = Message;
