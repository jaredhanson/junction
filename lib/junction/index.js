/**
 * Module dependencies.
 */

var fs = require('fs')
  , xmpp = require('node-xmpp')
  , Client = require('./client')
  , Component = require('./component')
  , StanzaError = require('./stanzaerror');

/**
 * Framework version.
 */

exports.version = '0.1.3';


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

exports.createConnection = function (options) {
  if (options.type == 'component') {
    return new Component(options);
  }
  return new Client(options);
};


/**
 * Expose constructors.
 */

exports.Client = Client;
exports.Component = Component;
exports.JID = xmpp.JID;
exports.XMLElement = xmpp.Element;
exports.StanzaError = StanzaError;

/**
 * Expose element constructors.
 */

exports.elements = {};
exports.elements.Element = require('./elements/element');
exports.elements.IQ = require('./elements/iq');
exports.elements.Message = require('./elements/message');
exports.elements.Presence = require('./elements/presence');

/**
 * Expose bundled filters.
 */

exports.filters = {};
exports.filters.pending = require('./filters/pending');


/**
 * Auto-load bundled middleware.
 */

exports.middleware = {};

fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = filename.substr(0, filename.lastIndexOf('.'));
    exports.middleware.__defineGetter__(name, function(){
      return require('./middleware/' + name);
    });
  }
});

/**
 * Expose middleware as first-class exports.
 */

exports.__proto__ = exports.middleware;
