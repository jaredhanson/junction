/**
 * Module dependencies.
 */
var util = require('util');

/**
 * Initialize a new `StanzaError`.
 *
 * @param {String} message
 * @param {String} type
 * @param {String} condition
 */
function StanzaError(message, type, condition) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'StanzaError';
  this.message = message || null;
  this.type = type || 'wait';
  this.condition = condition || 'internal-server-error';
};

/**
 * Inherit from `Error`.
 */
util.inherits(StanzaError, Error);


/**
 * Expose `StanzaError`.
 */

exports = module.exports = StanzaError;
