import { useEffect } from "react";
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
  isAsync = false
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      // cleanup and resolve false on timeout
      const existing = container.querySelector('script[src="' + src + '"]');
      if (existing) container.removeChild(existing);
      resolve(false);
    }, timeoutMs);

    const scr = document.createElement('script');
    scr.async = isAsync;
    scr.src = src;
    scr.addEventListener('load', () => {
      clearTimeout(timeout);
      // keep the script node; React will reconcile it
      resolve(true);
    });
    scr.addEventListener('error', () => {
      clearTimeout(timeout);
      container.removeChild(scr);
      resolve(false);
    });
    container.appendChild(scr);
  });
}

export function AdInjector() {
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
        const wrapper = document.querySelector(
          `div[data-unit-id="${unitId}"]`
        ) as HTMLElement | null;
        // Unit not placed on this page (pages embed a subset of the units).
        if (!wrapper) continue;

        if (
          (unitId === 'social-bar' || unitId === 'rect-300x250') &&
          window.matchMedia('(max-width: 639px)').matches
        ) {
          continue;
        }

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
            wrapper.appendChild(scr);
            // Social Bar self‑initialises; mark loaded.
            wrapper.setAttribute('data-loaded', 'true');
            continue;
          }

          if (unit.containerId) {
            // Official Adsterra snippet order: the container div must exist
            // first, then the loader script (async). The script derives its
            // container id as "container-<placementKey>" and finds it via
            // document.getElementById, so the div is created before loading.
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

            // Actually load the unit's script (async, as in the official
            // code) and wait for its real load event instead of guessing.
            const success = await waitForExternalScript(
              unit.scriptSrc!,
              wrapper,
              5000,
              true // official snippet loads this unit's script with async
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
            5000
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
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}