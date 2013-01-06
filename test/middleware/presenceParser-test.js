var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var presenceParser = require('junction/middleware/presenceParser');


vows.describe('presenceParser').addBatch({

  'middleware': {
    topic: function() {
      return presenceParser();
    },
    
    'when handling a presence stanza': {
      topic: function(presenceParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        pres.c('show').t('dnd').up().c('status').t('Wooing Juliet').up().c('priority').t('1');
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          presenceParser(pres, next)
        });
      },
      
      'should set show property' : function(err, stanza) {
        assert.equal(stanza.show, 'dnd');
      },
      'should set status property' : function(err, stanza) {
        assert.equal(stanza.status, 'Wooing Juliet');
      },
      'should set priority property' : function(err, stanza) {
        assert.isNumber(stanza.priority);
        assert.equal(stanza.priority, 1);
      },
    },
    
    'when handling a presence stanza without a show element': {
      topic: function(presenceParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          presenceParser(pres, next)
        });
      },
      
      'should set show property to online' : function(err, stanza) {
        assert.equal(stanza.show, 'online');
      },
    },
    
    'when handling a presence stanza with a negative priority element': {
      topic: function(presenceParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        pres.c('priority').t('-5');
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          presenceParser(pres, next)
        });
      },
      
      'should set priority property to -5' : function(err, stanza) {
        assert.isNumber(stanza.priority);
        assert.equal(stanza.priority, -5);
      },
    },
    
    'when handling a presence stanza without a priority element': {
      topic: function(presenceParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          presenceParser(pres, next)
        });
      },
      
      'should set priority property to 0' : function(err, stanza) {
        assert.isNumber(stanza.priority);
        assert.equal(stanza.priority, 0);
      },
    },
    
    'when handling a non-presence stanza': {
      topic: function(xParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          xParser(iq, next)
        });
      },
      
      'should not set show property' : function(err, stanza) {
        assert.isUndefined(stanza.show);
      },
      'should not set status property' : function(err, stanza) {
        assert.isUndefined(stanza.status);
      },
      'should not set priority property' : function(err, stanza) {
        assert.isUndefined(stanza.priority);
      },
    },
  },

}).export(module);
