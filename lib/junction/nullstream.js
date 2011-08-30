/**
 * Module dependencies.
 */
var util = require('util')
  , EventEmitter = require('events').EventEmitter;

/**
 * Initialize a new `NullStream`.
 *
 * @api private
 */
function NullStream() {
  EventEmitter.call(this);
};

/**
 * Inherit from `EventEmitter`.
 */
util.inherits(NullStream, EventEmitter);

/**
 * Override `connect()`, treating the operation as a noop.
 *
 * @api private
 */
NullStream.prototype.connect = function() {
}


/**
 * Expose `NullStream`.
 */

module.exports = NullStream;
