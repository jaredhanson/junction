require.paths.unshift('../lib')
var inflect = require('inflect');

var options = {
  type: 'client',
  jid: 'user@example.com',
  password: 'secret',
  host: 'example.com',
  port: 5222
};

var connection = inflect.createConnection(options);
connection.use(inflect.logger());
connection.use(inflect.serviceDiscovery([ { category: 'client', type: 'bot' } ],
                                        ['http://jabber.org/protocol/disco#info']));
connection.use(inflect.serviceUnavailable());
connection.use(inflect.errorHandler());

connection.on('online', function() {
  console.log('ONLINE!');
  connection.send(new inflect.Element('presence'));
});

connection.on('error', function(err) {
  console.log('ERROR: ' + err);
});
