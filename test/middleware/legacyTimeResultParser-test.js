var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var legacyTimeResultParser = require('junction/middleware/legacyTimeResultParser');


vows.describe('legacyTimeResultParser').addBatch({

  'middleware': {
    topic: function() {
      return legacyTimeResultParser();
    },
    
    'when handling a legacy time result': {
      topic: function(legacyTimeResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'time_1';
        res.c('query', { xmlns: 'jabber:iq:time' })
          .c('utc').t('20020910T17:58:35').up()
          .c('tz').t('MDT').up()
          .c('display').t('Tue Sep 10 12:58:35 2002');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          legacyTimeResultParser(res, next)
        });
      },
      
      'should set utcDate property' : function(err, stanza) {
        assert.instanceOf(stanza.utcDate, Date);
        assert.equal(stanza.utcDate.toUTCString(), 'Tue, 10 Sep 2002 17:58:35 GMT');
      },
      'should set timezone property' : function(err, stanza) {
        assert.equal(stanza.timezone, 'MDT');
      },
      'should set display property' : function(err, stanza) {
        assert.equal(stanza.display, 'Tue Sep 10 12:58:35 2002');
      },
    },
    
    'when handling an IQ stanza that is not a legacy time result': {
      topic: function(legacyTimeResultParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          legacyTimeResultParser(iq, next)
        });
      },
      
      'should not set utcDate property' : function(err, stanza) {
        assert.isUndefined(stanza.utcDate);
      },
      'should not set timezone property' : function(err, stanza) {
        assert.isUndefined(stanza.timezone);
      },
      'should not set display property' : function(err, stanza) {
        assert.isUndefined(stanza.display);
      },
    },
  },

}).export(module);
