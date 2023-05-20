# HTMX • [TodoMVC](http://todomvc.com)

[See the live example.](https://jon49.github.io/htmx-todomvc/)

> htmx gives you access to AJAX, CSS Transitions, WebSockets and Server Sent
> Events directly in HTML, using attributes, so you can build modern user
> interfaces with the simplicity and power of hypertext

## Resources

- [Website](https://htmx.org/)

### Articles

- [Interesting article](https://htmx.org/essays/)

### Support

- [Stack Overflow](http://stackoverflow.com/questions/tagged/htmx)
- [Twitter](https://twitter.com/htmx_org)

## Implementation

This probably doesn't follow the spec exactly as I was mixing some things and
threw it together as fast as I could. But it should be navigable and easy to see
how it is put together. I opted to use my own custom jQuery-like library for
simplicity and it keeps the code base much smaller.

Normally, in offline-first websites I use
[`html-template-tag-stream`](https://github.com/jon49/html-template-tag-async)
instead of `html-template-tag` that way I'm not combining strings but streaming
them instead. But I decided to just keep it simple here to not distract from the
HTMX example. I also create a more robust router — but I opted for a simple
`if`/`switch` statements instead.

It is necessary to render the whole page from the service worker to keep things
simple.

All front end state is done on the front end. This keeps things simple and makes
it so I don't have to redo the same code on the back end and on the front end.

Normally I do an updater for the service worker too. But I didn't do it here.
Normally I validate data and such too. But I also skipped that. It would be
simple to add.

Mixing HTMX with my jQuery-like library was a real joy and made making this app
simple and enjoyable.

The build could be cleaned up. Like having `esbuild` build the different entry
points. Also, making it cross platform would make it nicer. Maybe I'll do that
in the future ☺.

## Credit

Created by [Jon Nyman](http://jnyman.com)
