/**
 * Module dependencies.
 */
var xmpp = require('node-xmpp')
  , util = require('util')
  , Client = require('./client');


/**
 * Initialize a new `Component`.
 *
 * @param {Object} options
 */
function Component(options) {
  options = options || {}
  // WORKAROUND: Disable socket streams in underlying node-xmpp, useful in cases
  //             where one is not necessary.  See Client.prototype.setupStream
  //             for implementation.
  this._disableStream = options.disableStream || false;
  
  xmpp.Component.call(this, options);
  this._stack = [];
  this._filters = [];
  this.addListener('stanza', this.handle);
}

/**
 * Inherit from `xmpp.Component`.
 */
util.inherits(Component, xmpp.Component);

/**
 * Mixin Client methods.
 */
 
Object.keys(Client.prototype).forEach(function(method){
  Component.prototype[method] = Client.prototype[method];
});


/**
 * Expose `Component`.
 */

module.exports = Component;
