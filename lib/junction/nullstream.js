var util = require('util');
var EventEmitter = require('events').EventEmitter;

function NullStream() {
  EventEmitter.call(this);
};

util.inherits(NullStream, EventEmitter);

NullStream.prototype.connect = function() {
}


module.exports = NullStream;
