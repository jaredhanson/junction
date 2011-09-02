var vows = require('vows');
var assert = require('assert');
var util = require('util');
var xmpp = require('node-xmpp');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var nicknameParser = require('junction/middleware/nicknameParser');


vows.describe('nicknameParser').addBatch({

  'middleware': {
    topic: function() {
      return nicknameParser();
    },
    
    'when handling a message stanza with a nickname': {
      topic: function(nicknameParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'narrator@moby-dick.lit/pda' });
        msg.c('nick', { xmlns: 'http://jabber.org/protocol/nick' }).t('Ishmael');
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          nicknameParser(msg, next)
        });
      },
      
      'should set nickname property' : function(err, stanza) {
        assert.equal(stanza.nickname, 'Ishmael');
      },
    },
    
    'when handling a message stanza without a nickname': {
      topic: function(nicknameParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'narrator@moby-dick.lit/pda' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          nicknameParser(msg, next)
        });
      },
      
      'should not set nickname property' : function(err, stanza) {
        assert.isUndefined(stanza.nickname);
      },
    },
    
    'when handling a presence stanza with a nickname': {
      topic: function(nicknameParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'narrator@moby-dick.lit' });
        pres.c('nick', { xmlns: 'http://jabber.org/protocol/nick' }).t('Ishmael');
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          nicknameParser(pres, next)
        });
      },
      
      'should set nickname property' : function(err, stanza) {
        assert.equal(stanza.nickname, 'Ishmael');
      },
    },
    
    'when handling a presence stanza without a nickname': {
      topic: function(nicknameParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'narrator@moby-dick.lit' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          nicknameParser(pres, next)
        });
      },
      
      'should not set nickname property' : function(err, stanza) {
        assert.isUndefined(stanza.nickname);
      },
    },
    
    'when handling a non-message, non-presence stanza': {
      topic: function(nicknameParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          nicknameParser(iq, next)
        });
      },
      
      'should not set nickname property' : function(err, stanza) {
        assert.isUndefined(stanza.nickname);
      },
    },
  },

}).export(module);
