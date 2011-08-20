var XMLElement = require('node-xmpp').Element;

function Element(name, xmlns) {
  if (!name) { throw new Error('Element requires a name'); }
  
  this.parent = null;
  this.name = name;
  this.xmlns = xmlns;
  this.children = [];
}

Element.prototype.c = function(child) {
  this.children.push(child);
  child.parent = this;
  return child;
}

Element.prototype.t = function(text) {
  this.children.push(text);
  return this;
};

Element.prototype.up = function() {
  if (this.parent) {
    return this.parent;
  } else {
    return this;
  }
};

Element.prototype.toXML = function() {
  var attrs = this.xmlAttributes();
  attrs['xmlns'] = this.xmlns;
  var xml = new XMLElement(this.name, attrs);
  this.children.forEach(function(child) {
    if (child.toXML) {
      xml.children.push(child.toXML());
    } else if (typeof child === 'string') {
      xml.children.push(child);
    }
  });
  return xml;
}

Element.prototype.xmlAttributes = function() {
  return {};
}


exports = module.exports = Element;
