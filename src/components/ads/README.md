# Ad isolation

The configured banner and container loaders in `ad-units.ts` run inside per-slot sandboxed iframes, not in the main React document. The sandbox allows scripts and popup links while blocking top-level navigation unless the browser reports user activation. It intentionally omits `allow-same-origin`; providers that require access to the parent page or same-origin APIs may not render correctly and should be disabled rather than granted broader access.

No Social Bar unit is configured. Do not add a page-level Social Bar script; use only a provider integration that supports the same iframe isolation, or leave that format disabled. If the `container-banner` unit is incompatible with sandboxing, remove that unit from `ad-units.ts` and remove its `data-unit-id="container-banner"` slots.

`allow-popups` is retained for user-clicked ad links, so popup behavior still depends on each browser's popup-blocking and user-activation policy; sandboxing alone cannot guarantee that a browser will reject every unsolicited popup. If a unit opens a popup without a user action, disable that unit or obtain a provider tag that opens only from an actual user activation. The provider controls the remote script contents, so verify each format in real browsers after deployment.

In development, the browser console identifies each sandboxed unit and reports provider-script load failures and repeat iframe loads, without recording visitor data. No site-wide CSP sandbox is applied.
