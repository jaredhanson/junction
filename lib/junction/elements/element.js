/**
 * Module dependencies.
 */
var util = require('util')
  , XMLElement = require('node-xmpp').Element;


/**
 * Initialize a new `Element`.
 *
 * @param {String} name
 * @param {String} xmlns
 * @api public
 */
function Element(name, xmlns) {
  if (!name) { throw new Error('Element requires a name'); }
  
  this.parent = null;
  this.name = name;
  this.xmlns = xmlns;
  this.children = [];
}

/**
 * Add a child element.
 *
 * @param {Element|XMLElement} child
 * @param {Object} attrs (optional)
 * @api public
 */
Element.prototype.c = function(child, attrs) {
  if (attrs) {
    child = new XMLElement(child, attrs);
  }
  this.children.push(child);
  child.parent = this;
  return child;
}

/**
 * Set the text value.
 *
 * @param {String} text
 * @api public
 */
Element.prototype.t = function(text) {
  this.children.push(text);
  return this;
};

/**
 * Return the parent element, or this if root.
 *
 * @api public
 */
Element.prototype.up = function() {
  if (this.parent) {
    return this.parent;
  } else {
    return this;
  }
};

/**
 * Serialize to XML.
 *
 * @api public
 */
Element.prototype.toXML = function() {
  var attrs = this.xmlAttributes();
  attrs['xmlns'] = this.xmlns;
  var xml = new XMLElement(this.name, attrs);
  this.children.forEach(function(child) {
    if (child.toXML) { // instances of junction.Element
      xml.children.push(child.toXML());
    } else if (child.toString) { // instances of ltx.Element
      xml.children.push(child);
    } else if (typeof child === 'string') {
      xml.children.push(child);
    }
  });
  return xml;
}

/**
 * Build XML attributes.
 *
 * This function is intended to be overrriden by subclasses, in order to
 * serialize attributes.
 *
 * @api protected
 */
Element.prototype.xmlAttributes = function() {
  return {};
}


/**
 * Expose `Element`.
 */
exports = module.exports = Element;
