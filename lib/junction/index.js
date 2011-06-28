var fs = require('fs');
var xmpp = require('node-xmpp');
var Client = require('./client');
var StanzaError = require('./stanzaerror');

exports.createConnection = function (options) {
  // @todo: Implement support for component connections.
  return new Client(options);
};

exports.Client = Client;
exports.StanzaError = StanzaError;
exports.XMLElement = xmpp.Element;

exports.elements = {};
exports.elements.Element = require('./elements/element');
exports.elements.IQ = require('./elements/iq');


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
