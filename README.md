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
