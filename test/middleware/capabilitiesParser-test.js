var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var junction = require('junction');
var capabilitiesParser = require('junction/middleware/capabilitiesParser');


vows.describe('capabilitiesParser').addBatch({

  'middleware': {
    topic: function() {
      return capabilitiesParser();
    },
    
    'when handling a presence stanza': {
      topic: function(capabilitiesParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        pres.c('c', { xmlns: 'http://jabber.org/protocol/caps',
                       node: 'http://code.google.com/p/exodus',
                       hash: 'sha-1',
                        ver: 'QgayPKawpkPSDYmwT/WM94uAlu0=' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          capabilitiesParser(pres, next)
        });
      },
      
      'should set node property' : function(err, stanza) {
        assert.equal(stanza.capabilities.node, 'http://code.google.com/p/exodus');
      },
      'should set hash property' : function(err, stanza) {
        assert.equal(stanza.capabilities.hash, 'sha-1');
      },
      'should set verification property' : function(err, stanza) {
        assert.equal(stanza.capabilities.ver, 'QgayPKawpkPSDYmwT/WM94uAlu0=');
        assert.equal(stanza.capabilities.verification, 'QgayPKawpkPSDYmwT/WM94uAlu0=');
      },
      'should alias caps to capabilities' : function(err, stanza) {
        assert.equal(stanza.caps, stanza.capabilities);
      },
    },
    
    'when handling a presence stanza without capabilities': {
      topic: function(capabilitiesParser) {
        var self = this;
        var pres = new junction.XMLElement('presence', { from: 'romeo@example.net/orchard' });
        
        function next(err) {
          self.callback(err, pres);
        }
        process.nextTick(function () {
          capabilitiesParser(pres, next)
        });
      },
      
      'should not set capbilities' : function(err, stanza) {
        assert.isUndefined(stanza.capabilites);
      },
    },
    
    'when handling a non-presence stanza': {
      topic: function(capabilitiesParser) {
        var self = this;
        var iq = new xmpp.Stanza('iq', { type: 'get', to: 'romeo@example.net', from: 'juliet@example.com' });
        
        function next(err) {
          self.callback(err, iq);
        }
        process.nextTick(function () {
          capabilitiesParser(iq, next)
        });
      },
      
      'should not set capbilities' : function(err, stanza) {
        assert.isUndefined(stanza.capabilites);
      },
    },
  },

}).export(module);
