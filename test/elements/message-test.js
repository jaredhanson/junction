var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var junction = require('junction');
var Message = require('junction/elements/message');


vows.describe('Message').addBatch({

  'when constructed with a to address': {
    topic: function() {
      return new Message('juliet@example.com');
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
      assert.equal(iq.toXML().toString(), '<message to="juliet@example.com"/>');
    },
    'should build Stanza instance': function(iq) {
      var xml = iq.toXML();
      assert.instanceOf(xml, xmpp.Element);
      assert.instanceOf(xml, xmpp.Stanza);
    },
  },
  
  'when constructed with a to address and type': {
    topic: function() {
      return new Message('juliet@example.com', 'groupchat');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should not have an from address': function (iq) {
      assert.isNull(iq.from);
    },
    'should be of type groupchat': function (iq) {
      assert.equal(iq.type, 'groupchat');
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<message to="juliet@example.com" type="groupchat"/>');
    },
  },
  
  'when constructed with a to address, from address, and type': {
    topic: function() {
      return new Message('juliet@example.com', 'romeo@example.net', 'groupchat');
    },
    
    'should have a to address': function (iq) {
      assert.equal(iq.to, 'juliet@example.com');
    },
    'should have a from address': function (iq) {
      assert.equal(iq.from, 'romeo@example.net');
    },
    'should be of type groupchat': function (iq) {
      assert.equal(iq.type, 'groupchat');
    },
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<message to="juliet@example.com" from="romeo@example.net" type="groupchat"/>');
    },
  },
  
  'when given an ID': {
    topic: function() {
      var msg = new Message('juliet@example.com');
      msg.id = 1;
      return msg;
    },
    
    'should build correct XML string': function(iq) {
      assert.equal(iq.toXML().toString(), '<message id="1" to="juliet@example.com"/>');
    },
  },

}).export(module);
