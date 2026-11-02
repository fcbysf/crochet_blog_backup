import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adUnits } from "./ad-units";

const SANDBOX_PERMISSIONS = [
  "allow-scripts",
  "allow-popups",
  "allow-popups-to-escape-sandbox",
  "allow-top-navigation-by-user-activation",
];

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildAdDocument(unit: (typeof adUnits)[number]) {
  const container = unit.containerId
    ? `<div id="${escapeHtmlAttribute(unit.containerId)}"></div>`
    : "";
  const atOptions = unit.atOptions
    ? `<script>window.atOptions = ${JSON.stringify(unit.atOptions).replaceAll("<", "\\u003c")};</script>`
    : "";
  const attributes = Object.entries(unit.attributes ?? {})
    .map(([name, value]) => `${name}="${escapeHtmlAttribute(value)}"`)
    .join(" ");
  const asyncAttribute = unit.async ? "async" : "";
  const scriptCallbacks =
    ` onload="parent.postMessage({type:'ad-script-loaded'}, '*')"` +
    ` onerror="parent.postMessage({type:'ad-script-error'}, '*')"`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html, body { box-sizing: border-box; margin: 0; width: 100%; min-height: 100%; overflow: hidden; }
      body { display: flex; justify-content: center; align-items: flex-start; }
      #ad-slot { display: flex; justify-content: center; width: 100%; min-height: ${unit.height}px; }
      #ad-slot iframe { max-width: 100%; }
    </style>
  </head>
  <body>
    <div id="ad-slot">${container}</div>
    ${atOptions}
    <script src="${escapeHtmlAttribute(unit.scriptSrc)}" ${asyncAttribute} ${attributes}${scriptCallbacks}></script>
  </body>
</html>`;
}

function addAdFrame(wrapper: HTMLElement, unit: (typeof adUnits)[number]) {
  const frame = document.createElement("iframe");
  frame.dataset.adUnitFrame = unit.id;
  frame.title = `Advertisement: ${unit.id}`;
  frame.name = `ad-unit-${unit.id}`;
  frame.setAttribute("sandbox", SANDBOX_PERMISSIONS.join(" "));
  frame.style.display = "block";
  frame.style.width = "100%";
  frame.style.maxWidth = unit.width ? `${unit.width}px` : "100%";
  frame.style.height = `${unit.height}px`;
  frame.style.border = "0";
  frame.style.marginInline = "auto";

  let loadCount = 0;
  frame.addEventListener("load", () => {
    loadCount += 1;

    if (import.meta.env.DEV) {
      console.debug(
        `[ads] "${unit.id}" sandbox frame ${loadCount === 1 ? "loaded" : "navigated or reloaded"}`
      );
    }
  });

  frame.srcdoc = buildAdDocument(unit);
  wrapper.appendChild(frame);

  if (import.meta.env.DEV) {
    console.info(`[ads] initialized sandboxed unit "${unit.id}"`, {
      scriptHost: new URL(unit.scriptSrc).hostname,
      sandbox: SANDBOX_PERMISSIONS,
    });
  }
}

export function AdInjector() {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleAdMessage = (event: MessageEvent<unknown>) => {
      if (
        typeof event.data !== "object" ||
        event.data === null ||
        !("type" in event.data) ||
        typeof event.data.type !== "string"
      ) {
        return;
      }

      const frame = Array.from(
        document.querySelectorAll<HTMLIFrameElement>("iframe[data-ad-unit-frame]")
      ).find((candidate) => candidate.contentWindow === event.source);
      const unitId = frame?.dataset.adUnitFrame;
      if (!frame || !unitId) return;

      if (event.data.type === "ad-script-loaded") {
        frame.closest<HTMLElement>("[data-unit-id]")?.setAttribute("data-loaded", "true");
        if (import.meta.env.DEV) {
          console.debug(`[ads] provider script loaded for "${unitId}"`);
        }
      } else if (event.data.type === "ad-script-error") {
        const unit = adUnits.find((candidate) => candidate.id === unitId);
        if (unit) {
          window.dispatchEvent(
            new CustomEvent("ad-resource-error", {
              detail: { src: unit.scriptSrc },
            })
          );
        }
        if (import.meta.env.DEV) {
          console.error(`[ads] provider script failed to load for "${unitId}"`);
        }
      }
    };

    window.addEventListener("message", handleAdMessage);

    const injectAds = () => {
      for (const unit of adUnits) {
        const wrappers = Array.from(
          document.querySelectorAll<HTMLElement>(`[data-unit-id="${unit.id}"]`)
        ).filter((wrapper) => wrapper.getClientRects().length > 0);

        for (const wrapper of wrappers) {
          if (wrapper.querySelector("iframe[data-ad-unit-frame]")) {
            continue;
          }

          addAdFrame(wrapper, unit);
        }
      }
    };

    injectAds();
    const observer = new MutationObserver(injectAds);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("message", handleAdMessage);
    };
  }, [pathname]);

  return null;
}
