var vows = require('vows');
var assert = require('assert');
var util = require('util');
var xmpp = require('node-xmpp');
var junction = require('junction');
var IQ = require('junction/elements/iq');
var legacyDelayParser = require('junction/middleware/legacyDelayParser');


vows.describe('legacyDelayParser').addBatch({

  'middleware': {
    topic: function() {
      return legacyDelayParser();
    },
    
    'when handling a message stanza with delay': {
      topic: function(legacyDelayParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'coven@macbeth.shakespeare.lit/secondwitch' });
        msg.c('x', { xmlns: 'jabber:x:delay',
                      from: 'coven@macbeth.shakespeare.lit',
                     stamp: '20020910T23:05:37' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          legacyDelayParser(msg, next)
        });
      },
      
      'should set delayedBy property' : function(err, stanza) {
        assert.instanceOf(stanza.delayedBy, xmpp.JID);
        assert.equal(stanza.delayedBy, 'coven@macbeth.shakespeare.lit');
      },
      'should set originallySentAt property' : function(err, stanza) {
        assert.instanceOf(stanza.originallySentAt, Date);
        assert.equal(stanza.originallySentAt.toUTCString(), 'Tue, 10 Sep 2002 23:05:37 GMT');
      },
    },
    
    'when handling a message stanza without delay': {
      topic: function(legacyDelayParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'coven@macbeth.shakespeare.lit/secondwitch' });
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          legacyDelayParser(msg, next)
        });
      },
      
      'should not set delayedBy property' : function(err, stanza) {
        assert.isUndefined(stanza.delayedBy);
      },
      'should not set originallySentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.originallySentAt);
      },
    },
    
    'when handling a presence stanza with delay': {
      topic: function(legacyDelayParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'juliet@capulet.com/balcony' });
        pres.c('x', { xmlns: 'jabber:x:delay',
                       from: 'juliet@capulet.com/balcony',
                      stamp: '20020910T23:41:07' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          legacyDelayParser(pres, next)
        });
      },
      
      'should set delayedBy property' : function(err, stanza) {
        assert.instanceOf(stanza.delayedBy, xmpp.JID);
        assert.equal(stanza.delayedBy, 'juliet@capulet.com/balcony');
      },
      'should set originallySentAt property' : function(err, stanza) {
        assert.instanceOf(stanza.originallySentAt, Date);
        assert.equal(stanza.originallySentAt.toUTCString(), 'Tue, 10 Sep 2002 23:41:07 GMT');
      },
    },
    
    'when handling a presence stanza without delay': {
      topic: function(legacyDelayParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'juliet@capulet.com/balcony' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          legacyDelayParser(pres, next)
        });
      },
      
      'should not set delayedBy property' : function(err, stanza) {
        assert.isUndefined(stanza.delayedBy);
      },
      'should not set originallySentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.originally, Date);
      },
    },
    
    'when handling a non-message, non-presence stanza': {
      topic: function(legacyDelayParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          legacyDelayParser(iq, next)
        });
      },
      
      'should not set delayedBy property' : function(err, stanza) {
        assert.isUndefined(stanza.delayedBy);
      },
      'should not set originallySentAt property' : function(err, stanza) {
        assert.isUndefined(stanza.originallySentAt);
      },
    },
  },

}).export(module);
