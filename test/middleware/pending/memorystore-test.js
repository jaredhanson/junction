var vows = require('vows');
var assert = require('assert');
var util = require('util');
var MemoryStore = require('junction/middleware/pending/memorystore');


vows.describe('MemoryStore').addBatch({
  
  'store': {
    topic: function() {
      return new MemoryStore();
    },
    
    'set data and get data': {
      topic: function(store) {
        var self = this;
        store.set('id_1', { action: 'open' }, function(err) {
          store.get('id_1', function(err, data) {
            self.callback(err, data);
          });
        });
      },
      
      'should fetch correct data': function (data) {
        assert.equal(data.action, 'open');
      },
    },
    
    'remove data and get data': {
      topic: function(store) {
        var self = this;
        store.set('id_2', { action: 'close' }, function(err) {
          store.remove('id_2', function(err, data) {
            store.get('id_2', function(err, data) {
              self.callback(err, data, store);
            });
          });
        });
      },
      
      'should fetch no data': function (data) {
        assert.isUndefined(data);
      },
    },
    
    'get data with unknown key': {
      topic: function(store) {
        var self = this;
        store.get('id_unkown', function(err, data) {
          self.callback(err, data);
        });
      },
      
      'should fetch no data': function (data) {
        assert.isUndefined(data);
      },
    },
  },
  
  'store with timeout': {
    topic: function() {
      return new MemoryStore({ timeout: 500 });
    },
    
    'set data and get data': {
      topic: function(store) {
        var self = this;
        store.set('id_timeout', { action: 'open' }, function(err) {
          setTimeout(function() {
            store.get('id_timeout', function(err, data) {
              self.callback(err, data);
            });
          }, 1000);
        });
      },
      
      'should fetch no data due to expiration': function (data) {
        assert.isUndefined(data);
      },
    },
  }
  
}).export(module);
