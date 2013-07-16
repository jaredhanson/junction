var vows = require('vows');
var assert = require('assert');
var xmpp = require('node-xmpp');
var util = require('util');
var JID = require('node-xmpp').JID;
var pending = require('junction/middleware/pending');


function MockStore() {
  this._store = {};
  this._removed = {};
}

MockStore.prototype.get = function(key, callback) {
  if (this.simulateError) { return callback(new Error('Failed to get data from pending store')); }
  
  var data = this._store[key];
  if (data) {
    data = JSON.parse(data);
    callback(null, data);
  } else {
    callback();
  }
}

MockStore.prototype.set = function(key, data, callback) {
  this._store[key] = JSON.stringify(data);
  callback && callback();
}

MockStore.prototype.remove = function(key, callback) {
  this._removed[key] = true;
}


vows.describe('pending').addBatch({

  'middleware': {
    topic: function() {
      var self = this;
      var store = new MockStore();
      store.set('plays.shakespeare.lit:iq_1', { action: 'start' });
      var middleware = pending({ store: store });
      process.nextTick(function () {
        self.callback(null, middleware, store)
      });
    },
    
    'when handling a result with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'result', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_1' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res, store);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should set irt property' : function(err, stanza) {
        assert.isObject(stanza.irt);
      },
      'should restore pending data' : function(err, stanza) {
        assert.equal(stanza.irt.action, 'start');
      },
      'should remove key from store' : function(err, stanza, store) {
        assert.equal(store._removed['plays.shakespeare.lit:iq_1'], true);
      },
      'should set irt aliases' : function(err, stanza) {
        assert.equal(stanza.irt, stanza.inReplyTo);
        assert.equal(stanza.irt, stanza.inResponseTo);
        assert.equal(stanza.irt, stanza.regarding);
      },
    },
    
    'when handling an error with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'error', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_1' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res, store);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should set irt property' : function(err, stanza) {
        assert.isObject(stanza.irt);
      },
      'should restore pending data' : function(err, stanza) {
        assert.equal(stanza.irt.action, 'start');
      },
      'should remove key from store' : function(err, stanza, store) {
        assert.equal(store._removed['plays.shakespeare.lit:iq_1'], true);
      },
      'should set irt aliases' : function(err, stanza) {
        assert.equal(stanza.irt, stanza.inReplyTo);
        assert.equal(stanza.irt, stanza.inResponseTo);
        assert.equal(stanza.irt, stanza.regarding);
      },
    },
    
    'when handling a result without pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'result', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_2' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should not set irt property' : function(err, stanza) {
        assert.isUndefined(stanza.irt);
      },
    },
    
    'when handling an incoming get stanza': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'get', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_1' });
        res.id = 'iq_1';
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should not set irt property' : function(err, stanza) {
        assert.isUndefined(stanza.irt);
      },
    },
    
    'when handling an incoming set stanza': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'set', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_1' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should not set irt property' : function(err, stanza) {
        assert.isUndefined(stanza.irt);
      },
    },
  },
  
  'middleware with autoRemove disabled': {
    topic: function() {
      var self = this;
      var store = new MockStore();
      store.set('plays.shakespeare.lit:iq_X', { action: 'status' });
      var middleware = pending({ store: store, autoRemove: false });
      process.nextTick(function () {
        self.callback(null, middleware, store)
      });
    },
    
    'when handling a result with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'result', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_X' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res, store);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should set irt property' : function(err, stanza) {
        assert.isObject(stanza.irt);
      },
      'should restore pending data' : function(err, stanza) {
        assert.equal(stanza.irt.action, 'status');
      },
      'should not remove key from store' : function(err, stanza, store) {
        assert.isUndefined(store._removed['plays.shakespeare.lit:iq_X']);
      },
      'should set irt aliases' : function(err, stanza) {
        assert.equal(stanza.irt, stanza.inReplyTo);
        assert.equal(stanza.irt, stanza.inResponseTo);
        assert.equal(stanza.irt, stanza.regarding);
      },
    },
  },
  
  'middleware with error': {
    topic: function() {
      var self = this;
      var store = new MockStore();
      store.simulateError = true;
      var middleware = pending({ store: store });
      process.nextTick(function () {
        self.callback(null, middleware, store)
      });
    },
    
    'when handling a result with pending data': {
      topic: function(pending, store) {
        var self = this;
        var res = new xmpp.Stanza('iq', { type: 'result', to: 'romeo@montague.net/orchard', from: 'plays.shakespeare.lit', id: 'iq_1' });
        res.id = res.attrs.id;
        res.from = new JID(res.attrs.from)
        res.type = res.attrs.type;
        
        function next(err) {
          self.callback(err, res);
        }
        process.nextTick(function () {
          pending(res, next)
        });
      },
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, Error);
      },
      'should not set irt property' : function(err, stanza) {
        assert.isUndefined(stanza.irt);
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
