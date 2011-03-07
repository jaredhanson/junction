var sys = require('sys');
var xmpp = require('node-xmpp');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;


function Connection (options) {
  var self = this;
  this._stack = [];
  EventEmitter.call(this);
  
  if (options.type == 'client') {
    this._connection = new xmpp.Client(options);
  } else {
    this._connection = new xmpp.Component(options);
  }
  
  this._connection.on('online', function () {
    self.emit('online');
  });
  
  this._connection.on('stanza', function (stanza) {
    self.emit('stanza', stanza);
    
    var stack = self._stack;
    var index = 0;
    var response = self._prepareResponse(stanza);
    
    function next(err) {
      var layer = stack[index++];
      
      // end of chain
      if (!layer) {
        return;
      }
      
      try {
        var arity = layer.handle.length;
        if (err) {
          if (arity == 4) {
            layer.handle(err, stanza, response, next);
          } else {
            next(err);
          }
        } else {
          if (arity == 2) {
            layer.handle(stanza, next);
          } else if (arity == 3) {
            layer.handle(stanza, response, next);
          } else {
            next();
          }
        }
      } catch (err) {
        if (err instanceof assert.AssertionError) {
          console.error(err.stack + '\n');
          next(err);
        } else {
          next(err);
        }
      }
    }
    next();
  });
  
  this._connection.on('error', function (err) {
    self.emit('error', err);
  });
};

sys.inherits(Connection, EventEmitter);


Connection.prototype.use = function(middleware) {
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(this);
  handle = middleware.apply(this, args);  
  this._stack.push({ handle: handle });

  // Allow chaining.
  return this;
}

Connection.prototype.send = function(stanza) {
  console.log('SEND: ' + stanza.root().toString());
  this._connection.send(stanza);
}

Connection.prototype._prepareResponse = function(stanza) {
  var response;
  
  if (stanza.is('iq') && (stanza.attrs.type == 'get' || stanza.attrs.type == 'set')) {
    response = new xmpp.Element('iq', { id: stanza.attrs.id,
                                        to: stanza.attrs.from,
                                        type: 'result' })
  }
  
  if (response !== undefined) {
    if (this._connection instanceof xmpp.Component) {
      response.attrs.from = stanza.attrs.to;
    }
    
    // Set up hooks for for sending the response.
    response._connection = this;
    response.send = function() {
      this._connection.send(this);
    }
  }
  
  return response;
}


module.exports = Connection;
