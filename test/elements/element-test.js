var vows = require('vows');
var assert = require('assert');
var junction = require('junction');
var Element = require('junction/elements/element');


vows.describe('Element').addBatch({

  'when constructed without a name': {
    topic: function() {
      return null;
    },
    
    'should throw an error' : function(element) {
      assert.throws(function() { new Element(); }, Error);
    },
  },
  
  'when constructed with a name': {
    topic: new Element('bar'),
    
    'should have a name': function (element) {
      assert.equal(element.name, 'bar');
    },
    'should not have an XML namespace': function (element) {
      assert.isUndefined(element.xmlns);
    },
    'should not have any XML attributes': function (element) {
      assert.isEmpty(element.xmlAttributes());
    },
    'should convert to XML': {
      topic: function(element) {
        return element.toXML();
      },
      
      'should be an instance of XMLElement': function(xml) {
        assert.instanceOf(xml, junction.XMLElement);
      },
      'should build correct string': function(xml) {
        assert.equal(xml.toString(), '<bar/>');
      },
    },
  },
  
  'when constructed with a name and namespace': {
    topic: new Element('bar', 'urn:foo'),
    
    'should have an XML namespace': function (element) {
      assert.equal(element.xmlns, 'urn:foo');
    },
    'should convert to XML': {
      topic: function(element) {
        return element.toXML();
      },
      
      'should build correct string': function(xml) {
        assert.equal(xml.toString(), '<bar xmlns="urn:foo"/>');
      },
    },
  },
  
  'with a parent-child relationship': {
    topic: function() {
      return new Element('parent');
    },
    
    'should return root element when calling up on root element': function(parent) {
      assert.equal(parent.up(), parent);
    },
    'after appending a child': {
      topic: function(parent) {
        this.parent = parent;
        return parent.c(new Element('child'));
      },
      
      'parent should have one child': function(child) {
        assert.length(this.parent.children, 1);
      },
      'parent should include child': function(child) {
        assert.include(this.parent.children, child);
      },
      'child should have a parent': function(child) {
        assert.equal(child.parent, this.parent);
      },
      'should return parent element when calling up on child element': function(child) {
        assert.equal(child.up(), this.parent);
      },
      'should convert to XML': {
        topic: function(child, parent) {
          return parent.toXML();
        },

        'should build correct string': function(xml) {
          assert.equal(xml.toString(), '<parent><child/></parent>');
        },
      },
      'after appending a second child': {
        topic: function(child, parent) {
          this.parent = parent;
          return parent.c(new Element('second-child'));
        },

        'parent should have two children': function(child) {
          assert.length(this.parent.children, 2);
        },
        'should convert to XML': {
          topic: function(secondChild, child, parent) {
            return parent.toXML();
          },

          'should build correct string': function(xml) {
            assert.equal(xml.toString(), '<parent><child/><second-child/></parent>');
          },
        },
      },
    },
  },

}).export(module);
