/**
 * Module dependencies.
 */
var fs = require('fs')
  , path = require('path')
  , xmpp = require('node-xmpp')
  , application = require('./application')
  , utils = require('./utils')
  , StanzaError = require('./stanzaerror');


// expose create() as the module
exports = module.exports = create;

/**
 * Framework version.
 */
if (require('pkginfo')) {
  require('pkginfo')(module, 'version');
}

/**
 * Create a Junction application.
 *
 * @return {Function}
 * @api public
 */
function create() {
  function app(stanza) { app.handle(stanza); }
  utils.merge(app, application);
  app._stack = [];
  app._filters = [];
  for (var i = 0; i < arguments.length; ++i) {
    app.use(arguments[i]);
  }
  return app;
}

/**
 * Expose `.create()` as module method.
 */
exports.create = create;

/**
 * Expose constructors.
 */
exports.JID = xmpp.JID;
exports.XMLElement = xmpp.Element;
exports.XMPPStanza = xmpp.Stanza;

/**
 * Expose constructors.
 */
exports.StanzaError = StanzaError;

/**
 * Auto-load bundled filters.
 */
exports.filters = {};

if (fs) {
  fs.readdirSync(__dirname + '/filters').forEach(function(filename) {
    if (/\.js$/.test(filename)) {
      var name = path.basename(filename, '.js');
      function load() { return require('./filters/' + name); }
      exports.filters.__defineGetter__(name, load);
    }
  });
}

/**
 * Auto-load bundled middleware.
 */
exports.middleware = {};

if (fs) {
  fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
    if (/\.js$/.test(filename)) {
      var name = path.basename(filename, '.js');
      function load() { return require('./middleware/' + name); }
      exports.middleware.__defineGetter__(name, load);
      exports.__defineGetter__(name, load);
    }
  });
} else {
  exports.message = require('./middleware/message');
  exports.messageParser = require('./middleware/messageParser')
  exports.presence = require('./middleware/presence');
}
