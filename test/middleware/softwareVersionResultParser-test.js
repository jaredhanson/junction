var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var softwareVersionResultParser = require('junction/middleware/softwareVersionResultParser');


vows.describe('softwareVersionResultParser').addBatch({

  'middleware': {
    topic: function() {
      return softwareVersionResultParser();
    },
    
    'when handling a version result': {
      topic: function(softwareVersionResultParser) {
        var self = this;
        var res = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        res.id = 'version_1';
        res.c('query', { xmlns: 'jabber:iq:version' })
          .c('name').t('Exodus').up()
          .c('version').t('0.7.0.4').up()
          .c('os').t('Windows-XP 5.01.2600');
        res = res.toXML();
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          softwareVersionResultParser(res, next)
        });
      },
      
      'should set application property' : function(err, stanza) {
        assert.equal(stanza.application, 'Exodus');
      },
      'should set version property' : function(err, stanza) {
        assert.equal(stanza.version, '0.7.0.4');
      },
      'should set os property' : function(err, stanza) {
        assert.equal(stanza.os, 'Windows-XP 5.01.2600');
      },
    },
    
    'when handling an IQ stanza that is not a version result': {
      topic: function(softwareVersionResultParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          softwareVersionResultParser(iq, next)
        });
      },
      
      'should not set application property' : function(err, stanza) {
        assert.isUndefined(stanza.application);
      },
      'should not set version property' : function(err, stanza) {
        assert.isUndefined(stanza.version);
      },
      'should not set os property' : function(err, stanza) {
        assert.isUndefined(stanza.os);
      },
    },
  },

}).export(module);
