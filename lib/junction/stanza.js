/**
 * Send stanza.
 *
 * Response stanzas prepared by Junction are extended with this function.
 *
 * @api public
 */
exports.send = function() {
  this.connection.send(this);
}
