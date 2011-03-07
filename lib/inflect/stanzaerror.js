var sys = require('sys');

function StanzaError (message) {
  Error.call(this, arguments);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'StanzaError';
  this.message = message;
  this.type = 'wait';
  this.condition = 'internal-server-error';
};

sys.inherits(StanzaError, Error);


module.exports = StanzaError;
