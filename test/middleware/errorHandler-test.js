var vows = require('vows');
var assert = require('assert');
var events = require('events');
var util = require('util');
var IQ = require('junction/elements/iq');
var StanzaError = require('junction/stanzaerror');
var errorHandler = require('junction/middleware/errorHandler');


vows.describe('errorHandler').addBatch({

  'using default options': {
    topic: function() {
      return errorHandler();
    },
    
    'when handling an error': {
      topic: function(errorHandler) {
        var promise = new(events.EventEmitter);
        function next(e, rq, rs, n) {
          promise.emit('error', 'should not call next');
        }
        
        var err = new Error();
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'get').toXML();
        var res = new IQ('juliet@example.com', 'romeo@example.net', 'result').toXML();
        res.send = function() {
          promise.emit('success', res);
        }
        
        process.nextTick(function () {
          errorHandler(err, req, res, next)
        });
        return promise;
      },
      
      'should not call next' : function(err, res) {
        if (err) { assert.fail(err); }
      },
      'should be of type wait' : function(err, res) {
        var error = res.getChild('error');
        assert.equal(error.attrs.type, 'wait');
      },
      'should have an internal-server-error condition' : function(err, res) {
        var condition = res.getChild('error').children[0];
        assert.equal(condition.getName(), 'internal-server-error');
        assert.equal(condition.getNS(), 'urn:ietf:params:xml:ns:xmpp-stanzas');
      },
    },
    'when handling a stanza error': {
      topic: function(errorHandler) {
        var promise = new(events.EventEmitter);
        function next(e, rq, rs, n) {
          promise.emit('error', 'should not call next');
        }
        
        var err = new StanzaError('format your exml', 'modify', 'bad-request');
        err.specificCondition = { name: 'bar', xmlns: 'urn:foo' };
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'get').toXML();
        var res = new IQ('juliet@example.com', 'romeo@example.net', 'result').toXML();
        res.send = function() {
          promise.emit('success', res);
        }
        
        process.nextTick(function () {
          errorHandler(err, req, res, next)
        });
        return promise;
      },
      
      'should not call next' : function(err, res) {
        if (err) { assert.fail(err); }
      },
      'should use correct type' : function(err, res) {
        var error = res.getChild('error');
        assert.equal(error.attrs.type, 'modify');
      },
      'should use correct condition' : function(err, res) {
        var condition = res.getChild('error').children[0];
        assert.equal(condition.getName(), 'bad-request');
        assert.equal(condition.getNS(), 'urn:ietf:params:xml:ns:xmpp-stanzas');
      },
      'should have descriptive text' : function(err, res) {
        var text = res.getChild('error').getChild('text', 'urn:ietf:params:xml:ns:xmpp-stanzas');
        assert.equal(text.getText(), 'format your exml');
      },
      'should have specific condition' : function(err, res) {
        var condition = res.getChild('error').getChild('bar', 'urn:foo');
        assert.isObject(condition);
        assert.equal(condition.getName(), 'bar');
        assert.equal(condition.getNS(), 'urn:foo');
      },
    },
    'when no response is available': {
      topic: function(errorHandler) {
        var promise = new(events.EventEmitter);
        function next(e, rq, rs, n) {
          promise.emit('success', e);
        }
        
        var err = new StanzaError('fail');
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'get').toXML();
        
        process.nextTick(function () {
          errorHandler(err, req, null, next)
        });
        return promise;
      },
      
      'should immediately call next with an error' : function(err, res) {
        if (err) { assert.fail(err); }
        assert.isObject(res);
      }
    },
  },
  
  'using showStack option': {
    topic: function() {
      return errorHandler({ showStack: true });
    },
    
    'when handling a stanza error': {
      topic: function(errorHandler) {
        var promise = new(events.EventEmitter);
        function next(e, rq, rs, n) {
        }
        
        var err = new StanzaError('format your exml', 'modify', 'bad-request');
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'get').toXML();
        var res = new IQ('juliet@example.com', 'romeo@example.net', 'result').toXML();
        res.send = function() {
          promise.emit('success', res);
        }
        
        process.nextTick(function () {
          errorHandler(err, req, res, next)
        });
        return promise;
      },
      
      'should have descriptive text' : function(err, res) {
        var text = res.getChild('error').getChild('text', 'urn:ietf:params:xml:ns:xmpp-stanzas');
        assert.match(text.getText(), /format your exml/);
      },
      'should have stack trace' : function(err, res) {
        var text = res.getChild('error').getChild('text', 'urn:ietf:params:xml:ns:xmpp-stanzas');
        assert.match(text.getText(), /StanzaError: /);
      },
    },
  },

}).export(module);
