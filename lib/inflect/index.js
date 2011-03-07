var fs = require('fs');
var Connection = require('./connection');

exports.createConnection = function (options) {
  return new Connection(options);
};


exports.middleware = {};

fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
  if (/\.js$/.test(filename)) {
    var name = filename.substr(0, filename.lastIndexOf('.'));
    
    Object.defineProperty(exports.middleware, name, { get: function() {
      return require('./middleware/' + name);
    }});
  }
});

exports.__proto__ = exports.middleware;
