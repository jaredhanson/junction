var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var junction = require('junction');
var Presence = require('junction/elements/presence');


vows.describe('Presence').addBatch({

  'when constructed': {
    topic: function() {
      return new Presence();
    },
    
    'should not have a to address': function (iq) {
      assert.isNull(iq.to);
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should not have a type': function (iq) {
      assert.isNull(iq.type);
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<presence/>');
    },
    'should build Stanza instance': function(iq) {
      var xml = iq.toXML();
      assert.instanceOf(xml, xmpp.Element);
      assert.instanceOf(xml, xmpp.Stanza);
    },
  },

  'when constructed with a to address': {
    topic: function() {
      return new Presence('juliet@example.com');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should not have a type': function (iq) {
      assert.isNull(iq.type);
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<presence to="juliet@example.com"/>');
    },
  },
  
  'when constructed with a to address and type': {
    topic: function() {
      return new Presence('juliet@example.com', 'unavailable');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should be of type unavailable': function (iq) {
      assert.equal(iq.type, 'unavailable');
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<presence to="juliet@example.com" type="unavailable"/>');
    },
  },
  
  'when constructed with a to address, from address, and type': {
    topic: function() {
      return new Presence('juliet@example.com', 'romeo@example.net', 'unavailable');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should have a from address': function (iq) {
      assert.equal(iq.from, 'romeo@example.net');
    },
    'should be of type unavailable': function (iq) {
      assert.equal(iq.type, 'unavailable');
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<presence to="juliet@example.com" from="romeo@example.net" type="unavailable"/>');
    },
  },
  
  'when given an ID': {
    topic: function() {
      var pres = new Presence('juliet@example.com');
      pres.id = 1;
      return pres;
    },
    
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<presence id="1" to="juliet@example.com"/>');
    },
  },

}).export(module);
