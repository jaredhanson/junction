/**
 * Module dependencies.
 */
var fs = require('fs')
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
 * Expose bundled filters.
 */

exports.filters = {};
exports.filters.pending = require('./filters/pending');
exports.filters.dump = require('./filters/dump');


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
