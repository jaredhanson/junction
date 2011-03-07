module.exports = function logger(connection, options) {
  options = options || {};
  
  var stream = options.stream || process.stdout;
  
  // TODO: Determine if there is a standard format for XMPP stanza logging.
  return function logger(stanza, next) {
    stream.write('STANZA: ' + stanza.toString() + '\n\n');
    next();
  }
}
