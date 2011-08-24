var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var Presence = require('junction/elements/presence');
var presence = require('junction/middleware/presence');


vows.describe('presence').addBatch({

  'middleware': {
    topic: function() {
      var self = this;
      var middleware = presence(function(handler) {
        process.nextTick(function () {
          self.callback(null, middleware, handler)
        });
      });
    },
    
    'when handling a presence stanza without a type': {
      topic: function(middleware, handler) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        
        handler.on('available', function(stanza) {
          self.callback(null, 'available', stanza);
        });
        process.nextTick(function () {
          middleware(pres, function(err){});
        });
      },
      
      'should emit available event with stanza' : function(err, event, stanza) {
        assert.equal(event, 'available');
        assert.instanceOf(stanza, junction.XMLElement);
      },
    },
    
    'when handling a presence stanza with a type': {
      topic: function(middleware, handler) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard', type: 'unavailable' });
        
        handler.on('unavailable', function(stanza) {
          self.callback(null, 'unavailable', stanza);
        });
        process.nextTick(function () {
          middleware(pres, function(err){});
        });
      },
      
      'should emit unavailable event with stanza' : function(err, event, stanza) {
        assert.equal(event, 'unavailable');
        assert.instanceOf(stanza, junction.XMLElement);
      },
    },
    
    'when handling an error presence stanza': {
      topic: function(middleware, handler) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard', type: 'error' });
        
        handler.on('err', function(stanza) {
          self.callback(null, 'err', stanza);
        });
        process.nextTick(function () {
          middleware(pres, function(err){});
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
      assert.throws(function() { presence(); }, Error);
    },
  },

}).export(module);
