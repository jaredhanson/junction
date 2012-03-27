var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var StanzaError = require('junction/stanzaerror');
var legacyTime = require('junction/middleware/legacyTime');


vows.describe('legacyTime').addBatch({

  'middleware': {
    topic: function() {
      return legacyTime();
    },
    
    'when handling a legacy time request': {
      topic: function(legacyTime) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:time' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new xmpp.Element('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        process.nextTick(function () {
          legacyTime(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        // NOTE: XML string should be formatted as follows:
        //       <iq id="time_1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:time"><utc>20110908T03:37:10</utc></query></iq>
        //       Because the time is different each time this test is executed,
        //       just assert that the length is as expected.
        assert.lengthOf(stanza.toString(), 133);
      },
    },
    
    'when handling a non-IQ-get legacy time request': {
      topic: function(legacyTime) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'set');
        req.id = 'time_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:time' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new xmpp.Element('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, req);
        }
        process.nextTick(function () {
          legacyTime(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'modify');
        assert.equal(err.condition, 'bad-request');
      },
    },
    
    'when handling a legacy time result': {
      topic: function(legacyTime) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('query', { xmlns: 'jabber:iq:time' })
          .c('utc').t('20020910T17:58:35').up()
          .c('tz').t('MDT').up()
          .c('display').t('Tue Sep 10 12:58:35 2002');
        res = res.toXML();
        res.type = res.attrs.type;
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          legacyTime(res, null, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
    
    'when handling an IQ stanza that is not a legacy time request': {
      topic: function(legacyTime) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        var res = new xmpp.Element('iq', { id: iq.attrs.id,
                                           to: iq.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          legacyTime(iq, res, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
  },
  
  'middleware with date, timezone, and display options': {
    topic: function() {
      return legacyTime({ date: new Date(Date.UTC(2002, 08, 10, 17, 58, 35)), timezone: 'MDT', display: 'Tue Sep 10 12:58:35 2002' });
    },
    
    'when handling a legacy time request': {
      topic: function(legacyTime) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:time' }));
        req = req.toXML();
        req.type = req.attrs.type;
        var res = new xmpp.Element('iq', { id: req.attrs.id,
                                           to: req.attrs.from,
                                           type: 'result' });
        
        res.send = function() {
          self.callback(null, res);
        }
        function next(err) {
          self.callback(new Error('should not call next'));
        }
        process.nextTick(function () {
          legacyTime(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:time"><utc>20020910T17:58:35</utc><tz>MDT</tz><display>Tue Sep 10 12:58:35 2002</display></query></iq>');
      },
    },
  },

}).export(module);
