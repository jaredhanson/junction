var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Component = require('junction/component');


vows.describe('Component').addBatch({
  
  'initialization': {
    topic: function() {
      return new Component({ jid: 'component.invalid.host', host: 'invalid.host', port: 5060, disableStream: true });
    },
    
    'should have a use function': function (c) {
      assert.isFunction(c.use);
    },
  },
  
}).export(module);
