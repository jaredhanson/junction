module.exports = function dump(options) {
  options = options || {};
  var prefix = options.prefix || '';
  
  return function dump(stanza, next) {
    console.log(prefix + stanza + '\n');
    next();
  }
}
