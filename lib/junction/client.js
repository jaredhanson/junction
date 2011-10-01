/**
 * Module dependencies.
 */
var xmpp = require('node-xmpp')
  , uuid = require('node-uuid')
  , util = require('util')
  , assert = require('assert')
  , NullStream = require('./nullstream');


/**
 * Initialize a new `Client`.
 *
 * @param {Object} options
 */
function Client(options) {
  options = options || {}
  // WORKAROUND: Disable socket streams in underlying node-xmpp, useful in cases
  //             where one is not necessary (such as mounted connections or
  //             tests).
  this._disableStream = options.disableStream || false;
  
  xmpp.Client.call(this, options);
  this._stack = [];
  this._filters = [];
  this.addListener('stanza', this.handle);
}

/**
 * Inherit from `xmpp.Client`.
 */
util.inherits(Client, xmpp.Client);

/**
 * Utilize the given middleware `handle`.
 *
 * @param {Function} handle
 * @return {Connection} for chaining
 */
 
Client.prototype.use = function(ns, handle) {
  // TODO: Allow ns to be set as an XPath expression, in order to limit the
  //       scope of the handler.
  // TODO: Alternatively, let the qualifier be the JID to which the stanza is
  //       addressed.  This would be beneficial for components that handle a
  //       domain, but want to be addressed using node@domain.  I'm leaning in
  //       favor of this approach, rather than the XPath one.
  if ('string' != typeof ns) {
    handle = ns;
    ns = null;
  }
  
  // wrap sub-apps
  // TODO: Implement test cases for this functionality
  if ('function' == typeof handle.handle) {
    var connection = handle;
    connection.send = this.send.bind(this);
    connection.generateID = this.generateID.bind(this);
    handle = function(stanza, next){
      connection.handle(stanza, next);
    };
  }
  
  this._stack.push({ ns: ns, handle: handle });
  return this;
}

/**
 * Utilize the given filter `handle`.
 *
 * @param {Function} handle
 * @return {Connection} for chaining
 */
 
Client.prototype.filter = function(handle) {
  this._filters.push({ handle: handle });
  return this;
}

/**
 * Handle stanza, running it through the middleware stack.
 *
 * @api private
 */

Client.prototype.handle = function(stanza, out) {
  var self = this;
  var stack = self._stack;
  var idx = 0;
  var res = self._prepResponse(stanza);
  
  // stanza is an instance of ltx.Element.  As such, it has the following
  // properties: name, parent, attrs, children.  Additional properties can
  // be assigned, as the stanza is parsed, including the initial set attached
  // here.
  stanza.connection = stanza.connection || this;
  stanza.id = stanza.attrs.id;
  stanza.from = new xmpp.JID(stanza.attrs.from);
  stanza.to = new xmpp.JID(stanza.attrs.to);
  stanza.type = stanza.attrs.type;
  
  function next(err) {
    var layer = stack[idx++];
    
    // all done
    if (!layer) {
      // but wait! we have a parent
      if (out) { return out(err); }
      return;
    }
    
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
        next(e);
      }
    }
  }
  next();
}

/**
 * Send stanza, running it through the filter chain.
 *
 * @param {Element|XMLElement} stanza
 */

Client.prototype.send = function(stanza) {
  if (stanza.toXML) {
    stanza = stanza.toXML();
  }
  
  // TODO: Implement a filter for logging outgoing stanzas.
  /*
  if (stanza.root) {
      console.log('SEND: ' + stanza.root().toString() + '\n');
  } else {
      console.log('SEND: ' + stanza + '\n');
  }
  */
  
  var filters = this._filters;
  var idx = 0;
  function next() {
    var filter = filters[idx++];
    
    // all done
    if (!filter) { return; }
    
    // TODO: Implement error handling
    try {
      filter.handle(stanza, next);
    } catch (e) {
      if (e instanceof assert.AssertionError) {
        console.error(e.stack + '\n');
        next();
      } else {
        console.error(e.stack + '\n');
        next();
      }
    }
  }
  if (stanza instanceof xmpp.Element) { next(); }
  
  xmpp.Client.prototype.send.call(this, stanza);
}

/**
 * Override xmpp.Connection's setupStream(), substituting a NullStream for the
 * socket property, if disableStream option is set.
 *
 * @api private
 */
Client.prototype.setupStream = function() {
  if (this._disableStream) {
    this.socket = new NullStream();
    return;
  }
  xmpp.Client.prototype.setupStream.call(this);
}

/**
 * Generate a unique identifier, for use in a stanza's `id` attribute.
 *
 * @return {String}
 */
Client.prototype.generateID = function() {
  return uuid();
}

/**
 * Prepare a response to `stanza`.
 *
 * @api private
 */
Client.prototype._prepResponse = function(stanza) {
  var self = this;
  
  var res;
  
  if (stanza.is('iq') && (stanza.attrs.type == 'get' || stanza.attrs.type == 'set')) {
    // TODO: When connected as a component, the from field needs to be set
    //       eplicitly (from = stanza.attrs.to).
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


/**
 * Expose `Client`.
 */
 
module.exports = Client;
