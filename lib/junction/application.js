var xmpp = require('node-xmpp')
  , assert = require('assert')
  , debug = require('debug')('junction');

var app = exports = module.exports = {};


app.use = function(jid, fn) {
  if ('string' != typeof jid) {
    fn = jid;
    jid = null;
  }
  
  // TODO: Implement test cases for this functionality
  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var server = fn;
    fn = function(stanza, next) {
      server.handle(stanza, next);
    };
  }
  
  // add the middleware
  debug('use %s %s', jid || '*', fn.name || 'anonymous');
  this._stack.push({ jid: jid, handle: fn });
  
  return this;
}

app.filter = function(fn) {
  // TODO: Properly filter through sub-apps
  debug('filter %s', fn.name || 'anonymous');
  this._filters.push({ handle: fn });
}

app.handle = function(stanza, out) {
  var self = this
    , res = prepareRes(stanza)
    , stack = this._stack
    , idx = 0;
  
  // TODO: Only prepare the response in parent-most app
  
  if (res) {
    res.send = function() {
      self.connection.send(this);
    }
  }
  
  // TODO: Only set connection in parent-most app
  stanza.connection = this.connection;
  stanza.id = stanza.attrs.id;
  stanza.to = new xmpp.JID(stanza.attrs.to);
  stanza.from = new xmpp.JID(stanza.attrs.from);
  stanza.type = stanza.attrs.type;
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      // delegate to parent
      if (out) { return out(err); }
      
      // TODO: Handle unhandled errors or send responses when necessary.
      
      return;
    }
    
    try {
      // TODO: Check that JID matches, if specified
      
      debug('%s', layer.handle.name || 'anonymous');
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
      next(e);
    }
  }
  next();
};

app.send = function(stanza, out) {
  var self = this
    , stack = this._filters
    , idx = 0;
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      // delegate to parent
      if (out) { return out(err); }
      
      if (err) {
        // TODO: Handle unhandled errors
      } else {
        self.connection.send_.call(self.connection, stanza);
      }
      return;
    }
    
    try {
      debug('filter:%s', layer.handle.name || 'anonymous');
      var arity = layer.handle.length;
      if (err) {
        if (arity == 3) {
          layer.handle(err, stanza, next);
        } else {
          next(err);
        }
      } else if (arity < 3) {
        layer.handle(stanza, next);
      } else {
        next();
      }
    } catch (e) {
      next(e);
    }
  }
  next();
}

app.setup = function(connection) {
  this.connection = connection;
  this.connection.send_ = connection.send;
  connection.on('stanza', this.handle.bind(this));
  
  var self = this;
  connection.send = function(stanza) {
    if ('string' == typeof stanza) {
      // raw strings bypass the filter mechanism
      self.connection.send_.call(self.connection, stanza);
      return;
    }
    
    // convert junction.Element to ltx.Element
    if (stanza.toXML) {
      stanza = stanza.toXML();
    }
    
    self.send.call(self, stanza);
  }
}

/**
 * Create a new Junction connection.
 *
 * Options:
 *   - `jid`            JID
 *   - `password`       Password, for authentication
 *   - `host`
 *   - `port`
 *   - `type`           Type of connection, see below for types
 *   - `disableStream`  Disable underlying stream, defaults to _false_
 *
 * Connection Types:
 *   - `client`     XMPP client connection
 *   - `component`  XMPP component connection
 *
 * Examples:
 *
 *     var client = junction.createConnection({
 *       type: 'client',
 *       jid: 'user@example.com',
 *       password: 'secret',
 *       host: 'example.com',
 *       port: 5222
 *     });
 *
 * @param {Object} options
 * @return {Connection}
 * @api public
 */

app.connect = function(options) {
  var connection;
  if (options.type == 'component') {
    connection = new xmpp.Component(options);
  } else {
    connection = new xmpp.Client(options);
  }
  
  this.setup(connection);
  return connection;
}


function prepareRes(stanza) {
  var res = null;
  
  if (stanza.is('iq') && (stanza.attrs.type == 'get' || stanza.attrs.type == 'set')) {
    // TODO: When connected as a component, the from field needs to be set
    //       eplicitly (from = stanza.attrs.to).
    res = new xmpp.Element('iq', { id: stanza.attrs.id,
                                   to: stanza.attrs.from,
                                   type: 'result' })
  }
  // TODO: Prepare presence and message stanzas (which are optional to send)
  
  return res;
}
