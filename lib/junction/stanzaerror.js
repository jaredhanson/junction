var util = require('util');

function StanzaError(message) {
  Error.call(this, arguments);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'StanzaError';
  this.message = message;
  this.type = 'wait';
  this.condition = 'internal-server-error';
};

util.inherits(StanzaError, Error);


exports = module.exports = StanzaError;
