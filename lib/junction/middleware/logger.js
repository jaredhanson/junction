module.exports = function logger(options) {
  options = options || {};
  
  var stream = options.stream || process.stdout;
  
  // @todo: Determine if there is a standard format for XMPP stanza logging.
  return function logger(stanza, next) {
    stream.write('RECV: ' + stanza.toString() + '\n');
    next();
  }
}
