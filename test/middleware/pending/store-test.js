var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Store = require('junction/middleware/pending/store');


vows.describe('Store').addBatch({
  
  'store': {
    topic: function() {
      return new Store();
    },
    
    'get should throw an exception': function (store) {
      assert.throws(function() { store.get('key', function(){}); }, Error);
    },
    'set should throw an exception': function (store) {
      assert.throws(function() { store.set('key', {}, function(){}); }, Error);
    },
    'remove should throw an exception': function (store) {
      assert.throws(function() { store.remove('key', {}, function(){}); }, Error);
    },
  },
  
}).export(module);
