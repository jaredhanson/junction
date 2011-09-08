var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var StanzaError = require('junction/stanzaerror');
var time = require('junction/middleware/time');


vows.describe('time').addBatch({

  'middleware': {
    topic: function() {
      return time();
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
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
        //       <iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2011-09-07T04:34:13Z</utc><tzo>-07:00</tzo></time></iq>
        //        Because the time is different each time this test is executed,
        //        just assert that the length is as expected.
        assert.length(stanza.toString(), 150);
      },
    },
    
    'when handling a non-IQ-get time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'set');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'modify');
        assert.equal(err.condition, 'bad-request');
      },
    },
    
    'when handling a time result': {
      topic: function(time) {
        var self = this;
        var iq = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        iq.id = 'time_1';
        iq.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('-06:00').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        iq.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          time(iq, null, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
    
    'when handling an IQ stanza that is not a time request': {
      topic: function(time) {
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
          time(iq, res, next)
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
  
  'middleware with date and timezoneOffset that is behind UTC': {
    topic: function() {
      return time({ date: new Date(Date.UTC(2006, 11, 19, 17, 38, 55)), timezoneOffset: 360 });
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2006-12-19T17:38:55Z</utc><tzo>-06:00</tzo></time></iq>');
      },
    },
  },
  
  'middleware with date and timezoneOffset that is behind UTC with minute offset': {
    topic: function() {
      return time({ date: new Date(Date.UTC(2006, 11, 19, 17, 38, 55)), timezoneOffset: 570 });
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2006-12-19T17:38:55Z</utc><tzo>-09:30</tzo></time></iq>');
      },
    },
  },
  
  'middleware with date and timezoneOffset that is ahead of UTC': {
    topic: function() {
      return time({ date: new Date(Date.UTC(2006, 11, 19, 17, 38, 55)), timezoneOffset: -600 });
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2006-12-19T17:38:55Z</utc><tzo>+10:00</tzo></time></iq>');
      },
    },
  },
  
  'middleware with date and timezoneOffset that is ahead of UTC with minute offset': {
    topic: function() {
      return time({ date: new Date(Date.UTC(2006, 11, 19, 17, 38, 55)), timezoneOffset: -330 });
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2006-12-19T17:38:55Z</utc><tzo>+05:30</tzo></time></iq>');
      },
    },
  },
  
  'middleware with date and timezoneOffset of zero': {
    topic: function() {
      return time({ date: new Date(Date.UTC(2006, 11, 19, 17, 38, 55)), timezoneOffset: 0 });
    },
    
    'when handling a time request': {
      topic: function(time) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'time_1';
        req.c(new xmpp.Element('time', { xmlns: 'urn:xmpp:time' }));
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
          time(req, res, next)
        });
      },
      
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="time_1" to="romeo@montague.net/orchard" type="result"><time xmlns="urn:xmpp:time"><utc>2006-12-19T17:38:55Z</utc><tzo>-00:00</tzo></time></iq>');
      },
    },
  },

}).export(module);
