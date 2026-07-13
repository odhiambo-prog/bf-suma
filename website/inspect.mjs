import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const DESKTOP = { width: 1366, height: 900 };
const OUTDIR = "/tmp";

async function findSuccessStories(page) {
  return page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("*"));
    const heading = all.find(
      (el) =>
        (el.tagName === "H1" ||
          el.tagName === "H2" ||
          el.tagName === "H3" ||
          el.dataset?.testid) &&
        /our success stories/i.test(el.textContent || "")
    );
    if (!heading) return { found: false };

    // Walk up to the enclosing <section>
    let section = heading;
    while (section && section.tagName !== "SECTION") section = section.parentElement;
    if (!section) section = heading.closest("section, [class*='section']") || heading.parentElement;

    // Find the grid container inside the section
    const grid =
      section.querySelector(".grid") ||
      section.querySelector('[class*="grid-cols"]') ||
      Array.from(section.querySelectorAll("*")).find((el) =>
        /(^|\s)grid(\s|$)/.test(el.className || "")
      );

    const cards = grid
      ? Array.from(grid.children).filter((c) => /(^|\s)group(\s|$)|card/i.test(c.className || "") || c.querySelector("img"))
      : [];

    const sample = cards[0];
    const cs = sample ? getComputedStyle(sample) : null;

    return {
      found: true,
      headingText: heading.textContent.trim(),
      sectionClass: section.className,
      gridClass: grid ? grid.className : null,
      cardCount: cards.length,
      gridComputed: grid
        ? {
            display: getComputedStyle(grid).display,
            gridTemplateColumns: getComputedStyle(grid).gridTemplateColumns,
            gap: getComputedStyle(grid).gap,
          }
        : null,
      sampleCard: sample
        ? {
            className: sample.className,
            outerHTML: sample.outerHTML.slice(0, 1200),
            computedHeight: cs ? cs.height : null,
            computedWidth: cs ? cs.width : null,
            ring: cs ? cs.boxShadow : null,
          }
        : null,
    };
  });
}

async function findBottomRightOverlay(page) {
  return page.evaluate(
    ({ vw, vh }) => {
      const candidates = [];
      const all = Array.from(document.querySelectorAll("*"));
      for (const el of all) {
        const cs = getComputedStyle(el);
        const pos = cs.position;
        if (pos !== "fixed" && pos !== "absolute") continue;
        const rect = el.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) continue;
        const rightDist = vw - rect.right;
        const bottomDist = vh - rect.bottom;
        const nearBottomRight = rightDist <= 400 && bottomDist <= 400;

        // Background near-white check
        const bg = cs.backgroundColor || cs.background || "";
        let isLight = false;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const [r, g, b] = [+m[1], +m[2], +m[3]];
          isLight = r > 220 && g > 220 && b > 220;
        }

        const text = (el.textContent || "").trim();
        const isChat =
          /whatsapp|talk to us|chat|message us/i.test(text) ||
          /whatsapp|chat/i.test(el.className || "");

        if (nearBottomRight && (isLight || isChat)) {
          candidates.push({
            tagName: el.tagName,
            className: el.className,
            position: pos,
            right: cs.right,
            bottom: cs.bottom,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            backgroundColor: bg,
            zIndex: cs.zIndex,
            isChatLike: isChat,
            snippet: el.outerHTML.slice(0, 400),
          });
        }
      }
      return candidates;
    },
    { vw: 1366, vh: 900 }
  );
}

async function shoot(page, path) {
  await page.screenshot({ path, fullPage: false });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: DESKTOP });

  // ---- /joinus ----
  await page.goto("https://bfsumaeagleshop.com/joinus", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(1500);
  await shoot(page, `${OUTDIR}/joinus.png`);
  const success = await findSuccessStories(page);
  writeFileSync(
    `${OUTDIR}/joinus-success.json`,
    JSON.stringify(success, null, 2)
  );

  const joinusOverlay = await findBottomRightOverlay(page);
  writeFileSync(
    `${OUTDIR}/joinus-overlay.json`,
    JSON.stringify(joinusOverlay, null, 2)
  );

  // CTA + footer region on /joinus
  const joinusCta = await page.evaluate(() => {
    const footer = document.querySelector("footer");
    const cta = Array.from(document.querySelectorAll("*")).find((el) =>
      /(^|\s)cta(\s|$)/i.test(el.className || "")
    );
    const grab = (el) =>
      el
        ? {
            className: el.className,
            rect: (() => {
              const r = el.getBoundingClientRect();
              return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
            })(),
          }
        : null;
    return { footer: grab(footer), cta: grab(cta) };
  });
  writeFileSync(`${OUTDIR}/joinus-cta.json`, JSON.stringify(joinusCta, null, 2));

  // ---- /reviews ----
  await page.goto("https://bfsumaeagleshop.com/reviews", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await shoot(page, `${OUTDIR}/reviews-bottom.png`);
  const reviewsOverlay = await findBottomRightOverlay(page);
  writeFileSync(
    `${OUTDIR}/reviews-overlay.json`,
    JSON.stringify(reviewsOverlay, null, 2)
  );

  await browser.close();
  console.log("DONE. Artifacts in /tmp: joinus.png, reviews-bottom.png, *_success.json, *_overlay.json, *_cta.json");
})().catch((e) => {
  console.error("SCRIPT ERROR:", e);
  process.exit(1);
});
