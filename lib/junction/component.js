var xmpp = require('node-xmpp');
var util = require('util');
var Client = require('./client');

function Component(options) {
  xmpp.Component.call(this, options);
  this._stack = [];
  this._filters = [];
  this.addListener('stanza', this.handle);
}

util.inherits(Component, xmpp.Component);

// mixin Client methods

Object.keys(Client.prototype).forEach(function(method){
  Component.prototype[method] = Client.prototype[method];
});


module.exports = Component;
