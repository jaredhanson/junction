var fs = require('fs');
var xmpp = require('node-xmpp');
var Client = require('./client');
var Component = require('./component');
var StanzaError = require('./stanzaerror');

exports.createConnection = function (options) {
  if (options.type == 'component') {
    return new Component(options);
  }
  return new Client(options);
};

exports.Client = Client;
exports.Component = Component;
exports.StanzaError = StanzaError;
exports.JID = xmpp.JID;
exports.XMLElement = xmpp.Element;

exports.elements = {};
exports.elements.Element = require('./elements/element');
exports.elements.IQ = require('./elements/iq');
exports.elements.Message = require('./elements/message');
exports.elements.Presence = require('./elements/presence');

exports.filters = {};
exports.filters.pending = require('./filters/pending');


exports.middleware = {};

fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = filename.substr(0, filename.lastIndexOf('.'));
    exports.middleware.__defineGetter__(name, function(){
      return require('./middleware/' + name);
    });
  }
});

exports.__proto__ = exports.middleware;
