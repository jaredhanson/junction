var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var timeResultParser = require('junction/middleware/timeResultParser');


vows.describe('timeResultParser').addBatch({

  'middleware': {
    topic: function() {
      return timeResultParser();
    },
    
    'when handling a time result from a timezone behind UTC': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('-06:00').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, 360);
      },
    },
    
    'when handling a time result from a timezone behind UTC with minute offset': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('-09:30').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, 570);
      },
    },
    
    'when handling a time result from a timezone ahead of UTC': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('+10:00').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, -600);
      },
    },
    
    'when handling a time result from a timezone ahead of UTC with minute offset': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('+05:30').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, -330);
      },
    },
    
    'when handling a time result from the GMT timezone with a plus token': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('+00:00').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, 0);
      },
    },
    
    'when handling a time result from the GMT timezone with a minus token': {
      topic: function(timeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('time', { xmlns: 'urn:xmpp:time' })
          .c('tzo').t('-00:00').up()
          .c('utc').t('2006-12-19T17:58:35Z');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          timeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 19 Dec 2006 17:58:35 GMT');
      },
      'should set timezoneOffset property' : function(err, stanza) {
        assert.isNumber(stanza.timezoneOffset);
        assert.equal(stanza.timezoneOffset, 0);
      },
    },
    
    'when handling an IQ stanza that is not a time result': {
      topic: function(timeResultParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          timeResultParser(iq, next)
        });
      },
      
      'should not set utcDate property' : function(err, stanza) {
        assert.isUndefined(stanza.utcDate);
      },
      'should not set timezoneOffset property' : function(err, stanza) {
        assert.isUndefined(stanza.timezoneOffset);
      },
    },
  },

}).export(module);
