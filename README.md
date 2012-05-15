# Junction

Junction is an extensible [XMPP](http://xmpp.org/) middleware layer for [Node](http://nodejs.org).
Highly scalable applications can be constructed by assembling sets of "plugins"
known as _middleware_ and _filters_.  Middleware process incoming stanzas, while
filters process outgoing stanzas.

This architecture has been proven effective by [Connect](http://www.senchalabs.org/connect/),
which provides HTTP middleware.  Junction adopts this approach, repurposing it
for use in XMPP, allowing XMPP applications to be built quickly and easily,
while harnessing the powerful patterns familiar to Node.js developers.

## Installation

    $ npm install junction

## Usage

#### Create an Application

To create a new application, simply invoke `junction()`.  Use the built in
message and presence parsing middleware to parse common stanzas.

    var app = junction()
      .use(junction.messageParser())
      .use(junction.presenceParser())

#### Handle Stanzas

Use additional middleware to define your application's behavior.  In this
example, the built in `message` middleware is used to handle chat messages.
Anytime a message is received, we send a greeting and echo the message body.

    app.use(junction.message(function(handler) {
      handler.on('chat', function(stanza) {
        var msg = new Message(stanza.from);
        msg.c('body', {}).t('Hello ' + stanza.from + '!\n\n' +
                            'You said: ' + stanza.body);
        stanza.connection.send(msg);
      });
    }));
    
Junction provides [built-in middleware](https://github.com/jaredhanson/junction/tree/master/lib/junction/middleware)
to handle core XMPP functionality.  Additional middleware and higher-level
frameworks are available as separate modules.

#### Trailing Middleware

Conclude the app by using the typical trailing middleware:

    app.use(junction.serviceUnavailable());
       .use(junction.errorHandler());

`serviceUnavailable` middleware responds with a `service-unavailable` stanza
error when other XMPP entities send the application a request that it doesn't
support.  This is recommended for well-behaved XMPP applications.

`errorHandler` middleware will respond with stanza errors when the application
encounters an error condition.

These middleware should be used _last_ in the stack, ensuring that other
middleware take priority.

#### Connect to XMPP Network

With the app configured, connect to the XMPP network.

    app.connect({ jid: 'user@jabber.org', password: 's3cr3t' }).on('online', function() {
      console.log('connected as: ' + this.jid);
      this.send(new Presence());
    });

Junction uses [node-xmpp](https://github.com/astro/node-xmpp) for the underlying
connection, allowing apps to connect as clients, components, or any other
supported connection type.

## Frameworks

At its core, XMPP is a protocol that allows structured data to be exchanged in
real-time between entities on the network.  While typically used for instant
messaging and presence, numerous XMPP extension protocols (known as XEPs) are
available which make XMPP broadly applicable to non-IM applications.

These XEPs build on XMPP's core, while defining their own higher-level
semantics.  Junction-based frameworks implement support for these extensions,
building on essential middleware and enhancing it with tooling designed to
support development of applications making use of the XEP.

<table>
  <thead>
    <tr><th>Framework</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="https://github.com/jaredhanson/junction-disco">Disco</a></td><td>Service Discovery (<a href="http://xmpp.org/extensions/xep-0030.html">XEP-0030</a>) framework.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-pubsub">PubSub</a></td><td>Publish-Subscribe (<a href="http://xmpp.org/extensions/xep-0060.html">XEP-0060</a>) framework.</td></tr>
  </tbody>
</table>

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/junction.png)](http://travis-ci.org/jaredhanson/junction)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
