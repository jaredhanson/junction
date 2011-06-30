var util = require('util');

function StanzaError(message, type, condition) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'StanzaError';
  this.message = message || null;
  this.type = type || 'wait';
  this.condition = condition || 'internal-server-error';
};

util.inherits(StanzaError, Error);


exports = module.exports = StanzaError;
