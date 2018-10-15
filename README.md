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
      .use(junction.presenceParser());

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
    
Junction provides [bundled middleware](https://github.com/jaredhanson/junction/tree/master/lib/junction/middleware)
to handle core XMPP functionality.  Additional middleware and higher-level
frameworks are available as separate modules.

#### Trailing Middleware

Conclude the app by using the typical trailing middleware:

    app.use(junction.serviceUnavailable())
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

## Middleware

Additional middleware is available to parse non-core extension elements commonly
found in stanzas.  Some middleware implement complete support for simple XEPs
that don't justify the need for a full-fledged framework.

<table>
  <thead>
    <tr><th>Middleware</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><a href="https://github.com/jaredhanson/junction-attention">junction-attention</a></td><td>Attention (<a href="http://xmpp.org/extensions/xep-0224.html">XEP-0224</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-delay">junction-delay</a></td><td>Delayed Delivery (<a href="http://xmpp.org/extensions/xep-0203.html">XEP-0203</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-lastactivity">junction-lastactivity</a></td><td>Last Activity (<a href="http://xmpp.org/extensions/xep-0012.html">XEP-0012</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-legacy-delay">junction-legacy-delay</a></td><td>Legacy Delayed Delivery (<a href="http://xmpp.org/extensions/xep-0091.html">XEP-0091</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-legacy-time">junction-legacy-time</a></td><td>Legacy Entity Time (<a href="http://xmpp.org/extensions/xep-0090.html">XEP-0090</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-nickname">junction-nickname</a></td><td>User Nickname (<a href="http://xmpp.org/extensions/xep-0172.html">XEP-0172</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-ping">junction-ping</a></td><td>XMPP Ping (<a href="http://xmpp.org/extensions/xep-0199.html">XEP-0199</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-softwareversion">junction-softwareversion</a></td><td>Software Version (<a href="http://xmpp.org/extensions/xep-0092.html">XEP-0092</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/jaredhanson/junction-time">junction-time</a></td><td>Entity Time (<a href="http://xmpp.org/extensions/xep-0202.html">XEP-0202</a>) middleware.</td></tr>
    <tr><td><a href="https://github.com/Daniel15/junction-caps">junction-caps</a></td><td>Entity Capabilities (<a href="http://xmpp.org/extensions/xep-0115.html">XEP-0115</a>) middleware.</td></tr>
  </tbody>
</table>

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/junction.png)](http://travis-ci.org/jaredhanson/junction)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2017 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/junction'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/junction.svg' /></a>
