var vows = require('vows');
var assert = require('assert');
var events = require('events');
var xmpp = require('node-xmpp');
var util = require('util');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var Message = require('junction/elements/message');
var Presence = require('junction/elements/presence');


vows.describe('application').addBatch({
  
  // NOTE: Disabled by default to avoid network access while running tests.
  /*
  'connect as an XMPP client': {
    topic: function() {
      return new junction.create().connect({ type: 'client', jid: 'user@invalid.host', disableStream: true });
    },
    
    'should be an instance of Client': function (c) {
      assert.instanceOf(c, xmpp.Client);
    },
  },
  */
  
  // NOTE: Disabled by default to avoid network access while running tests.
  /*
  'connect as an XMPP component': {
    topic: function() {
      return new junction.create().connect({ type: 'component', jid: 'component.invalid.host', host: 'invalid.host', port: 5060, disableStream: true });
    },
    
    'should be an instance of Component': function (c) {
      assert.instanceOf(c, xmpp.Component);
    },
  },
  */
  
  'initialization': {
    topic: function() {
      return junction();
    },
    
    'should have functions': function (app) {
      assert.isFunction(app.use);
      assert.isFunction(app.filter);
      assert.isFunction(app.handle);
      assert.isFunction(app.send);
      assert.isFunction(app.setup);
      assert.isFunction(app.connect);
    },
    'should have an empty stack': function (app) {
      assert.lengthOf(app._stack, 0);
      assert.lengthOf(app._filters, 0);
    },
  },
  
  'initialization with middleware': {
    topic: function() {
      return junction(function(stanza, next) {},
                      function(stanza, next) {});
    },
    
    'should put middleware on stack': function (app) {
      assert.lengthOf(app._stack, 2);
    },
  },
  
  'handles IQ "get" stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(req, res, next) {
        self.callback(null, req, res, next);
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq.id = '1';
        connection.emit('stanza', iq.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, req, res, next) {
      assert.isNotNull(req);
      assert.equal(req.attrs.id, 1);
      assert.equal(req.attrs.from, 'juliet@example.com');
      assert.equal(req.attrs.to, 'romeo@example.net');
      assert.equal(req.attrs.type, 'get');
      assert.instanceOf(req.connection, events.EventEmitter);  // EventEmitter is mock connection
      assert.isFunction(req.connection.send);
      
      assert.isNotNull(res);
      assert.equal(res.attrs.id, 1);
      assert.equal(res.attrs.to, 'juliet@example.com');
      assert.isUndefined(res.attrs.from);
      assert.equal(res.attrs.type, 'result');
      assert.isFunction(res.send);
      
      assert.isFunction(next);
    },
  },
  
  'handles IQ "set" stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(req, res, next) {
        self.callback(null, req, res, next);
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'set');
        iq.id = '1';
        connection.emit('stanza', iq.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, req, res, next) {
      assert.isNotNull(req);
      assert.equal(req.attrs.id, 1);
      assert.equal(req.attrs.from, 'juliet@example.com');
      assert.equal(req.attrs.to, 'romeo@example.net');
      assert.equal(req.attrs.type, 'set');
      
      assert.isNotNull(res);
      assert.equal(res.attrs.id, 1);
      assert.equal(res.attrs.to, 'juliet@example.com');
      assert.equal(res.attrs.type, 'result');
      assert.isFunction(res.send);
      
      assert.isFunction(next);
    },
  },
  
  'handles IQ "result" stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(stanza, res, next) {
        self.callback(null, stanza, res, next);
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'result');
        iq.id = '1';
        connection.emit('stanza', iq.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, stanza, res, next) {
      assert.isNotNull(stanza);
      assert.equal(stanza.attrs.id, 1);
      assert.equal(stanza.attrs.from, 'juliet@example.com');
      assert.equal(stanza.attrs.to, 'romeo@example.net');
      assert.equal(stanza.attrs.type, 'result');
      
      assert.isNull(res);
      assert.isFunction(next);
    },
  },
  
  'handles IQ "error" stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(stanza, res, next) {
        self.callback(null, stanza, res, next);
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'error');
        iq.id = '1';
        connection.emit('stanza', iq.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, stanza, res, next) {
      assert.isNotNull(stanza);
      assert.equal(stanza.attrs.id, 1);
      assert.equal(stanza.attrs.from, 'juliet@example.com');
      assert.equal(stanza.attrs.to, 'romeo@example.net');
      assert.equal(stanza.attrs.type, 'error');
      
      assert.isNull(res);
      assert.isFunction(next);
    },
  },
  
  'handles message stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(stanza, next) {
        self.callback(null, stanza, next);
      });
      process.nextTick(function () {
        var message = new Message('romeo@example.net', 'juliet@example.com', 'chat');
        connection.emit('stanza', message.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, stanza, next) {
      assert.isNotNull(stanza);
      assert.equal(stanza.attrs.from, 'juliet@example.com');
      assert.equal(stanza.attrs.to, 'romeo@example.net');
      assert.equal(stanza.attrs.type, 'chat');
      assert.instanceOf(stanza.connection, events.EventEmitter);  // EventEmitter is mock connection
      assert.isFunction(stanza.connection.send);
      
      assert.isFunction(next);
    },
  },
  
  'handles presence stanzas': {
    topic: function() {
      var self = this;
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(stanza, next) {
        self.callback(null, stanza, next);
      });
      process.nextTick(function () {
        var presence = new Presence('romeo@example.net', 'juliet@example.com', 'probe');
        connection.emit('stanza', presence.toXML());
      });
    },
    
    'should dispatch correct objects': function (err, stanza, next) {
      assert.isNotNull(stanza);
      assert.equal(stanza.attrs.from, 'juliet@example.com');
      assert.equal(stanza.attrs.to, 'romeo@example.net');
      assert.equal(stanza.attrs.type, 'probe');
      assert.instanceOf(stanza.connection, events.EventEmitter);  // EventEmitter is mock connection
      assert.isFunction(stanza.connection.send);
      
      assert.isFunction(next);
    },
  },
  
  'app with multiple middleware': {
    topic: function() {
      var self = this;      
      var connection = new events.EventEmitter();
      var app = junction();
      app.setup(connection);
      app.use(function(stanza, next) {
        stanza.call1 = true;
        next();
      });
      app.use(function(req, res, next) {
        req.call2 = true;
        self.callback(null, req, res);
        promise.emit('success');
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        connection.emit('stanza', iq.toXML());
      });
    },
    
    'should dispatch to several middleware': function (err, req, res) {
      assert.isTrue(req.call1);
      assert.isTrue(req.call2);
    },
  },
  
  /*
  
  'error handling': {
    topic: function() {
      var self = this;      
      this.calls = 0;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net', disableStream: true });
      c.use(function(stanza, next) {
        next(new Error('lame'));
      });
      c.use(function(req, res, next) {
        // should not be called
        self.calls++;
        next();
      });
      c.use(function(err, req, res, next) {
        self.calls++;
        next(err);
      });
      c.use(function(err, req, res, next) {
        self.calls++;
        promise.emit('success');
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch to error handling middleware': function (err, obj) {
      if (err) { assert.fail(err); }
      assert.equal(this.calls, 2);
    },
  },
  
  'send() with string argument': {
    topic: function() {
      var self = this;
      var mockSocket = {
        write: function(string) {
          self.callback(null, string);
        },
        writable: true
      };
      
      var c = new Client({ jid: 'romeo@example.net', disableStream: true });
      c.socket = mockSocket;
      c.send('<iq/>');
    },
    
    'should send string': function (err, output) {
      if (err) { assert.fail(err); }
      assert.equal(output, '<iq/>');
    },
  },
  
  'send() with XML element argument': {
    topic: function() {
      var self = this;
      var buffer = '';
      var mockSocket = {
        write: function(string) {
          buffer += string;
        },
        writable: true
      };
      
      var c = new Client({ jid: 'romeo@example.net', disableStream: true });
      var el = new xmpp.Element('iq', { id: '1',
                                        to: 'juliet@capulet.com/balcony',
                                        type: 'result' });
      c.socket = mockSocket;
      c.send(el);
      return buffer;
    },
    
    'should send XML element serialized as string': function (output) {
      assert.equal(output, '<iq id="1" to="juliet@capulet.com/balcony" type="result"/>');
    },
  },
  
  'send() with Junction Element argument': {
    topic: function() {
      var self = this;
      var buffer = '';
      var mockSocket = {
        write: function(string) {
          buffer += string;
        },
        writable: true
      };
      
      var c = new Client({ jid: 'romeo@example.net', disableStream: true });
      var message = new Message('juliet@example.com');
      c.socket = mockSocket;
      c.send(message);
      return buffer;
    },
    
    'should send Junction element serialized as string': function (output) {
      assert.equal(output, '<message to="juliet@example.com"/>');
    },
  },
  */
  
}).export(module);
