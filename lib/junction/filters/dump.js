/**
 * Dump outgoing stanzas to the console.
 *
 * This filter prints XML stanzas to the console.  This is useful to inspect
 * stanzas as they are transmitted on the wire, and aids in debugging.  It is
 * not recommended to use this filter in a production environment.
 *
 * Examples:
 *
 *      app.use(junction.filters.dump());
 *
 *      app.use(junction.filters.dump({ prefix: 'XMIT: ' }));
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
