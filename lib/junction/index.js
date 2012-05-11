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
require('pkginfo')(module, 'version');

/**
 * Create a new Junction application.
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
create.create = create;

/**
 * Expose constructors.
 */
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
 * Auto-load bundled filters.
 */
exports.filters = {};

fs.readdirSync(__dirname + '/filters').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = path.basename(filename, '.js');
    function load() { return require('./filters/' + name); }
    exports.filters.__defineGetter__(name, load);
  }
});

/**
 * Auto-load bundled middleware.
 */
exports.middleware = {};

fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = path.basename(filename, '.js');
    function load() { return require('./middleware/' + name); }
    exports.middleware.__defineGetter__(name, load);
    exports.__defineGetter__(name, load);
  }
});
