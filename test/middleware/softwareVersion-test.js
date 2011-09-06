var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var IQ = require('junction/elements/iq');
var StanzaError = require('junction/stanzaerror');
var softwareVersion = require('junction/middleware/softwareVersion');


vows.describe('softwareVersion').addBatch({

  'with name, version, and OS': {
    topic: function() {
      return softwareVersion('IM', '1.0', 'MS-DOS');
    },
    
    'when handling a version request': {
      topic: function(softwareVersion) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'version_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:version' }));
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
          softwareVersion(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="version_1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:version"><name>IM</name><version>1.0</version><os>MS-DOS</os></query></iq>');
      },
    },
    
    'when handling a version result': {
      topic: function(softwareVersion) {
        var self = this;
        var iq = new IQ('romeo@montague.net/orchard', 'juliet@capulet.com/balcony', 'result');
        iq.id = 'version_1';
        iq.c('query', { xmlns: 'jabber:iq:version' })
          .c('name').t('Exodus').up()
          .c('version').t('0.7.0.4').up()
          .c('os').t('Windows-XP 5.01.2600');
        iq = iq.toXML();
        iq.type = iq.attrs.type;
        
        iq.send = function() {
          self.callback(new Error('should not call send'));
        }
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          softwareVersion(iq, null, next)
        });
      },
      
      'should not call send' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call next' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
    },
    
    'when handling a non-IQ-get version request': {
      topic: function(softwareVersion) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'set');
        req.id = 'version_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:version' }));
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
          softwareVersion(req, res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, StanzaError);
        assert.equal(err.type, 'modify');
        assert.equal(err.condition, 'bad-request');
      },
    },
    
    'when handling an IQ stanza that is not a version request': {
      topic: function(softwareVersion) {
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
          softwareVersion(iq, res, next)
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
  
  'with name': {
    topic: function() {
      return softwareVersion('IM');
    },
    
    'when handling a version request': {
      topic: function(softwareVersion) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'version_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:version' }));
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
          softwareVersion(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="version_1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:version"><name>IM</name></query></iq>');
      },
    },
  },
  
  'with name and version': {
    topic: function() {
      return softwareVersion('IM', '1.0');
    },
    
    'when handling a version request': {
      topic: function(softwareVersion) {
        var self = this;
        var req = new IQ('juliet@capulet.com/balcony', 'romeo@montague.net/orchard', 'get');
        req.id = 'version_1';
        req.c(new xmpp.Element('query', { xmlns: 'jabber:iq:version' }));
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
          softwareVersion(req, res, next)
        });
      },
      
      'should not call next' : function(err, stanza) {
        assert.isNull(err);
      },
      'should call send' : function(err, stanza) {
        assert.isNotNull(stanza);
      },
      'should send correct result' : function(err, stanza) {
        assert.equal(stanza.toString(), '<iq id="version_1" to="romeo@montague.net/orchard" type="result"><query xmlns="jabber:iq:version"><name>IM</name><version>1.0</version></query></iq>');
      },
    },
  },

}).export(module);
