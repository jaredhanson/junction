var junction = require('junction')
  , Message = junction.elements.Message
  , argv = require('optimist').argv;

var options = {
  type: 'client',
  jid: argv.i,
  password: argv.P
};

var app = junction.create();

app.use(junction.presence(function(handler) {
  handler.on('available', function(stanza) {
    console.log(stanza.from + ' is available');
  });
  handler.on('unavailable', function(stanza) {
    console.log(stanza.from + ' is unavailable');
  });
}));

app.use(junction.messageParser());
app.use(junction.message(function(handler) {
  handler.on('chat', function(stanza) {
    var msg = new Message(stanza.from);
    msg.c('body', {}).t('Hello ' + stanza.from + '!\n\n' + 'You said: ' + stanza.body);
    stanza.connection.send(msg);
  });
}));

app.use(junction.serviceUnavailable());
app.use(junction.errorHandler());

app.connect(options).on('online', function() {
  console.log('Connected as: ' + this.jid);
  this.send(new junction.elements.Presence());
});
