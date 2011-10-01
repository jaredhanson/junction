var vows = require('vows');
var assert = require('assert');
var junction = require('junction');
var util = require('util');


vows.describe('Library').addBatch({
  
  'junction': {
    topic: function() {
      return null;
    },
    
    'should report a version': function (x) {
      assert.isString(junction.version);
    },
  },
  
  'create connection with client type': {
    topic: function() {
      return new junction.createConnection({ type: 'client', jid: 'user@invalid.host', disableStream: true });
    },
    
    'should be an instance of Client': function (c) {
      assert.instanceOf(c, junction.Client);
    },
  },
  
  'create connection with component type': {
    topic: function() {
      return new junction.createConnection({ type: 'component', jid: 'component.invalid.host', host: 'invalid.host', port: 5060, disableStream: true });
    },
    
    'should be an instance of Component': function (c) {
      assert.instanceOf(c, junction.Component);
    },
  },
  
}).export(module);
