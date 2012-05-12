var vows = require('vows');
var assert = require('assert');
var events = require('events');
var util = require('util');
var IQ = require('junction/elements/iq');
var serviceUnavailable = require('junction/middleware/serviceUnavailable');


vows.describe('serviceUnavailable').addBatch({

  'middleware': {
    topic: function() {
      return serviceUnavailable();
    },
    
    'when handling an IQ request': {
      topic: function(serviceUnavailable) {
        var promise = new(events.EventEmitter);
        function next(rq, rs, n) {
          promise.emit('error', 'should not call next');
        }
        
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'get').toXML();
        var res = new IQ('juliet@example.com', 'romeo@example.net', 'result').toXML();
        res.send = function() {
          promise.emit('success', res);
        }
        
        process.nextTick(function () {
          serviceUnavailable(req, res, next)
        });
        return promise;
      },
      
      'should not call next' : function(err, res) {
        if (err) { assert.fail(err); }
      },
      'should be stanza of type error' : function(err, res) {
        assert.equal(res.attrs.type, 'error');
      },
      'should have error of type cancel' : function(err, res) {
        var error = res.getChild('error');
        assert.equal(error.attrs.type, 'cancel');
      },
      'should have a service-unavailable condition' : function(err, res) {
        var condition = res.getChild('error').children[0];
        assert.equal(condition.getName(), 'service-unavailable');
        assert.equal(condition.getNS(), 'urn:ietf:params:xml:ns:xmpp-stanzas');
      },
    },
    
    'when handling an IQ result': {
      topic: function(serviceUnavailable) {
        var promise = new(events.EventEmitter);
        function next(rq, rs, n) {
          promise.emit('success', rs);
        }
        
        var req = new IQ('romeo@example.net', 'juliet@example.com', 'result').toXML();
        req.type = 'result';
        var res = new IQ('juliet@example.com', 'romeo@example.net', 'result').toXML();
        res.send = function() {
          promise.emit('error', 'should not call send');
        }
        
        process.nextTick(function () {
          serviceUnavailable(req, res, next)
        });
        return promise;
      },
      
      'should not call send' : function(err, res) {
        if (err) { assert.fail(err); }
      },
    },
  },

}).export(module);
