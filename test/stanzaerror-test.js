var vows = require('vows');
var assert = require('assert');
var StanzaError = require('junction/stanzaerror');


vows.describe('StanzaError').addBatch({

  'when constructed': {
    topic: function() {
      return new StanzaError();
    },
    
    'should be an instance of Error': function (error) {
      assert.instanceOf(error, Error);
    },
    'should have a name of StanzaError': function (error) {
      assert.equal(error.name, 'StanzaError');
    },
    'should not have a message': function (error) {
      assert.isNull(error.message);
    },
    'should be of type wait': function (error) {
      assert.equal(error.type, 'wait');
    },
    'should have a internal-server-error condition': function (error) {
      assert.equal(error.condition, 'internal-server-error');
    },
    'should capture a stack trace': function (error) {
      assert.typeOf(error.stack, 'string');
    },
  },
  
  'when constructed with a message': {
    topic: function() {
      return new StanzaError('fubar');
    },
    
    'should have a message': function (error) {
      assert.equal(error.message, 'fubar');
    },
  },
  
  'when constructed with a message and type': {
    topic: function() {
      return new StanzaError('fubar', 'cancel');
    },
    
    'should have a message': function (error) {
      assert.equal(error.message, 'fubar');
    },
    'should have a type': function (error) {
      assert.equal(error.type, 'cancel');
    },
  },
  
  'when constructed with a message, type, and condition': {
    topic: function() {
      return new StanzaError('fubar', 'modify', 'bad-request');
    },
    
    'should have a message': function (error) {
      assert.equal(error.message, 'fubar');
    },
    'should have a type': function (error) {
      assert.equal(error.type, 'modify');
    },
    'should have a condition': function (error) {
      assert.equal(error.condition, 'bad-request');
    },
  },

}).export(module);
