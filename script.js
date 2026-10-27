// ---------------------------------------------------------------------------
// CONFIG — edit these things.
// ---------------------------------------------------------------------------

// 1. Paste your Google Form link here. Every "feedback" button on the page uses it.
//    While it's empty, the buttons scroll to the feedback section instead.
const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdHFL1OijEd7ZiAr8Jz0GaFDb01n-qTwDK0WpU2ziSGVzPXAA/viewform";

// 2. How often the featured (big) demo changes, in seconds. Set to 0 to turn off.
const FEATURE_ROTATE_SECONDS = 20;

// 3. Your demos. For `video`, use one of:
//    - a Panopto link (the normal "Viewer.aspx?id=..." share link is fine)
//    - a YouTube embed URL:  "https://www.youtube-nocookie.com/embed/VIDEO_ID"
//    - a Vimeo embed URL:    "https://player.vimeo.com/video/VIDEO_ID"
//    - a direct video file:  "assets/my-demo.mp4"
//    - "" to show a "coming soon" placeholder
//    Add `featured: true` to choose which demo is featured first (the big card).
//    Panopto videos get their preview image automatically. For other videos you can
//    add `thumbnail: "assets/my-preview.jpg"` to show a preview before playing.
const DEMOS = [
  {
    title: "Built-in VPN",
    description: "Turn on Firefox's built-in VPN in one click, right from the toolbar, to browse more privately.",
    duration: "1 min 31 sec",
    tag: "Desktop",
    featured: true,
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=cbcc383a-4ab0-4a7b-8c01-b4f000907f33",
  },
  {
    title: "Listen to Page",
    description: "Have Firefox read a web page out loud, right from your Android phone.",
    duration: "44 sec",
    tag: "Android",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=3b0ec273-5ba3-453c-8cdd-b4e50080668c",
  },
  {
    title: "PDF Signatures",
    description: "Sign PDF documents directly in Firefox on Android.",
    duration: "48 sec",
    tag: "Android",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=4b8d3c0d-a1cc-4940-8084-b4e500806691",
  },
  {
    title: "New Firefox Design",
    description: "A first look at Nova, the new design for Firefox.",
    duration: "3 min",
    tag: "Nova",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=32efde15-2d51-4dbf-b119-b4e300f32cc2",
  },
  {
    title: "Split View",
    description: "View two tabs side by side in Firefox on desktop.",
    duration: "54 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=47907782-fc0f-456c-96b8-b4e8015184e4",
  },
  {
    title: "Mini Window",
    description: "A quick look at Mini Window in Firefox on desktop.",
    duration: "1 min 36 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=5aa18363-9db8-4c08-9b66-b4e801516eb6",
  },
  {
    title: "Firefox Referrals Beta",
    description: "Invite friends to Firefox. In beta and available in the US only for now.",
    duration: "2 min 36 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=c7f4f85d-430f-484f-95f0-b4ef00eef139",
  },
  {
    title: "Wallpapers",
    description: "Personalize your New Tab page with a wallpaper.",
    duration: "1 min 36 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=dfb7c8e1-7068-4b62-aa45-b4ec010e3eeb",
  },
  {
    title: "Widgets",
    description: "Add widgets like a focus timer, world clocks and weather to your New Tab page.",
    duration: "3 min 11 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=93689edd-9e44-4f56-946b-b4ec010820dc",
  },
  {
    title: "CVV Autofill",
    description: "Firefox fills in your saved credit card details, including the security code (CVV).",
    duration: "1 min 6 sec",
    tag: "Desktop",
    video: "https://mozilla.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=44966edf-ea2f-42c2-a136-b4eb01574f51",
  },
];

// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Turns a Panopto share link (Viewer.aspx?id=...) into its embeddable player URL.
function parsePanopto(url) {
  const m = url.match(/^(https:\/\/[^/]+\.panopto\.(?:com|eu))\/Panopto\/Pages\/(?:Viewer|Embed)\.aspx\?(?:.*&)?id=([0-9a-f-]+)/i);
  return m ? { host: m[1], id: m[2] } : null;
}

// Turns a Panopto share link (Viewer.aspx?id=...) into its embeddable player URL.
function toEmbedUrl(url, autoplay) {
  const p = parsePanopto(url);
  if (p) {
    return `${p.host}/Panopto/Pages/Embed.aspx?id=${p.id}&autoplay=${autoplay}&offerviewer=false&showtitle=false&showbrand=false&interactivity=none`;
  }
  return url;
}

function thumbnailFor(demo) {
  if (demo.thumbnail) return demo.thumbnail;
  const p = parsePanopto(demo.video);
  return p ? `${p.host}/Panopto/PublicAPI/SessionPreviewImage?id=${p.id}` : "";
}

function playerHtml(demo, autoplay) {
  const title = escapeHtml(demo.title);
  const src = escapeHtml(toEmbedUrl(demo.video, autoplay));
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(demo.video)) {
    return `<video controls preload="metadata" ${autoplay ? "autoplay" : ""} src="${src}" aria-label="${title}"></video>`;
  }
  return `<iframe src="${src}" title="${title}"
    allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    allowfullscreen></iframe>`;
}

function renderMedia(demo, index) {
  if (!demo.video) {
    return `<div class="video-placeholder" role="img" aria-label="Video coming soon">
      <span class="play-icon" aria-hidden="true"></span>
      <span>Video coming soon</span>
    </div>`;
  }
  const thumb = thumbnailFor(demo);
  if (!thumb) return playerHtml(demo, false);
  const src = escapeHtml(thumb);
  return `<button class="video-preview" type="button" data-play="${index}" style="--thumb: url('${src}')">
    <img src="${src}" alt="" loading="lazy">
    <span class="play-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Play video: ${escapeHtml(demo.title)}</span>
  </button>`;
}

// Display order: order[0] is the featured demo, the rest fill the grid.
const order = DEMOS.map((_, i) => i);
const firstFeatured = DEMOS.findIndex((demo) => demo.featured);
if (firstFeatured > 0) [order[0], order[firstFeatured]] = [order[firstFeatured], order[0]];

function renderDemos() {
  const grid = document.getElementById("demo-grid");
  grid.innerHTML = order.map((i, position) => {
    const demo = DEMOS[i];
    const featured = position === 0;
    return `
    <article class="demo-card${featured ? " demo-card--featured" : ""}">
      <div class="video-frame">${renderMedia(demo, i)}</div>
      <div class="demo-body">
        <div class="demo-meta">
          ${featured ? `<span class="tag tag--featured">Featured</span>` : ""}
          ${demo.tag ? `<span class="tag">${escapeHtml(demo.tag)}</span>` : ""}
          ${demo.duration ? `<span class="duration">${escapeHtml(demo.duration)}</span>` : ""}
        </div>
        <h3>${escapeHtml(demo.title)}</h3>
        <p>${escapeHtml(demo.description)}</p>
        <a class="text-link" data-feedback-link href="#feedback">Give feedback on this demo &rarr;</a>
      </div>
    </article>
  `;
  }).join("");
  wireFeedbackLinks();
}

function wireFeedbackLinks() {
  if (!FEEDBACK_FORM_URL) return; // placeholder mode: links keep pointing at #feedback
  document.querySelectorAll("[data-feedback-link]").forEach((link) => {
    link.href = FEEDBACK_FORM_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

// ---------------------------------------------------------------------------
// Featured rotation. Each step swaps the featured demo with the next grid card,
// so only two cards change and the rest stay put. Rotation pauses while someone
// is watching or using the page, and resumes once the booth has been idle.
// ---------------------------------------------------------------------------
const IDLE_RESET_MS = 4 * 60 * 1000; // longer than the longest demo
let nextSwap = 1;
let lastActivity = 0;

function isPlayerOpen() {
  return document.querySelector("#demo-grid iframe, #demo-grid video") !== null;
}

function markActivity() {
  lastActivity = Date.now();
}

function rotateFeatured() {
  if (document.hidden || order.length < 2) return;
  const idle = Date.now() - lastActivity > IDLE_RESET_MS;
  if (isPlayerOpen() && !idle) return;
  if (!isPlayerOpen() && Date.now() - lastActivity < FEATURE_ROTATE_SECONDS * 1000) return;

  [order[0], order[nextSwap]] = [order[nextSwap], order[0]];
  nextSwap = nextSwap + 1 < order.length ? nextSwap + 1 : 1;

  const grid = document.getElementById("demo-grid");
  grid.classList.add("is-swapping");
  setTimeout(() => {
    renderDemos();
    grid.classList.remove("is-swapping");
  }, 300);
}

["pointerdown", "keydown", "wheel", "touchstart"].forEach((type) =>
  window.addEventListener(type, markActivity, { passive: true })
);
// Clicking inside a video player moves focus into its frame — count that as activity too.
window.addEventListener("blur", markActivity);

// Swap a preview for the real player when it's clicked.
document.getElementById("demo-grid").addEventListener("click", (event) => {
  const preview = event.target.closest("[data-play]");
  if (!preview) return;
  markActivity();
  preview.outerHTML = playerHtml(DEMOS[preview.dataset.play], true);
});

renderDemos();
if (FEATURE_ROTATE_SECONDS > 0) setInterval(rotateFeatured, FEATURE_ROTATE_SECONDS * 1000);
document.getElementById("year").textContent = new Date().getFullYear();
