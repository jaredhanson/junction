/**
 * Module dependencies.
 */
var xmpp = require('node-xmpp')
  , stanzaext = require('./stanza')
  , debug = require('debug')('junction');

// prototype
var app = exports = module.exports = {};


/**
 * Utilize the given middleware `fn` to the optional given `jid`.
 *
 * Examples:
 *
 *     app.use(junction.capabilitiesParser());
 *
 *     app.use('ping@xmpp.example.com', junction.ping());
 *
 * @param {String} jid
 * @param {Function} fn
 * @return {Application} for chaining
 * @api public
 */
app.use = function(jid, fn) {
  if ('string' != typeof jid) {
    fn = jid;
    jid = null;
  }
  
  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var server = fn;
    fn = function(stanza, res, next) {
      server.handle(stanza, res, next);
    };
    // also wrap sub-app filters
    this.filter(server);
  }
  
  // add the middleware
  debug('use %s %s', jid || '*', fn.name || 'anonymous');
  this._stack.push({ jid: jid, handle: fn });
  
  return this;
}

/**
 * Utilize the given filter `fn`.
 *
 * @param {Function} fn
 * @return {Application} for chaining
 * @api public
 */
app.filter = function(fn) {
  if ('function' == typeof fn.send) {
    var server = fn;
    fn = function(stanza, next) {
      server.send(stanza, next);
    };
  }
  
  debug('filter %s', fn.name || 'anonymous');
  this._filters.push({ handle: fn });
}

/**
 * Handle stanza, running it through the middleware stack.
 *
 * @api private
 */
app.handle = function(stanza, res, out) {
  var self = this
    , stack = this._stack
    , idx = 0;
  
  // `handle()` can potentially be invoked multiple times, if apps are mounted
  // as sub-apps.  However, only the outer-most app is bound to an underlying
  // XMPP connection.  It is only in this case that a response will be prepared
  // and connection-related properties set.
  if (this.connection) {
    stanza.connection = this.connection;
    res = prepareRes(stanza);
    if (res) {
      res.connection = this.connection;
      res.send = stanzaext.send;
    }
  }
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      // delegate to parent
      if (out) { return out(err); }
      
      // TODO: If this point is reached, no response (if required) will be sent
      //       the the entity.  As a corollary, serviceUnavailable and
      //       errorHandler middleware are not in use, against recommendations.
      //       At a minimum, a warning should be printed to the console, and
      //       perhaps additional handling or logging should take place.  To be
      //       investigated.
      return;
    }
    
    try {
      // TODO: check that JID matches, if specified
      
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
        } else if (arity == 3) {
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

/**
 * Send stanza, running it through the filter chain.
 *
 * @api private
 */
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
        // TODO: Implement support for filter error handling.
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

/**
 * Connect to XMPP network.
 *
 * Options (for `client` connection):
 *   - `type`      `client`
 *   - `jid`
 *   - `password`
 *   - `host`
 *   - `port`
 *
 * Examples:
 *
 *     var client = junction.connect({
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

/**
 * Setup `connection`.
 *
 * @param {Connection} connection
 * @api public
 */
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
 * Prepare a response to `stanza`.
 *
 * @api private
 */
function prepareRes(stanza) {
  var res = null;
  
  if (stanza.is('iq') && (stanza.attrs.type == 'get' || stanza.attrs.type == 'set')) {
    // TODO: When connected as a component, the from field needs to be set
    //       eplicitly (from = stanza.attrs.to).
    res = new xmpp.Stanza('iq', { id: stanza.attrs.id,
                                  to: stanza.attrs.from,
                                  type: 'result' })
  }
  // TODO: Prepare presence and message stanzas (which are optional to send)
  
  return res;
}
