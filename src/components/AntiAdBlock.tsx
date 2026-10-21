import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AD_SCRIPT_FAILURE_THRESHOLD = 3;
const AD_SCRIPT_FAILURE_WINDOW_MS = 30000;
const DESKTOP_BLOCKED_AD_SLOT_THRESHOLD = 2;
const MOBILE_BLOCKED_AD_SLOT_THRESHOLD = 3;
const REMOVED_CREATIVE_CONFIRMATION_MS = 1500;
const AD_SCRIPT_HOSTS = new Set(["abscloud.org", "bauval.org"]);
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

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

export default function AntiAdBlock() {
  const [blocked, setBlocked] = useState(false);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (LOCAL_HOSTNAMES.has(window.location.hostname)) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const observedAdSlots = new WeakSet<HTMLElement>();
    const blockedAdSlots = new Set<HTMLElement>();
    const failedAdScripts = new Set<string>();
    let blockedSlotWindowStartedAt: number | null = null;
    let failureWindowStartedAt: number | null = null;

    const noteBlockedAdSlot = (slot: HTMLElement) => {
      const now = Date.now();
      if (
        blockedSlotWindowStartedAt === null ||
        now - blockedSlotWindowStartedAt > AD_SCRIPT_FAILURE_WINDOW_MS
      ) {
        blockedAdSlots.clear();
        blockedSlotWindowStartedAt = now;
      }
      blockedAdSlots.add(slot);
      const threshold = isMobile
        ? MOBILE_BLOCKED_AD_SLOT_THRESHOLD
        : DESKTOP_BLOCKED_AD_SLOT_THRESHOLD;
      if (blockedAdSlots.size >= threshold) setBlocked(true);
    };

    const inspectAdSlots = () => {
      document.querySelectorAll<HTMLElement>("[data-unit-id]").forEach((slot) => {
        if (!slot.dataset.unitId || slot.dataset.loaded !== "true" || !hasVisibleBox(slot)) {
          return;
        }

        const hasVisibleCreative = Array.from(
          slot.querySelectorAll<HTMLIFrameElement>("iframe"),
        ).some(hasVisibleBox);

        if (hasVisibleCreative) {
          observedAdSlots.add(slot);
        }
      });
    };

    const handleAdResourceError = (event: Event) => {
      if (isMobile) return;

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
          observedAdSlots.has(slot)
        ) {
          window.setTimeout(() => {
            if (!slot.isConnected || !hasVisibleBox(slot)) return;

            const hasVisibleCreative = Array.from(
              slot.querySelectorAll<HTMLIFrameElement>("iframe"),
            ).some(hasVisibleBox);
            if (!hasVisibleCreative) noteBlockedAdSlot(slot);
          }, REMOVED_CREATIVE_CONFIRMATION_MS);
        }
      });
      inspectAdSlots();
    });
    adSlotObserver.observe(document.body, { childList: true, subtree: true });
    const adSlotCheck = window.setInterval(inspectAdSlots, 750);

    return () => {
      window.clearInterval(adSlotCheck);
      adSlotObserver.disconnect();
      window.removeEventListener("ad-resource-error", handleAdResourceError);
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
          Ads Could Not Load
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-200">
          Some ad content could not load. This can happen when an ad blocker is enabled or when the ad service or connection is unavailable.
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Check your connection or ad-blocking settings, then retry.
        </p>
        <button
          className="mt-7 w-full bg-rose-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
          onClick={() => window.location.reload()}
          ref={refreshButtonRef}
          type="button"
        >
          Retry
        </button>
      </section>
    </div>,
    document.body,
  );
}