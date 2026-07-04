const titleInput = document.getElementById("ideaTitle");
const pageInput = document.getElementById("ideaPage");
const notesInput = document.getElementById("ideaNotes");
const saveIdeaBtn = document.getElementById("saveIdeaBtn");
const ideasList = document.getElementById("ideasList");
const scoutSignals = document.getElementById("scoutSignals");

let selectedScoutPackage = null;
let showAllIncoming = false;
let showAllActive = false;
let showAllPromoted = false;

const INCOMING_LIMIT = 2;
const ACTIVE_LIMIT = 3;
const PROMOTED_LIMIT = 2;

function normalizePage(entry) {
  return (
    entry.page ||
    entry.category ||
    entry.genre ||
    entry.project ||
    entry.product ||
    entry.topic ||
    "General"
  );
}

function normalizeStatus(status) {
  return String(status || "NEW").toUpperCase();
}

function listCount(storageKey) {
  return JSON.parse(localStorage.getItem(storageKey) || "[]").length;
}

function getIdeasStats() {
  const ideas = gmGetIdeas();

  return {
    ideas: ideas.filter((i) => normalizeStatus(i.status) === "NEW").length,
    queue: listCount("ghostContentQueue"),
    scheduled: listCount("ghostScheduledPosts"),
    posted: listCount("ghostPostedPosts"),
    winners: listCount("ghostWinners"),
    patterns: listCount("ghostPatterns")
  };
}

function renderStatsBar() {
  const statsTarget =
    document.getElementById("ideasStats") ||
    document.querySelector(".stats") ||
    document.querySelector(".sub");

  if (!statsTarget) return;

  const stats = getIdeasStats();

  statsTarget.innerHTML = `
    💡 Ideas: ${stats.ideas}
    📦 Queue: ${stats.queue}
    📅 Scheduled: ${stats.scheduled}
    📣 Posted: ${stats.posted}
    🏆 Winners: ${stats.winners}
    🧠 Patterns: ${stats.patterns}
  `;
}

function buildIdeaFromScout(entry) {
  return {
    id: crypto.randomUUID(),
    title:
      entry.briefTitle ||
      entry.title ||
      (entry.pattern && entry.topic
        ? `${entry.pattern}: ${entry.topic}`
        : entry.topic || "Scout Idea"),

    page: normalizePage(entry),

    topic: entry.topic || "",
    pattern: entry.pattern || "",
    emotion: entry.emotion || "",
    tension: entry.tension || "",
    lesson: entry.lesson || "",
    audience: entry.audience || [],
    score: entry.score || "",
    platforms: entry.platforms || [],
    opportunities: entry.opportunities || [],
    suggestedIdeas: entry.ideas || [],

    notes: entry.notes || entry.executiveSummary || entry.summary || "",
    originalContent: entry.originalContent || entry.input || entry.notes || "",

    source: entry.source || "ai-inbox",
    status: "NEW",
    createdAt: new Date().toISOString()
  };
}

function renderToggleButton({
  hiddenCount,
  expanded,
  label,
  onClick
}) {
  if (hiddenCount <= 0) return null;

  const btn = document.createElement("button");
  btn.className = "btn ghost-toggle-btn";
  btn.textContent = expanded
    ? `▲ Hide ${label}`
    : `▼ Show ${hiddenCount} More`;

  btn.addEventListener("click", onClick);

  return btn;
}

function renderScoutSignals() {
  if (!scoutSignals) return;

  const entries = JSON.parse(localStorage.getItem("ghostScoutEntries") || "[]");

  if (!entries.length) {
    scoutSignals.innerHTML = `
      <div class="section-divider"></div>
      <div class="page-card faded">
        <h3>No incoming intelligence yet</h3>
        <p>AI Inbox briefs will show here after you save them to Scout.</p>
      </div>
    `;
    return;
  }

  const visibleEntries = showAllIncoming
    ? entries
    : entries.slice(0, INCOMING_LIMIT);

  const hiddenCount = Math.max(entries.length - INCOMING_LIMIT, 0);

  scoutSignals.innerHTML = `
    <div class="section-divider"></div>
    <div class="section-title compact-section-title">
      <h3>Showing ${visibleEntries.length} of ${entries.length}</h3>
      <p>Review new AI briefs before turning them into active ideas.</p>
    </div>
  `;

  visibleEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "page-card incoming-card";

    row.innerHTML = `
      <h3>${entry.briefTitle || entry.pattern || entry.title || "Intelligence Brief"}</h3>
      <p><strong>${entry.topic || "No topic"}</strong></p>
      <p>${entry.source || "AI Inbox"} · Score: ${entry.score || 0}/10</p>
      <button class="btn use-scout-btn">Use As Idea</button>
    `;

    row.querySelector(".use-scout-btn").addEventListener("click", () => {
      const ideaPackage = buildIdeaFromScout(entry);
      selectedScoutPackage = ideaPackage;

      titleInput.value = ideaPackage.title;
      notesInput.value = ideaPackage.notes || ideaPackage.originalContent || "";

      if ([...pageInput.options].some((opt) => opt.value === ideaPackage.page)) {
        pageInput.value = ideaPackage.page;
      } else {
        pageInput.value = "General";
      }

      titleInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });

    scoutSignals.appendChild(row);
  });

  const toggle = renderToggleButton({
    hiddenCount,
    expanded: showAllIncoming,
    label: "Incoming Intelligence",
    onClick: () => {
      showAllIncoming = !showAllIncoming;
      renderScoutSignals();
    }
  });

  if (toggle) scoutSignals.appendChild(toggle);
}

function ideaMatchesPage(idea, selectedPage) {
  if (selectedPage === "General") return true;

  return (
    idea.page === selectedPage ||
    idea.category === selectedPage ||
    idea.genre === selectedPage ||
    idea.topic === selectedPage
  );
}

function renderIdeaCard(idea) {
  const row = document.createElement("div");
  row.className = "page-card active-idea-card";

  row.innerHTML = `
    <h3>${idea.title}</h3>
    <p><strong>${idea.page || idea.topic || "Uncategorized"}</strong></p>
    <p>${idea.notes || idea.pattern || "No notes yet."}</p>
    <button class="btn promote-btn" data-id="${idea.id}">
      Promote → Content
    </button>
  `;

  return row;
}

function renderIdeas() {
  const ideas = gmGetIdeas();
  const selectedPage = pageInput.value;

  ideasList.innerHTML = "";

  const activeIdeas = ideas.filter((idea) => {
    const status = normalizeStatus(idea.status);
    return status === "NEW" && ideaMatchesPage(idea, selectedPage);
  });

  const promotedIdeas = ideas.filter((idea) => {
    const status = normalizeStatus(idea.status);
    return status === "PROMOTED" && ideaMatchesPage(idea, selectedPage);
  });

  const wrapper = document.createElement("div");
  wrapper.className = "ideas-hierarchy";

  const activeHeader = document.createElement("div");
  activeHeader.className = "section-title compact-section-title";
  activeHeader.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${Math.min(activeIdeas.length, ACTIVE_LIMIT)} of ${activeIdeas.length}</h3>
    <p>These ideas are still waiting to become content.</p>
  `;
  wrapper.appendChild(activeHeader);

  if (!activeIdeas.length) {
    const empty = document.createElement("div");
    empty.className = "page-card faded";
    empty.innerHTML = `
      <h3>No active ideas for ${selectedPage}</h3>
      <p>Add one above, or use an incoming intelligence brief.</p>
    `;
    wrapper.appendChild(empty);
  }

  const visibleActive = showAllActive
    ? activeIdeas
    : activeIdeas.slice(0, ACTIVE_LIMIT);

  visibleActive.forEach((idea) => {
    wrapper.appendChild(renderIdeaCard(idea));
  });

  const activeHiddenCount = Math.max(activeIdeas.length - ACTIVE_LIMIT, 0);

  const activeToggle = renderToggleButton({
    hiddenCount: activeHiddenCount,
    expanded: showAllActive,
    label: "Active Ideas",
    onClick: () => {
      showAllActive = !showAllActive;
      renderIdeas();
    }
  });

  if (activeToggle) wrapper.appendChild(activeToggle);

  if (promotedIdeas.length) {
    const promotedHeader = document.createElement("div");
    promotedHeader.className = "section-title compact-section-title";
    promotedHeader.innerHTML = `
      <div class="section-divider"></div>
      <h3>📚 Recently Promoted</h3>
      <p>Showing ${Math.min(promotedIdeas.length, PROMOTED_LIMIT)} of ${promotedIdeas.length} moved to Content.</p>
    `;
    wrapper.appendChild(promotedHeader);

    const visiblePromoted = showAllPromoted
      ? promotedIdeas
      : promotedIdeas.slice(0, PROMOTED_LIMIT);

    visiblePromoted.forEach((idea) => {
      const row = document.createElement("div");
      row.className = "page-card faded";
      row.innerHTML = `
        <h3>${idea.title}</h3>
        <p>${idea.page || "General"} · Promoted</p>
      `;
      wrapper.appendChild(row);
    });

    const promotedHiddenCount = Math.max(promotedIdeas.length - PROMOTED_LIMIT, 0);

    const promotedToggle = renderToggleButton({
      hiddenCount: promotedHiddenCount,
      expanded: showAllPromoted,
      label: "Promoted Ideas",
      onClick: () => {
        showAllPromoted = !showAllPromoted;
        renderIdeas();
      }
    });

    if (promotedToggle) wrapper.appendChild(promotedToggle);
  }

  ideasList.appendChild(wrapper);

  document.querySelectorAll(".promote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const updated = gmGetIdeas().map((idea) => {
        if (String(idea.id) === String(id)) {
          return {
            ...idea,
            status: "PROMOTED",
            promotedAt: new Date().toISOString()
          };
        }

        return idea;
      });

      gmSaveIdeas(updated);
      renderStatsBar();
      window.location.assign("/dashboard/content.html?from=ideas");
    });
  });

  renderStatsBar();
}

pageInput.addEventListener("change", () => {
  showAllActive = false;
  showAllPromoted = false;
  renderIdeas();
  renderStatsBar();
});

saveIdeaBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();

  if (!title) {
    alert("Add an idea title first.");
    return;
  }

  const ideas = gmGetIdeas();

  const newIdea = selectedScoutPackage
    ? {
        ...selectedScoutPackage,
        title,
        page: pageInput.value,
        notes: notesInput.value.trim(),
        status: "NEW",
        createdAt: selectedScoutPackage.createdAt || new Date().toISOString()
      }
    : {
        id: crypto.randomUUID(),
        title,
        page: pageInput.value,
        notes: notesInput.value.trim(),
        source: "manual",
        status: "NEW",
        createdAt: new Date().toISOString()
      };

  ideas.unshift(newIdea);
  gmSaveIdeas(ideas);

  selectedScoutPackage = null;
  titleInput.value = "";
  notesInput.value = "";

  showAllActive = false;
  renderIdeas();
  renderStatsBar();
});

renderScoutSignals();
renderIdeas();
renderStatsBar();