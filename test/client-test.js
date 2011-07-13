var vows = require('vows');
var assert = require('assert');
var events = require('events');
var util = require('util');
var Client = require('junction/client');
var IQ = require('junction/elements/iq');
var Message = require('junction/elements/message');
var Presence = require('junction/elements/presence');


vows.describe('Client').addBatch({
  
  'initialization': {
    topic: function() {
      return new Client({ jid: 'romeo@example.net' });
    },
    
    'should have an empty stack': function (c) {
      assert.length(c._stack, 0);
    },
  },
  
  'handles IQ "get" stanzas': {
    topic: function() {
      var self = this;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('success', {req: req, res: res, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq.id = '1';
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      var req = obj.req;
      var res = obj.res;
      var next = obj.next;
      
      assert.isNotNull(req);
      assert.instanceOf(req.connection, Client);
      assert.equal(req.id, 1);
      assert.equal(req.from, 'juliet@example.com');
      assert.equal(req.to, 'romeo@example.net');
      assert.equal(req.type, 'get');
      
      assert.isNotNull(res);
      assert.equal(res.attrs.id, 1);
      assert.equal(res.attrs.to, 'juliet@example.com');
      assert.equal(res.attrs.type, 'result');
      assert.isFunction(res.send);
      
      assert.isFunction(next);
    },
  },
  
  'handles IQ "set" stanzas': {
    topic: function() {
      var self = this;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('success', {req: req, res: res, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'set');
        iq.id = '1';
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      var req = obj.req;
      var res = obj.res;
      var next = obj.next;
      
      assert.isNotNull(req);
      assert.instanceOf(req.connection, Client);
      assert.equal(req.id, 1);
      assert.equal(req.from, 'juliet@example.com');
      assert.equal(req.to, 'romeo@example.net');
      assert.equal(req.type, 'set');
      
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
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('error', 'should not dispatch IQ result stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'result');
        iq.id = '1';
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
      assert.instanceOf(stanza.connection, Client);
      assert.equal(stanza.id, 1);
      assert.equal(stanza.from, 'juliet@example.com');
      assert.equal(stanza.to, 'romeo@example.net');
      assert.equal(stanza.type, 'result');
      
      assert.isFunction(next);
    },
  },
  
  'handles IQ "error" stanzas': {
    topic: function() {
      var self = this;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('error', 'should not dispatch IQ error stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'error');
        iq.id = '1';
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
      assert.instanceOf(stanza.connection, Client);
      assert.equal(stanza.id, 1);
      assert.equal(stanza.from, 'juliet@example.com');
      assert.equal(stanza.to, 'romeo@example.net');
      assert.equal(stanza.type, 'error');
      
      assert.isFunction(next);
    },
  },
  
  'handles message stanzas': {
    topic: function() {
      var self = this;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('error', 'should not dispatch message stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var message = new Message('romeo@example.net', 'juliet@example.com', 'chat');
        c.emit('stanza', message.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
      assert.instanceOf(stanza.connection, Client);
      assert.equal(stanza.from, 'juliet@example.com');
      assert.equal(stanza.to, 'romeo@example.net');
      assert.equal(stanza.type, 'chat');
      
      assert.isFunction(next);
    },
  },
  
  'handles presence stanzas': {
    topic: function() {
      var self = this;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(req, res, next) {
        promise.emit('error', 'should not dispatch presence stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var presence = new Presence('romeo@example.net', 'juliet@example.com', 'probe');
        c.emit('stanza', presence.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
      assert.instanceOf(stanza.connection, Client);
      assert.equal(stanza.from, 'juliet@example.com');
      assert.equal(stanza.to, 'romeo@example.net');
      assert.equal(stanza.type, 'probe');
      
      assert.isFunction(next);
    },
  },
  
  'use() several': {
    topic: function() {
      var self = this;      
      this.calls = 0;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
      c.use(function(stanza, next) {
        self.calls++;
        next();
      });
      c.use(function(req, res, next) {
        self.calls++;
        promise.emit('success');
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch to several middleware': function (err, obj) {
      if (err) { assert.fail(err); }
      assert.equal(this.calls, 2);
    },
  },
  
  'error handling': {
    topic: function() {
      var self = this;      
      this.calls = 0;
      var promise = new(events.EventEmitter);
      var c = new Client({ jid: 'romeo@example.net' });
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
  
}).export(module);
