var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var message = require('junction/middleware/message');


vows.describe('message').addBatch({

  'middleware': {
    topic: function() {
      var self = this;
      var middleware = message(function(handler) {
        process.nextTick(function () {
          self.callback(null, middleware, handler)
        });
      });
    },
    
    'when handling a message stanza without a type': {
      topic: function(middleware, handler) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'romeo@example.net/orchard' });
        
        handler.on('normal', function(stanza) {
          self.callback(null, 'normal', stanza);
        });
        process.nextTick(function () {
          middleware(msg, function(err){});
        });
      },
      
      'should emit normal event with stanza' : function(err, event, stanza) {
        assert.equal(event, 'normal');
        assert.instanceOf(stanza, junction.XMLElement);
      },
    },
    
    'when handling a message stanza with a type': {
      topic: function(middleware, handler) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'romeo@example.net/orchard', type: 'groupchat' });
        
        handler.on('groupchat', function(stanza) {
          self.callback(null, 'groupchat', stanza);
        });
        process.nextTick(function () {
          middleware(msg, function(err){});
        });
      },
      
      'should emit groupchat event with stanza' : function(err, event, stanza) {
        assert.equal(event, 'groupchat');
        assert.instanceOf(stanza, junction.XMLElement);
      },
    },
    
    'when handling an error message stanza': {
      topic: function(middleware, handler) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'romeo@example.net/orchard', type: 'error' });
        
        handler.on('err', function(stanza) {
          self.callback(null, 'err', stanza);
        });
        process.nextTick(function () {
          middleware(msg, function(err){});
        });
      },
      
      'should emit err event with stanza' : function(err, event, stanza) {
        assert.equal(event, 'err');
        assert.instanceOf(stanza, junction.XMLElement);
      },
    },
  },
  
  'when constructed without a callback': {
    topic: function() {
      return null;
    },
    
    'should throw an error' : function(element) {
      assert.throws(function() { message(); }, Error);
    },
  },

}).export(module);
