const STORAGE_KEY = "ghostScoutEntries";

const saveBtn = document.getElementById("saveBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const entriesEl = document.getElementById("entries");
const analysisEl = document.getElementById("analysis");

let showAllScoutEntries = false;
const SCOUT_VISIBLE_LIMIT = 2;

loadEntries();
updateStats();

saveBtn.onclick = () => {
  const source = document.getElementById("source").value.trim();
  const topic = document.getElementById("topic").value.trim();
  const pattern = document.getElementById("pattern").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!source || !pattern) {
    alert("Source Account and Pattern are required.");
    return;
  }

  const entry = {
    source,
    topic,
    pattern,
    notes,
    createdAt: Date.now()
  };

  const entries = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  entries.unshift(entry);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries)
  );

  loadEntries();
  updateStats();

  document.getElementById("source").value = "";
  document.getElementById("topic").value = "";
  document.getElementById("pattern").value = "";
  document.getElementById("notes").value = "";
};

analyzeBtn?.addEventListener("click", () => {
  const contentInput = document.getElementById("content");
  const content = contentInput ? contentInput.value.trim() : "";

  if (!content) {
    alert("Paste content to analyze first.");
    return;
  }

  const report = buildScoutReport(content);

  analysisEl.innerHTML = `
    <h3>Scout Report</h3>

    <p><strong>Pattern:</strong> ${report.pattern}</p>
    <p><strong>Emotion:</strong> ${report.emotion}</p>
    <p><strong>Tension:</strong> ${report.tension}</p>
    <p><strong>Lesson:</strong> ${report.lesson}</p>

    <h4>Idea Starters</h4>

    <ul>
      ${report.ideas.map(idea => `<li>${idea}</li>`).join("")}
    </ul>
  `;

  document.getElementById("pattern").value = report.pattern;
  document.getElementById("topic").value = report.topic;

  document.getElementById("notes").value =
    `Emotion: ${report.emotion}
Tension: ${report.tension}
Lesson: ${report.lesson}

${content}`;
});

function buildScoutReport(content) {
  const text = content.toLowerCase();

  if (
    text.includes("fighter") ||
    text.includes("round") ||
    text.includes("knockout") ||
    text.includes("submission") ||
    text.includes("came back") ||
    text.includes("comes back") ||
    text.includes("comeback")
  ) {
    return {
      topic: "MMA Moments",
      pattern: "Comeback",
      emotion: "Momentum Shift",
      tension: "Everyone thought the fight was over.",
      lesson: "Never count someone out.",
      ideas: [
        "The Comeback After Getting Dropped",
        "One Round Changed Everything",
        "How Momentum Swung The Fight"
      ]
    };
  }

  if (
    text.includes("underdog") ||
    text.includes("nobody believed") ||
    text.includes("upset") ||
    text.includes("against the odds")
  ) {
    return {
      topic: "Comeback Story",
      pattern: "Underdog",
      emotion: "Redemption",
      tension: "Nobody thought they could win.",
      lesson: "Hard work changes expectations.",
      ideas: [
        "The Athlete Nobody Believed In",
        "Lost All Season Then Won When It Mattered",
        "The Comeback After Everyone Quit Watching"
      ]
    };
  }

  if (
    text.includes("parent") ||
    text.includes("dad") ||
    text.includes("mom") ||
    text.includes("sideline")
  ) {
    return {
      topic: "Youth Sports Parents",
      pattern: "Parent Behavior",
      emotion: "Recognition",
      tension: "Everyone has seen this parent before.",
      lesson: "Support beats sideline control.",
      ideas: [
        "Parents Who Coach From The Stands",
        "The Ride Home After A Bad Game",
        "What Coaches Wish Parents Understood"
      ]
    };
  }

  if (
    text.includes("rival") ||
    text.includes("beef") ||
    text.includes("trash talk") ||
    text.includes("callout")
  ) {
    return {
      topic: "MMA Drama",
      pattern: "Rivalry",
      emotion: "Tension",
      tension: "The conflict became bigger than the matchup.",
      lesson: "Rivalries create attention when the stakes feel personal.",
      ideas: [
        "The Rivalry That Got Too Personal",
        "The Callout Nobody Expected",
        "The Beef That Sold The Fight"
      ]
    };
  }

  if (
    text.includes("technique") ||
    text.includes("shot") ||
    text.includes("setup") ||
    text.includes("sprawl")
  ) {
    return {
      topic: "Wrestling Technique",
      pattern: "Coach Tip",
      emotion: "Useful",
      tension: "One small mistake ruins the position.",
      lesson: "Small details win big exchanges.",
      ideas: [
        "Why Your Double Leg Keeps Failing",
        "The Setup Before The Shot Matters Most",
        "How To Finish When They Sprawl"
      ]
    };
  }

  return {
    topic: "General",
    pattern: "Attention Signal",
    emotion: "Curiosity",
    tension: "There is a story under the story.",
    lesson: "Find the hidden reason people reacted.",
    ideas: [
      "The Part Nobody Talks About",
      "What People Missed",
      "Why This Hit A Nerve"
    ]
  };
}

function loadEntries() {
  const entries = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  entriesEl.innerHTML = "";

  if (!entries.length) {
    entriesEl.innerHTML = `
      <div class="page-card faded">
        <h3>No scout entries yet</h3>
        <p>Saved scout signals will appear here.</p>
      </div>
    `;
    return;
  }

  const visibleEntries = showAllScoutEntries
    ? entries
    : entries.slice(0, SCOUT_VISIBLE_LIMIT);

  const hiddenCount = Math.max(entries.length - SCOUT_VISIBLE_LIMIT, 0);

  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleEntries.length} of ${entries.length}</h3>
    <p>Scout signals saved from manual scouting and AI Inbox.</p>
  `;
  entriesEl.appendChild(header);

  visibleEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "page-card";

    row.innerHTML = `
      <h3>${entry.pattern || "Scout Pattern"}</h3>
      <p><strong>${entry.source || "Unknown source"}</strong></p>
      <p>${entry.topic || "General"}</p>
    `;

    entriesEl.appendChild(row);
  });

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.className = "btn ghost-toggle-btn";
    toggle.textContent = showAllScoutEntries
      ? "▲ Hide Scout Entries"
      : `▼ Show ${hiddenCount} More`;

    toggle.addEventListener("click", () => {
      showAllScoutEntries = !showAllScoutEntries;
      loadEntries();
    });

    entriesEl.appendChild(toggle);
  }
}

function updateStats() {
  const entries = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  const patterns = new Set(
    entries
      .map(e => (e.pattern || "").trim())
      .filter(Boolean)
  );

  const sources = new Set(
    entries
      .map(e => (e.source || "").trim())
      .filter(Boolean)
  );

  document.getElementById("entryCount").textContent = entries.length;
  document.getElementById("patternCount").textContent = patterns.size;
  document.getElementById("sourceCount").textContent = sources.size;
}