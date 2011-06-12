require.paths.unshift('../lib')
var junction = require('junction');

var options = {
  type: 'client',
  jid: 'user@example.com',
  password: 'secret',
  host: 'example.com',
  port: 5222
};

var connection = junction.createConnection(options);
connection.use(junction.logger());
connection.use(junction.serviceDiscovery([ { category: 'client', type: 'bot' } ],
                                        ['http://jabber.org/protocol/disco#info']));
connection.use(junction.serviceUnavailable());
connection.use(junction.errorHandler());

connection.on('online', function() {
  console.log('ONLINE!');
  connection.send(new junction.Element('presence'));
});

connection.on('error', function(err) {
  console.log('ERROR: ' + err);
});
