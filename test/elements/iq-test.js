var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var junction = require('junction');
var IQ = require('junction/elements/iq');


vows.describe('IQ').addBatch({

  'when constructed with a to address': {
    topic: function() {
      return new IQ('juliet@example.com');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should be of type get': function (iq) {
      assert.equal(iq.type, 'get');
    },
    'should not have an ID': function (iq) {
      assert.isNull(iq.id);
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<iq to="juliet@example.com" type="get"/>');
    },
    'should build Stanza instance': function(iq) {
      var xml = iq.toXML();
      assert.instanceOf(xml, xmpp.Element);
      assert.instanceOf(xml, xmpp.Stanza);
    },
  },
  
  'when constructed with a to address and type': {
    topic: function() {
      return new IQ('juliet@example.com', 'set');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should be of type set': function (iq) {
      assert.equal(iq.type, 'set');
    },
    'should not have an ID': function (iq) {
      assert.isNull(iq.id);
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<iq to="juliet@example.com" type="set"/>');
    },
  },
  
  'when constructed with a to address, from address, and type': {
    topic: function() {
      return new IQ('juliet@example.com', 'romeo@example.net', 'set');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should have a from address': function (iq) {
      assert.equal(iq.from, 'romeo@example.net');
    },
    'should be of type set': function (iq) {
      assert.equal(iq.type, 'set');
    },
    'should not have an ID': function (iq) {
      assert.isNull(iq.id);
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<iq to="juliet@example.com" from="romeo@example.net" type="set"/>');
    },
  },
  
  'when given an ID': {
    topic: function() {
      var iq = new IQ('juliet@example.com');
      iq.id = 1;
      return iq;
    },
    
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<iq id="1" to="juliet@example.com" type="get"/>');
    },
  },

}).export(module);
