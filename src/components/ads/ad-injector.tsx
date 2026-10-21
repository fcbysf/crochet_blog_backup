import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adUnits } from "./ad-units";

const INJECTION_ORDER = [
  'social-bar',
  'container-banner',
  'banner-320x50',
  'rect-300x250',
  'skyscraper-160x300',
  'leader-468x60',
  'leader-728x90',
];
const AD_SCRIPT_TIMEOUT_MS = 15000;

function reportAdScriptError(src: string) {
  window.dispatchEvent(
    new CustomEvent('ad-resource-error', { detail: { src } })
  );
}

// Sets window.atOptions inline by injecting a <script> tag into the wrapper.
// The script runs synchronously when appended; we keep it in the DOM.
function setAtOptionsInline(code: string, container: HTMLElement) {
  const s = document.createElement('script');
  s.text = code;
  container.appendChild(s);
  // inline script executes immediately; we retain the node so React doesn't remove it.
}

// Loads an external script (the Adsterra loader) and waits for its 'load'
// event (or timeout), and resolves.
// By default loads synchronously (async=false); pass async=true for units
// whose official snippet uses <script async>.
// The script is appended to `container` so it stays scoped to the ad slot.
async function waitForExternalScript(
  src: string,
  container: HTMLElement,
  timeoutMs = 5000,
  isAsync = false,
  attributes?: Record<string, string>
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      // cleanup and resolve false on timeout
      const existing = container.querySelector('script[src="' + src + '"]');
      if (existing) container.removeChild(existing);
      reportAdScriptError(src);
      resolve(false);
    }, timeoutMs);

    const scr = document.createElement('script');
    scr.async = isAsync;
    Object.entries(attributes ?? {}).forEach(([name, value]) => {
      scr.setAttribute(name, value);
    });
    scr.src = src;
    scr.addEventListener('load', () => {
      clearTimeout(timeout);
      // keep the script node; React will reconcile it
      resolve(true);
    });
    scr.addEventListener('error', () => {
      clearTimeout(timeout);
      reportAdScriptError(src);
      container.removeChild(scr);
      resolve(false);
    });
    container.appendChild(scr);
  });
}

export function AdInjector() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Set when this page unmounts (client-side navigation or StrictMode
    // re-run) so an in-flight loop stops instead of injecting into another
    // page's wrappers. In StrictMode the remounted effect starts a fresh
    // loop; the per-wrapper script[src] guard below prevents duplicates.
    let cancelled = false;

    (async () => {
      for (const unitId of INJECTION_ORDER) {
        if (cancelled) return;

        const unit = adUnits.find((u) => u.id === unitId);
        if (!unit) continue;

        // Find the wrapper div that already exists in the current page DOM.
        const visibleWrappers = Array.from(
          document.querySelectorAll<HTMLElement>(`div[data-unit-id="${unitId}"]`)
        ).filter((candidate) => candidate.getClientRects().length > 0);
        const wrappers = unit.isSocialBar
          ? visibleWrappers.slice(0, 1)
          : visibleWrappers;
        // Unit not placed on this page (pages embed a subset of the units).
        if (wrappers.length === 0) continue;

        for (const wrapper of wrappers) {
          if (cancelled) return;

          // Duplicate-init guard: never append this unit's loader script twice
          // into the same wrapper (StrictMode / navigation edge cases).
          if (
            unit.scriptSrc &&
            wrapper.querySelector(`script[src="${unit.scriptSrc}"]`)
          ) {
            continue;
          }

          try {
            if (unit.isSocialBar) {
              // Social Bar: Adsterra's own script; append to wrapper.
              const scr = document.createElement('script');
              scr.async = false;
              scr.setAttribute('data-cfasync', 'false');
              scr.src = unit.scriptSrc!;
              scr.addEventListener('error', () => reportAdScriptError(scr.src));
              wrapper.appendChild(scr);
              // Social Bar self-initialises; mark loaded.
              wrapper.setAttribute('data-loaded', 'true');
              continue;
            }

            if (unit.containerId) {
              // Official Adsterra snippet order: the container div must exist
              // first, then the loader script (async), so create it before loading.
              let containerDiv = wrapper.querySelector(
                `#${unit.containerId}`
              ) as HTMLDivElement | null;
              if (!containerDiv) {
                containerDiv = document.createElement('div');
                containerDiv.id = unit.containerId;
                containerDiv.style.width = '100%';
                containerDiv.style.height = '250px';
                wrapper.appendChild(containerDiv);
              }

              const success = await waitForExternalScript(
                unit.scriptSrc!,
                wrapper,
                AD_SCRIPT_TIMEOUT_MS,
                true,
                unit.attributes
              );
              if (success) {
                wrapper.setAttribute('data-loaded', 'true');
              }
              continue;
            }

            // Units with atOptions: set atOptions inline first, then load external script.
            setAtOptionsInline(unit.inlineCode!, wrapper);

            const success = await waitForExternalScript(
              unit.scriptSrc!,
              wrapper,
              AD_SCRIPT_TIMEOUT_MS,
              false,
              unit.attributes
            );
            if (success) {
              wrapper.setAttribute('data-loaded', 'true');
            }
          } catch (e) {
            console.error(
              `AdInjector: unit "${unitId}" injection failed`,
              e
            );
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}