var vows = require('vows');
var assert = require('assert');
var events = require('events');
var util = require('util');
var Client = require('junction/client');
var IQ = require('junction/elements/iq');


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
        iq.id = '1'
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      var req = obj.req;
      var res = obj.res;
      var next = obj.next;
      
      assert.isNotNull(req);
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
        iq.id = '1'
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      var req = obj.req;
      var res = obj.res;
      var next = obj.next;
      
      assert.isNotNull(req);
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
        promise.emit('error', 'should not dispatch response stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'result');
        iq.id = '1'
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
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
        promise.emit('error', 'should not dispatch response stanza with request-response semantics');
      });
      c.use(function(stanza, next) {
        promise.emit('success', {stanza: stanza, next: next});
      });
      process.nextTick(function () {
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'error');
        iq.id = '1'
        c.emit('stanza', iq.toXML());
      });
      return promise;
    },
    
    'should dispatch correct objects': function (err, obj) {
      if (err) { assert.fail(err); }
      
      var stanza = obj.stanza;
      var next = obj.next;
      
      assert.isNotNull(stanza);
      assert.equal(stanza.id, 1);
      assert.equal(stanza.from, 'juliet@example.com');
      assert.equal(stanza.to, 'romeo@example.net');
      assert.equal(stanza.type, 'error');
      
      assert.isFunction(next);
    },
  },
  
}).export(module);
