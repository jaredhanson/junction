var vows = require('vows');
var assert = require('assert');
var util = require('util');
var JID = require('node-xmpp').JID;
var IQ = require('junction/elements/iq');
var pending = require('junction/middleware/pending');


function MockStore() {
  this._store = {};
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'result');
        res = res.toXML();
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
      
      'should set irt property' : function(err, stanza) {
        assert.isObject(stanza.irt);
      },
      'should restore pending data' : function(err, stanza) {
        assert.equal(stanza.irt.action, 'start');
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'error');
        res = res.toXML();
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
      
      'should set irt property' : function(err, stanza) {
        assert.isObject(stanza.irt);
      },
      'should restore pending data' : function(err, stanza) {
        assert.equal(stanza.irt.action, 'start');
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'result');
        res = res.toXML();
        res.id = 'iq_2';
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'get');
        res = res.toXML();
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'set');
        res = res.toXML();
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
        var res = new IQ('romeo@montague.net/orchard', 'plays.shakespeare.lit', 'result');
        res = res.toXML();
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
      
      'should indicate an error' : function(err, stanza) {
        assert.instanceOf(err, Error);
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
