/**
 * Module dependencies.
 */
var util = require('util')
  , Element = require('./element');

/**
 * Initialize a new `IQ` element.
 *
 * @param {String} to
 * @param {String} from
 * @param {String} type
 * @api public
 */
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

/**
 * Inherit from `Element`.
 */
util.inherits(IQ, Element);

/**
 * Build XML attributes.
 *
 * @api private
 */
IQ.prototype.xmlAttributes = function() {
  var attrs = {};
  if (this.id) { attrs.id = this.id };
  if (this.to) { attrs.to = this.to };
  if (this.from) { attrs.from = this.from };
  if (this.type) { attrs.type = this.type };
  return attrs;
}


/**
 * Expose `IQ`.
 */
exports = module.exports = IQ;
