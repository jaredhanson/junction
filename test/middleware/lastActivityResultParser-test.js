var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var lastActivityResultParser = require('junction/middleware/lastActivityResultParser');


vows.describe('lastActivityResultParser').addBatch({

  'middleware': {
    topic: function() {
      return lastActivityResultParser();
    },
    
    'when handling an activity result': {
      topic: function(lastActivityResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com', 'result');
        res.id = 'last1';
        res.c('query', { xmlns: 'jabber:iq:last', seconds: 903 }).t('Heading Home');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          lastActivityResultParser(res, next)
        });
      },
      
      'should set lastActivity property' : function(err, stanza) {
        assert.isNumber(stanza.lastActivity);
        assert.equal(stanza.lastActivity, 903);
      },
      'should set lastStatus property' : function(err, stanza) {
        assert.equal(stanza.lastStatus, 'Heading Home');
      },
    },
    
    'when handling an IQ stanza that is not an activity result': {
      topic: function(lastActivityResultParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          lastActivityResultParser(iq, next)
        });
      },
      
      'should not set lastActivity property' : function(err, stanza) {
        assert.isUndefined(stanza.lastActivity);
      },
      'should not set lastStatus property' : function(err, stanza) {
        assert.isUndefined(stanza.lastStatus);
      },
    },
  },

}).export(module);
