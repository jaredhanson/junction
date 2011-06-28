var xmpp = require('node-xmpp');
var uuid = require('node-uuid');
var util = require('util');
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

function Client(options) {
  xmpp.Client.call(this, options);
  this._stack = [];
  
  var self = this;
  
  this.addListener('stanza', function(stanza) {
    var stack = self._stack;
    var idx = 0;
    var res = self._prepResponse(stanza);
    
    // stanza is an instance of ltx.Element.  As such, it has the following
    // properties: name, parent, attrs, children.  Additional properties can
    // be assigned, as the stanza is parsed, including the inital set attached
    // here.
    stanza.id = stanza.attrs.id;
    stanza.from = stanza.attrs.from;
    stanza.to = stanza.attrs.to;
    stanza.type = stanza.attrs.type;
    
    function next(err) {
      var layer = stack[idx++];
      
      // all done
      if (!layer) { return; }
      
      try {
        var arity = layer.handle.length;
        if (err) {
          if (arity == 4) {
            layer.handle(err, stanza, res, next);
          } else {
            next(err);
          }
        } else {
          if (arity == 2) {
            layer.handle(stanza, next);
          } else if (arity == 3 && res) {
            layer.handle(stanza, res, next);
          } else {
            next();
          }
        }
      } catch (e) {
        if (e instanceof assert.AssertionError) {
          console.error(e.stack + '\n');
          next(e);
        } else {
          // @todo: In development mode, the process should be halted when a
          //        a failure occurs.  Otherwise, errors such as syntax errors
          //        are silently discarded, making debugging difficult.
          console.error(e.stack + '\n');
          next(e);
        }
      }
    }
    next();
  });
}

util.inherits(Client, xmpp.Client);

Client.prototype.use = function(ns, handle) {
  // @todo: Allow ns to be set as an XPath expression, in order to limit the
  //        scope of the handler.
  if ('string' != typeof ns) {
    handle = ns;
    ns = null;
  }
    
  this._stack.push({ ns: ns, handle: handle });
  return this;
}

Client.prototype.send = function(stanza) {
  if (stanza.root) {
      console.log('SEND: ' + stanza.root().toString() + '\n');
  } else {
      console.log('SEND: ' + stanza + '\n');
  }
  xmpp.Client.prototype.send.call(this, stanza);
}

Client.prototype.generateID = function() {
  return uuid();
}

Client.prototype._prepResponse = function(stanza) {
  var self = this;
  
  var res;
  
  if (stanza.is('iq') && (stanza.attrs.type == 'get' || stanza.attrs.type == 'set')) {
    // @todo: When connected as a component, the from field needs to be set
    //        eplicitly (response.attrs.from = stanza.attrs.to).
    res = new xmpp.Element('iq', { id: stanza.attrs.id,
                                   to: stanza.attrs.from,
                                   type: 'result' })
  }
  
  if (res) {
    // Hook for for sending the response.
    res.send = function() {
      self.send(this);
    }
  }
  return res;
}


module.exports = Client;
