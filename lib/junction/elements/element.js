/**
 * Module dependencies.
 */
var util = require('util')
  , XMLElement = require('node-xmpp').Element
  , XMPPStanza = require('node-xmpp').Stanza;


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
  var xml
    , attrs = this.xmlAttributes();
  if (this.xmlns) { attrs['xmlns'] = this.xmlns; }
  if (this.name === 'iq' || this.name === 'message' || this.name === 'presence') {
    xml = new XMPPStanza(this.name, attrs);
  } else {
    xml = new XMLElement(this.name, attrs);
  }
  this.children.forEach(function(child) {
    if (child.toXML) { // instances of junction.Element
      // ltx / Anchor/XML compatibility switch
      if (typeof xml.children !== 'function') { xml.children.push(child.toXML()); }
      else { xml.c(child.toXML()).up(); }
    } else if (child.toString) { // instances of ltx.Element
      // ltx / Anchor/XML compatibility switch
      if (typeof xml.children !== 'function') { xml.children.push(child); }
      else { xml.c(child).up(); }
    } else if (typeof child === 'string') {
      // ltx / Anchor/XML compatibility switch
      if (typeof xml.children !== 'function') { xml.children.push(child); }
      else { xml.t(child); }
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
