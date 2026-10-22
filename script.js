// ---------------------------------------------------------------------------
// CONFIG — edit these two things.
// ---------------------------------------------------------------------------

// 1. Paste your Google Form link here. Every "feedback" button on the page uses it.
//    While it's empty, the buttons scroll to the feedback section instead.
const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdHFL1OijEd7ZiAr8Jz0GaFDb01n-qTwDK0WpU2ziSGVzPXAA/viewform";

// 2. Your demos. For `video`, use one of:
//    - a Panopto link (the normal "Viewer.aspx?id=..." share link is fine)
//    - a YouTube embed URL:  "https://www.youtube-nocookie.com/embed/VIDEO_ID"
//    - a Vimeo embed URL:    "https://player.vimeo.com/video/VIDEO_ID"
//    - a direct video file:  "assets/my-demo.mp4"
//    - "" to show a "coming soon" placeholder
//    Panopto videos get their preview image automatically. For other videos you can
//    add `thumbnail: "assets/my-preview.jpg"` to show a preview before playing.
const DEMOS = [
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
    title: "Demo 6: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "",
    tag: "",
    video: "",
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

function renderDemos() {
  const grid = document.getElementById("demo-grid");
  grid.innerHTML = DEMOS.map((demo, i) => `
    <article class="demo-card">
      <div class="video-frame">${renderMedia(demo, i)}</div>
      <div class="demo-body">
        <div class="demo-meta">
          ${demo.tag ? `<span class="tag">${escapeHtml(demo.tag)}</span>` : ""}
          ${demo.duration ? `<span class="duration">${escapeHtml(demo.duration)}</span>` : ""}
        </div>
        <h3>${escapeHtml(demo.title)}</h3>
        <p>${escapeHtml(demo.description)}</p>
        <a class="text-link" data-feedback-link href="#feedback">Give feedback on this demo &rarr;</a>
      </div>
    </article>
  `).join("");
}

function wireFeedbackLinks() {
  if (!FEEDBACK_FORM_URL) return; // placeholder mode: links keep pointing at #feedback
  document.querySelectorAll("[data-feedback-link]").forEach((link) => {
    link.href = FEEDBACK_FORM_URL;
    link.target = "_blank";
    link.rel = "noopener";
  });
}

// Swap a preview for the real player when it's clicked.
document.getElementById("demo-grid").addEventListener("click", (event) => {
  const preview = event.target.closest("[data-play]");
  if (!preview) return;
  preview.outerHTML = playerHtml(DEMOS[preview.dataset.play], true);
});

renderDemos();
wireFeedbackLinks();
document.getElementById("year").textContent = new Date().getFullYear();
