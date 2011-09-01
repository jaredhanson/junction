var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var delayParser = require('junction/middleware/delayParser');


vows.describe('delayParser').addBatch({

  'middleware': {
    topic: function() {
      return delayParser();
    },
    
    'when handling a message stanza with delay': {
      topic: function(delayParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'romeo@example.net/orchard' });
        msg.c('delay', { xmlns: 'urn:xmpp:delay',
                          from: 'capulet.com',
                         stamp: '2002-09-10T23:08:25Z' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          delayParser(msg, next)
        });
      },
      
      'should set sentAt property' : function(err, stanza) {
        assert.instanceOf(stanza.sentAt, Date);
        assert.equal(stanza.sentAt.toUTCString(), 'Tue, 10 Sep 2002 23:08:25 GMT');
      },
    },
    
    'when handling a message stanza without delay': {
      topic: function(delayParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'romeo@example.net/orchard' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          delayParser(msg, next)
        });
      },
      
      'should not set sentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.sentAt);
      },
    },
    
    'when handling a presence stanza with delay': {
      topic: function(delayParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        pres.c('delay', { xmlns: 'urn:xmpp:delay',
                           from: 'capulet.com',
                          stamp: '2002-09-10T23:08:25Z' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          delayParser(pres, next)
        });
      },
      
      'should set sentAt property' : function(err, stanza) {
        assert.instanceOf(stanza.sentAt, Date);
        assert.equal(stanza.sentAt.toUTCString(), 'Tue, 10 Sep 2002 23:08:25 GMT');
      },
    },
    
    'when handling a presence stanza without delay': {
      topic: function(delayParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          delayParser(pres, next)
        });
      },
      
      'should not set sentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.sentAt, Date);
      },
    },
    
    'when handling a non-message, non-presence stanza': {
      topic: function(delayParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          delayParser(iq, next)
        });
      },
      
      'should not set sentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.sentAt);
      },
    },
  },

}).export(module);
