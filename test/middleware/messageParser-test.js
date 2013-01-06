var vows = require('vows');
var assert = require('assert');
var util = require('util');
var junction = require('junction');
var messageParser = require('junction/middleware/messageParser');


vows.describe('messageParser').addBatch({

  'middleware': {
    topic: function() {
      return messageParser();
    },
    
    'when handling a message stanza': {
      topic: function(messageParser) {
        var self = this;
        var msg = new junction.XMLElement('message', { from: 'juliet@example.com/balcony', to: 'romeo@example.net' });
        msg.c('subject').t('I implore you!').up()
           .c('body').t('Wherefore art thou, Romeo?').up()
           .c('thread', { parent: 'e0ffe42b28561960c6b12b944a092794b9683a38' }).t('0e3141cd80894871a68e6fe6b1ec56fa');
        
        function next(err) {
          self.callback(err, msg);
        }
        process.nextTick(function () {
          messageParser(msg, next)
        });
      },
      
      'should set subject property' : function(err, stanza) {
        assert.equal(stanza.subject, 'I implore you!');
      },
      'should set body property' : function(err, stanza) {
        assert.equal(stanza.body, 'Wherefore art thou, Romeo?');
      },
      'should set thread property' : function(err, stanza) {
        assert.equal(stanza.thread, '0e3141cd80894871a68e6fe6b1ec56fa');
      },
      'should set parentThread property' : function(err, stanza) {
        assert.equal(stanza.parentThread, 'e0ffe42b28561960c6b12b944a092794b9683a38');
      },
    },
    
    'when handling a non-message stanza': {
      topic: function(messageParser) {
        var self = this;
        var iq = new IQ('romeo@example.net', 'juliet@example.com', 'get');
        iq = iq.toXML();
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          messageParser(iq, next)
        });
      },
      
      'should not set subject property' : function(err, stanza) {
        assert.isUndefined(stanza.subject);
      },
      'should not set body property' : function(err, stanza) {
        assert.isUndefined(stanza.body);
      },
      'should not set thread property' : function(err, stanza) {
        assert.isUndefined(stanza.thread);
      },
      'should not set parentThread property' : function(err, stanza) {
        assert.isUndefined(stanza.parentThread);
      },
    },
  },

}).export(module);
