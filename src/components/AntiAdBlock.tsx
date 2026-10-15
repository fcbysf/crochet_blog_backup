import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DETECTION_DELAY_MS = 1200;
const AD_SCRIPT_FAILURE_THRESHOLD = 3;
const AD_SCRIPT_FAILURE_WINDOW_MS = 10000;
const AD_SCRIPT_HOSTS = new Set(["abscloud.org", "bauval.org"]);

function hasVisibleBox(element: HTMLElement) {
  const styles = window.getComputedStyle(element);
  const bounds = element.getBoundingClientRect();

  return (
    styles.display !== "none" &&
    styles.visibility !== "hidden" &&
    Number(styles.opacity) !== 0 &&
    bounds.width > 0 &&
    bounds.height > 0
  );
}

function isAdBaitBlocked(element: HTMLElement) {
  return !element.isConnected || !hasVisibleBox(element);
}

export default function AntiAdBlock() {
  const [blocked, setBlocked] = useState(false);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const failedAdScripts = new Set<string>();
    const observedAdSlots = new Set<string>();
    const blockedAdSlots = new Set<string>();
    let failureWindowStartedAt: number | null = null;
    let blockedSlotWindowStartedAt: number | null = null;

    const noteBlockedAdSlot = (slotId: string) => {
      const now = Date.now();
      if (
        blockedSlotWindowStartedAt === null ||
        now - blockedSlotWindowStartedAt > AD_SCRIPT_FAILURE_WINDOW_MS
      ) {
        blockedAdSlots.clear();
        blockedSlotWindowStartedAt = now;
      }
      blockedAdSlots.add(slotId);
      if (blockedAdSlots.size >= 2) setBlocked(true);
    };

    const inspectAdSlots = () => {
      document.querySelectorAll<HTMLElement>("[data-unit-id]").forEach((slot) => {
        const slotId = slot.dataset.unitId;
        if (!slotId || slot.dataset.loaded !== "true" || !hasVisibleBox(slot)) {
          return;
        }

        const hasVisibleCreative = Array.from(
          slot.querySelectorAll<HTMLIFrameElement>("iframe"),
        ).some(hasVisibleBox);

        if (hasVisibleCreative) {
          observedAdSlots.add(slotId);
        } else if (observedAdSlots.has(slotId)) {
          noteBlockedAdSlot(slotId);
        }
      });
    };

    const handleAdResourceError = (event: Event) => {
      const { src } = (event as CustomEvent<{ src: string }>).detail ?? {};
      if (!src) return;

      try {
        const url = new URL(src);
        if (!AD_SCRIPT_HOSTS.has(url.hostname)) return;

        const now = Date.now();
        if (
          failureWindowStartedAt === null ||
          now - failureWindowStartedAt > AD_SCRIPT_FAILURE_WINDOW_MS
        ) {
          failedAdScripts.clear();
          failureWindowStartedAt = now;
        }
        failedAdScripts.add(url.href);
        if (failedAdScripts.size >= AD_SCRIPT_FAILURE_THRESHOLD) {
          setBlocked(true);
        }
      } catch {
        return;
      }
    };
    window.addEventListener("ad-resource-error", handleAdResourceError);

    const adSlotObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        const target =
          record.target instanceof Element
            ? record.target
            : record.target.parentElement;
        const slot = target?.closest<HTMLElement>("[data-unit-id]");
        if (!slot?.isConnected || slot.dataset.loaded !== "true") return;

        const removedCreative = Array.from(record.removedNodes).some(
          (node) =>
            node instanceof HTMLIFrameElement ||
            (node instanceof Element &&
              (node.matches("iframe") || node.querySelector("iframe"))),
        );
        const slotId = slot.dataset.unitId;
        if (
          removedCreative &&
          slotId &&
          (hasVisibleBox(slot) || observedAdSlots.has(slotId))
        ) {
          noteBlockedAdSlot(slotId);
        }
      });
      inspectAdSlots();
    });
    adSlotObserver.observe(document.body, { childList: true, subtree: true });
    const adSlotCheck = window.setInterval(inspectAdSlots, 750);

    const bait = document.createElement("div");
    bait.className = "ad-placement adsbox ad-banner";
    bait.setAttribute("aria-hidden", "true");
    Object.assign(bait.style, {
      position: "absolute",
      left: "-10000px",
      top: "0",
      width: "10px",
      height: "10px",
      overflow: "hidden",
      visibility: "visible",
      opacity: "1",
      pointerEvents: "none",
    });
    document.body.appendChild(bait);

    const timer = window.setTimeout(() => {
      if (isAdBaitBlocked(bait)) setBlocked(true);
      bait.remove();
    }, DETECTION_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(adSlotCheck);
      adSlotObserver.disconnect();
      window.removeEventListener("ad-resource-error", handleAdResourceError);
      bait.remove();
    };
  }, []);

  useEffect(() => {
    if (!blocked) return;

    const appRoot = document.getElementById("root");
    const previousOverflow = document.body.style.overflow;
    const wasInert = appRoot?.inert ?? false;
    document.body.style.overflow = "hidden";
    if (appRoot) appRoot.inert = true;

    const preventEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("keydown", preventEscape, true);
    refreshButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (appRoot) appRoot.inert = wasInert;
      document.removeEventListener("keydown", preventEscape, true);
    };
  }, [blocked]);

  if (!blocked) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center overflow-y-auto bg-black/75 p-4">
      <section
        aria-labelledby="anti-adblock-title"
        aria-modal="true"
        className="w-full max-w-lg border border-white/15 bg-zinc-950 p-6 text-center text-white shadow-2xl sm:p-10"
        role="alertdialog"
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl" id="anti-adblock-title">
          Ad Blocker Detected!
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-200">
          It looks like you're using an ad blocker. Our website relies on advertising to provide free crochet patterns.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Please disable your ad blocker and refresh the page to continue browsing.
        </p>
        <button
          className="mt-7 w-full bg-rose-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
          onClick={() => window.location.reload()}
          ref={refreshButtonRef}
          type="button"
        >
          I've Disabled AdBlock {"\u2014"} Refresh
        </button>
      </section>
    </div>,
    document.body,
  );
}