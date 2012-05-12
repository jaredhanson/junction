/**
 * Module dependencies.
 */
var util = require('util')
  , Element = require('./element');

/**
 * Initialize a new `Presence` element.
 *
 * @param {String} to
 * @param {String} from
 * @param {String} type
 * @api public
 */
function Presence(to, from, type) {
  if ('string' != typeof type) {
    type = from;
    from = null;
  }
  
  Element.call(this, 'presence');
  this.id = null;
  this.to = to || null;
  this.from = from || null;
  this.type = type || null;
}

/**
 * Inherit from `Element`.
 */
util.inherits(Presence, Element);

/**
 * Build XML attributes.
 *
 * @api private
 */
Presence.prototype.xmlAttributes = function() {
  return { id: this.id, to: this.to, from: this.from, type: this.type };
}


/**
 * Expose `Presence`.
 */
exports = module.exports = Presence;
