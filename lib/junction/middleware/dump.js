/**
 * Dump incoming stanzas to the console.
 *
 * This middleware prints XML stanzas to the console.  This is useful to inspect
 * stanzas as they are received off the wire, and aids in debugging.  It is not
 * recommended to use this middleware in a production environment.
 *
 * Examples:
 *
 *      app.use(junction.dump());
 *
 *      app.use(junction.dump({ prefix: 'RECV: ' }));
 *
 * @param {Object} options
 * @return {Function}
 * @api public
 */

module.exports = function dump(options) {
  options = options || {};
  var prefix = options.prefix || '';
  
  return function dump(stanza, next) {
    console.log(prefix + stanza + '\n');
    next();
  }
}
