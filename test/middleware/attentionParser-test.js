var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var Message = require('junction/elements/message');
var attentionParser = require('junction/middleware/attentionParser');


vows.describe('attentionParser').addBatch({

  'middleware': {
    topic: function() {
      return attentionParser();
    },
    
    'when handling a message stanza': {
      topic: function(attentionParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'calvin@usrobots.lit/lab',
                                                         to: 'herbie@usrobots.lit/home',
                                                       type: 'headline' });
        msg.c('attention', { xmlns: 'urn:xmpp:attention:0' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          attentionParser(msg, next)
        });
      },
      
      'should set attention property' : function(err, stanza) {
        assert.isTrue(stanza.attention);
      },
    },
    
    'when handling a message stanza without attention': {
      topic: function(attentionParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'calvin@usrobots.lit/lab',
                                                         to: 'herbie@usrobots.lit/home' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          attentionParser(msg, next)
        });
      },
      
      'should not set attention' : function(err, stanza) {
        assert.isUndefined(stanza.attention);
      },
    },
    
    'when handling a non-message stanza': {
      topic: function(attentionParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          attentionParser(iq, next)
        });
      },
      
      'should not set attention' : function(err, stanza) {
        assert.isUndefined(stanza.attention);
      },
    },
  },

}).export(module);
