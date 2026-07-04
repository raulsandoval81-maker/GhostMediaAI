// ==============================
// Ghost Media Headquarters Closing
// ==============================

const CHANNELS = [
  "Wrestling Highlights",
  "Wrestling History",
  "MMA Moments",
  "MMA Drama",
  "Gym Humor",
  "Strength Motivation",
  "Youth Sports Parents",
  "Combat Sports News",
  "Wrestling Technique",
  "Underdog Stories"
];

// ----------------------------
// Storage Helpers
// ----------------------------

function getList(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function getIdeas() {
  if (typeof gmGetIdeas === "function") {
    return gmGetIdeas();
  }

  return getList("ghostIdeas");
}

function getLabel(item) {
  return (
    item.page ||
    item.product ||
    item.project ||
    item.genre ||
    item.category ||
    item.topic ||
    item.type ||
    "General"
  );
}

function matchesChannel(item, channel) {
  const text = `
    ${item.title || ""}
    ${item.page || ""}
    ${item.product || ""}
    ${item.project || ""}
    ${item.genre || ""}
    ${item.category || ""}
    ${item.topic || ""}
    ${item.pattern || ""}
    ${item.caption || ""}
  `.toLowerCase();

  return text.includes(channel.toLowerCase());
}

function average(items, field) {
  if (!items.length) return 0;

  const total = items.reduce(
    (sum, item) => sum + Number(item[field] || 0),
    0
  );

  return Math.round(total / items.length);
}

// ----------------------------
// Session Intelligence
// ----------------------------

function updateSessionStats() {
  const ideas = getIdeas();
  const posted = getList("ghost-posted");
  const patterns = getList("ghostmedia-patterns");
  const opportunities = getList("ghost-opportunities");

  document.getElementById("ideasCreated").textContent = ideas.length;
  document.getElementById("publishedCount").textContent = posted.length;
  document.getElementById("patternsLearned").textContent = patterns.length;
  document.getElementById("opportunitiesCount").textContent =
    opportunities.length;
}

// ----------------------------
// Channel Intelligence
// ----------------------------

function buildChannelStats(channel) {
  const ideas = getIdeas();
  const posted = getList("ghost-posted");
  const winners = getList("ghost-winners");

  const allPosts = [...ideas, ...posted, ...winners].filter((item) =>
    matchesChannel(item, channel)
  );

  const channelWinners = winners.filter((item) =>
    matchesChannel(item, channel)
  );

  return {
    posts: allPosts.length,
    avgLikes: average(channelWinners, "likes"),
    avgShares: average(channelWinners, "shares"),
    winnerCount: channelWinners.length
  };
}

function createChannelStatOverlay(channel, index) {
  const stats = buildChannelStats(channel);

  const overlay = document.createElement("div");
  overlay.className = "channelStatsOverlay";
  overlay.dataset.channel = channel;

  overlay.innerHTML = `
    <span>${stats.posts}</span>
    <span>${stats.avgLikes}</span>
    <span>${stats.avgShares}</span>
    <span>${stats.winnerCount}</span>
  `;

  positionChannelOverlay(overlay, index);

  document.getElementById("closingScene").appendChild(overlay);
}

function positionChannelOverlay(el, index) {
  const positions = [
    { left: 3.2, top: 47.5 },
    { left: 22.7, top: 47.5 },
    { left: 41.4, top: 47.5 },
    { left: 60.8, top: 47.5 },
    { left: 79.3, top: 47.5 },

    { left: 3.2, top: 74.4 },
    { left: 22.7, top: 74.4 },
    { left: 41.4, top: 74.4 },
    { left: 60.8, top: 74.4 },
    { left: 79.3, top: 74.4 }
  ];

  const pos = positions[index];

  el.style.left = `${pos.left}%`;
  el.style.top = `${pos.top}%`;
}

function renderChannelStats() {
  document
    .querySelectorAll(".channelStatsOverlay")
    .forEach((el) => el.remove());

  CHANNELS.forEach((channel, index) => {
    createChannelStatOverlay(channel, index);
  });
}

// ----------------------------
// Channel Navigation
// ----------------------------

function setupChannelHotspots() {
  document
    .querySelectorAll(".channelHotspot")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.dataset.page;

        localStorage.setItem("ghost-selected-category", page);

        localStorage.setItem(
          "ghost-factory-payload",
          JSON.stringify({
            title: `Build more around: ${page}`,
            page,
            topic: page,
            pattern: `Closing screen channel selected: ${page}`,
            emotion: "Opportunity",
            tension: "This channel is ready for another production cycle.",
            lesson: "Use what the network already knows.",
            sourceType: "closing",
            source: "headquarters-closing",
            sentToFactoryAt: new Date().toISOString()
          })
        );

        window.location.href = "/dashboard/factory.html?from=closing";
      });
    });
}

// ----------------------------
// Re-enter / Exit
// ----------------------------

document.getElementById("reEnterBtn")?.addEventListener("click", () => {
  window.location.href = "/dashboard/gate.html";
});

document.getElementById("exitBtn")?.addEventListener("click", () => {
  window.location.href = "/dashboard/factory.html";
});

// ----------------------------
// Initialize
// ----------------------------

updateSessionStats();
renderChannelStats();
setupChannelHotspots();