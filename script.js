// ---------------------------------------------------------------------------
// CONFIG — edit these two things.
// ---------------------------------------------------------------------------

// 1. Paste your Google Form link here. Every "feedback" button on the page uses it.
//    While it's empty, the buttons scroll to the feedback section instead.
const FEEDBACK_FORM_URL = ""; // e.g. "https://forms.gle/XXXXXXXX"

// 2. Your demos. For `video`, use one of:
//    - a YouTube embed URL:  "https://www.youtube-nocookie.com/embed/VIDEO_ID"
//    - a Vimeo embed URL:    "https://player.vimeo.com/video/VIDEO_ID"
//    - a direct video file:  "assets/my-demo.mp4"
//    - "" to show a "coming soon" placeholder
const DEMOS = [
  {
    title: "Demo 1: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "New",
    video: "",
  },
  {
    title: "Demo 2: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "Beta",
    video: "",
  },
  {
    title: "Demo 3: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "Concept",
    video: "",
  },
  {
    title: "Demo 4: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "New",
    video: "",
  },
  {
    title: "Demo 5: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "Beta",
    video: "",
  },
  {
    title: "Demo 6: Feature name",
    description: "A short sentence about what this demo shows and what you'd like viewers to focus on.",
    duration: "3 min",
    tag: "Concept",
    video: "",
  },
];

// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function renderMedia(demo) {
  const title = escapeHtml(demo.title);
  const src = escapeHtml(demo.video);
  if (!demo.video) {
    return `<div class="video-placeholder" role="img" aria-label="Video coming soon">
      <span class="play-icon" aria-hidden="true"></span>
      <span>Video coming soon</span>
    </div>`;
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(demo.video)) {
    return `<video controls preload="metadata" src="${src}" aria-label="${title}"></video>`;
  }
  return `<iframe src="${src}" title="${title}" loading="lazy"
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
    allowfullscreen></iframe>`;
}

function renderDemos() {
  const grid = document.getElementById("demo-grid");
  grid.innerHTML = DEMOS.map((demo) => `
    <article class="demo-card">
      <div class="video-frame">${renderMedia(demo)}</div>
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

renderDemos();
wireFeedbackLinks();
document.getElementById("year").textContent = new Date().getFullYear();
