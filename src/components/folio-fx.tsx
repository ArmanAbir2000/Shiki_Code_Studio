import { useEffect } from "react";

/**
 * Portfolio motion layer for the folio theme — progress bar, scroll reveals,
 * hero letter stagger, rail scroll-spy, sibling dimming, custom cursor,
 * copy-to-clipboard and toast. Mirrors arman-abir-portfolio/script.js
 * behaviours in React-safe form (all listeners cleaned up on unmount).
 */
export function FolioFx() {
  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    /* ---- toast ---- */
    let toastTimer = 0;
    const toast = (msg: string) => {
      const el = document.querySelector(".fl-toast");
      if (!el) return;
      el.textContent = msg;
      el.classList.add("show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(
        () => el.classList.remove("show"),
        2200,
      );
    };
    const onFolioToast = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail) toast(detail);
    };
    window.addEventListener("folio:toast", onFolioToast);
    cleanups.push(() => window.removeEventListener("folio:toast", onFolioToast));

    /* ---- hero letter stagger (WAAPI, skipped on reduced motion) ---- */
    if (!reduced) {
      document.querySelectorAll(".fl-name .fl-hl").forEach((el) => {
        const i = parseInt(
          (el as HTMLElement).style.getPropertyValue("--i"),
          10,
        ) || 0;
        (el as HTMLElement).animate(
          [
            { transform: "translateY(110%)", opacity: 0 },
            { transform: "none", opacity: 1 },
          ],
          {
            duration: 900,
            delay: 120 + i * 55,
            easing: "cubic-bezier(.22,.8,.22,1)",
            fill: "backwards",
          },
        );
      });
      document.body.classList.add("fl-loaded");
    } else {
      document.body.classList.add("fl-loaded");
    }

    /* ---- touch stand-in for the hover choreography ----
       The plate physics and the outline fills are driven by :hover, so a
       phone never sees the folio's signature motion. On a coarse pointer,
       drive the same states from scroll position: an element lights up
       while it sits in the middle band of the viewport. */
    const LIVE_SEL = ".fl-media, .fl-cs-bleed, .fl-big, .fl-words .fl-outline";
    const liveSeen = new WeakSet<Element>();
    let liveIo: IntersectionObserver | null = null;
    if (!fine && !reduced && "IntersectionObserver" in window) {
      liveIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) =>
            en.target.classList.toggle("fl-live", en.isIntersecting),
          );
        },
        { rootMargin: "-28% 0px -28% 0px" },
      );
      cleanups.push(() => liveIo?.disconnect());
    }
    const liveOn = (el: Element) => {
      if (!liveIo || liveSeen.has(el)) return;
      liveSeen.add(el);
      liveIo.observe(el);
    };

    /* ---- scroll reveals (also catches nodes added later, e.g. Convex data) ---- */
    const rvSeen = new WeakSet<Element>();
    let io: IntersectionObserver | null = null;
    const revealOn = (el: Element) => {
      if (rvSeen.has(el)) return;
      rvSeen.add(el);
      if (!io) el.classList.add("on");
      else io.observe(el);
    };
    if (!("IntersectionObserver" in window)) {
      Array.from(document.querySelectorAll(".fl-rv")).forEach(revealOn);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("on");
              io?.unobserve(en.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      Array.from(document.querySelectorAll(".fl-rv")).forEach(revealOn);
      const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.classList.contains("fl-rv")) revealOn(node);
            node.querySelectorAll?.(".fl-rv").forEach(revealOn);
            if (node.matches?.(LIVE_SEL)) liveOn(node);
            node.querySelectorAll?.(LIVE_SEL).forEach(liveOn);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      cleanups.push(() => {
        mo.disconnect();
        io?.disconnect();
      });
    }
    Array.from(document.querySelectorAll(LIVE_SEL)).forEach(liveOn);

    /* ---- progress bar + scrolled flag + rail spy ---- */
    const prog = document.querySelector(".fl-prog") as HTMLElement | null;
    const rail = Array.from(
      document.querySelectorAll(".fl-rail a"),
    ) as HTMLAnchorElement[];
    const sections = rail
      .map((a) => document.querySelector(a.getAttribute("href") || ""))
      .filter((el): el is Element => !!el);
    let ticking = false;
    const update = () => {
      const y = window.scrollY || window.pageYOffset;
      const h =
        document.documentElement.scrollHeight - window.innerHeight;
      if (prog) {
        prog.style.transform =
          "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
      }
      document.body.classList.toggle("fl-scrolled", y > 40);
      let active = -1;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          active = i;
        }
      });
      rail.forEach((a, i) => {
        const on = i === active;
        a.classList.toggle("on", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    update();

    /* ---- sibling dimming on spreads (desktop only, delegated for async lists) ---- */
    if (fine && !reduced) {
      const onOver = (e: MouseEvent) => {
        const el = (e.target as Element).closest?.(".fl-spread");
        if (!el) return;
        el.parentElement
          ?.querySelectorAll(".fl-spread")
          .forEach((o) => {
            if (o !== el) o.classList.add("dim");
          });
      };
      const onOut = (e: MouseEvent) => {
        const el = (e.target as Element).closest?.(".fl-spread");
        if (!el) return;
        const to = (e.relatedTarget as Element | null)?.closest?.(".fl-spread");
        if (to === el) return;
        el.parentElement
          ?.querySelectorAll(".fl-spread")
          .forEach((o) => o.classList.remove("dim"));
      };
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);
      cleanups.push(() => {
        document.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseout", onOut);
      });
    }

    /* ---- custom cursor (fine pointer, no reduced motion) ---- */
    if (fine && !reduced) {
      const cur = document.querySelector(".fl-cur") as HTMLElement | null;
      const tag = cur?.querySelector(".fl-cur-tag") as HTMLElement | null;
      if (cur && tag) {
        document.body.classList.add("fl-cur-on");
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let tx = x;
        let ty = y;
        let raf = 0;
        const onMove = (e: PointerEvent) => {
          tx = e.clientX;
          ty = e.clientY;
          cur.style.opacity = "1";
          const hit = (e.target as Element).closest?.(
            "[data-cursor],a,button",
          );
          if (!hit) {
            cur.classList.remove("tag", "big");
            return;
          }
          const label = hit.getAttribute("data-cursor");
          if (label) {
            tag.textContent = label;
            cur.classList.add("tag");
            cur.classList.remove("big");
          } else {
            cur.classList.remove("tag");
            cur.classList.add("big");
          }
        };
        const onLeave = () => {
          cur.style.opacity = "0";
        };
        const loop = () => {
          x += (tx - x) * 0.22;
          y += (ty - y) * 0.22;
          cur.style.transform =
            "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
          raf = requestAnimationFrame(loop);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        raf = requestAnimationFrame(loop);
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
          cancelAnimationFrame(raf);
          document.body.classList.remove("fl-cur-on");
        });
      }
    }

    /* ---- copy-to-clipboard ---- */
    const onClick = (e: MouseEvent) => {
      const hit = (e.target as Element).closest?.("[data-copy]");
      if (!hit) return;
      const text = hit.getAttribute("data-copy") || "";
      if (!text) return;
      const done = () => toast("COPIED — " + text);
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, () => done());
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
          done();
        } catch {
          toast(text);
        }
        document.body.removeChild(ta);
      }
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    return () => {
      cleanups.forEach((fn) => fn());
      window.clearTimeout(toastTimer);
    };
  }, []);

  return (
    <>
      <div className="fl-prog" aria-hidden="true" />
      <div className="fl-cur" aria-hidden="true">
        <span className="fl-cur-dot" />
        <span className="fl-cur-tag">VIEW</span>
      </div>
      <div className="fl-toast" role="status" aria-live="polite" />
    </>
  );
}

/** Fire a folio toast from anywhere (e.g. the theme toggle). */
export function folioToast(msg: string) {
  window.dispatchEvent(new CustomEvent("folio:toast", { detail: msg }));
}
