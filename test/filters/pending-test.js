var vows = require('vows');
var assert = require('assert');
var util = require('util');
var JID = require('node-xmpp').JID;
var IQ = require('junction/elements/iq');
var pending = require('junction/filters/pending');


function MockStore() {
  this._store = {};
}

MockStore.prototype.get = function(key, callback) {
  var data = this._store[key];
  if (data) {
    data = JSON.parse(data);
    callback(null, data);
  } else {
    callback();
  }
}

MockStore.prototype.set = function(key, data, callback) {
  if (this.simulateError) { return callback(new Error('Failed to set data in pending store')); }
  
  this._store[key] = JSON.stringify(data);
  callback && callback();
}

MockStore.prototype.remove = function(key, callback) {
}


vows.describe('pending').addBatch({

  'filter': {
    topic: function() {
      var self = this;
      var store = new MockStore();
      //store.set('plays.shakespeare.lit:iq_1', { action: 'start' });
      var filter = pending({ store: store });
      process.nextTick(function () {
        self.callback(null, filter, store)
      });
    },
    
    'when processing an outgoing stanza with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new IQ('plays.shakespeare.lit', 'romeo@montague.net/orchard', 'get');
        res.id = 'iq_1';
        res = res.toXML();
        res.pending = {};
        res.pending.action = 'open';
        
        function next(err) {
          store.get('plays.shakespeare.lit:iq_1', function(err, data) {
            self.callback(err, data);
          });
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should set data in store' : function(err, data) {
        assert.isObject(data);
        assert.equal(data.action, 'open');
      },
    },
    
    'when processing an outgoing stanza without pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new IQ('plays.shakespeare.lit', 'romeo@montague.net/orchard', 'get');
        res.id = 'iq_2';
        res = res.toXML();
        
        function next(err) {
          store.get('plays.shakespeare.lit:iq_2', function(err, data) {
            self.callback(err, data);
          });
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should not set data in store' : function(err, data) {
        assert.isUndefined(data);
      },
    },
    
    'when processing an outgoing stanza without an ID': {
      topic: function(pending, store) {
        var self = this;
        var res = new IQ('plays.shakespeare.lit', 'romeo@montague.net/orchard', 'get');
        res = res.toXML();
        res.pending = {};
        res.pending.action = 'noop';
        
        function next(err) {
          store.get('plays.shakespeare.lit:iq_3', function(err, data) {
            self.callback(err, data);
          });
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should not set data in store' : function(err, data) {
        assert.isUndefined(data);
      },
    },
  },
  
  'filter with error': {
    topic: function() {
      var self = this;
      var store = new MockStore();
      store.simulateError = true;
      //store.set('plays.shakespeare.lit:iq_1', { action: 'start' });
      var filter = pending({ store: store });
      process.nextTick(function () {
        self.callback(null, filter, store)
      });
    },
    
    'when processing an outgoing stanza with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new IQ('plays.shakespeare.lit', 'romeo@montague.net/orchard', 'get');
        res.id = 'iq_1';
        res = res.toXML();
        res.pending = {};
        res.pending.action = 'open';
        
        function next(e) {
          store.get('plays.shakespeare.lit:iq_1', function(err, data) {
            self.callback(err, e, data);
          });
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should next with error' : function(err, e, data) {
        assert.instanceOf(e, Error);
      },
      'should not set data in store' : function(err, e, data) {
        assert.isUndefined(data);
      },
    },
  },
  
  'when constructed without a store': {
    topic: function() {
      return null;
    },
    
    'should throw an error' : function() {
      assert.throws(function() { pending(); }, Error);
    },
  },

}).export(module);
