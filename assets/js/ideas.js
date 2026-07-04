const titleInput = document.getElementById("ideaTitle");
const pageInput = document.getElementById("ideaPage");
const notesInput = document.getElementById("ideaNotes");
const saveIdeaBtn = document.getElementById("saveIdeaBtn");
const ideasList = document.getElementById("ideasList");
const scoutSignals = document.getElementById("scoutSignals");

let selectedScoutPackage = null;

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

function buildIdeaFromScout(entry) {
  return {
    id: crypto.randomUUID(),
    title:
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
    audience: entry.audience || "",
    score: entry.score || "",
    platforms: entry.platforms || [],

    notes: entry.notes || entry.summary || "",
    originalContent: entry.originalContent || entry.input || entry.notes || "",

    source: entry.source || "ai-inbox",
    status: "NEW",
    createdAt: new Date().toISOString()
  };
}

function renderScoutSignals() {
  if (!scoutSignals) return;

  const entries = JSON.parse(localStorage.getItem("ghostScoutEntries") || "[]");

  if (!entries.length) {
    scoutSignals.innerHTML = `
      <div class="page-card faded">
        <h3>No scout signals yet</h3>
        <p>Scout observations will show here.</p>
      </div>
    `;
    return;
  }

  scoutSignals.innerHTML = "";

  entries.slice(0, 5).forEach((entry) => {
    const row = document.createElement("div");
    row.className = "page-card";

    row.innerHTML = `
      <h3>${entry.pattern || entry.title || "Scout Pattern"}</h3>
      <p>${entry.topic || "No topic"} · ${entry.source || "Unknown source"}</p>
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

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    scoutSignals.appendChild(row);
  });
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

function renderIdeas() {
  const ideas = gmGetIdeas();
  const selectedPage = pageInput.value;

  ideasList.innerHTML = "";

  const activeIdeas = ideas.filter((idea) => {
    const isActive =
      idea.status === "NEW" ||
      idea.status === "idea" ||
      !idea.status;

    return isActive && ideaMatchesPage(idea, selectedPage);
  });

  const promotedIdeas = ideas.filter(
    (idea) => idea.status === "PROMOTED" && ideaMatchesPage(idea, selectedPage)
  );

  if (!activeIdeas.length) {
    const empty = document.createElement("div");
    empty.className = "page-card faded";
    empty.innerHTML = `
      <h3>No ideas for ${selectedPage}</h3>
      <p>Add one above, then it will show here.</p>
    `;
    ideasList.appendChild(empty);
  }

  activeIdeas.forEach((idea) => {
    const row = document.createElement("div");
    row.className = "page-card";
    row.innerHTML = `
      <h3>${idea.title}</h3>
      <p>${idea.page || idea.topic || "Uncategorized"}</p>
      <button class="btn promote-btn" data-id="${idea.id}">
        Promote → Content
      </button>
    `;
    ideasList.appendChild(row);
  });

  if (promotedIdeas.length) {
    const archive = document.createElement("div");
    archive.className = "page-card faded";
    archive.innerHTML = `
      <h3>Promoted ${selectedPage} Ideas</h3>
      <p>${promotedIdeas.length} moved to Content.</p>
    `;
    ideasList.appendChild(archive);
  }

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
      window.location.assign("/dashboard/content.html?from=ideas");
    });
  });
}

pageInput.addEventListener("change", renderIdeas);

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

  renderIdeas();
});

renderScoutSignals();
renderIdeas();