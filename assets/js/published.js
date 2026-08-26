const publishedList = document.getElementById("publishedList");

let showAllPublished = false;
const PUBLISHED_VISIBLE_LIMIT = 2;

function getPublishedItems() {
  return gmGetPosted();
}

function savePublishedItems(items) {
  gmSavePosted(items);
}

function renderPublished() {
  const items = getPublishedItems();

  publishedList.innerHTML = "";

  if (!items.length) {
    publishedList.innerHTML = `
      <div class="page-card faded">
        <h3>No published content yet</h3>
        <p>Scheduled posts will appear here after publishing.</p>
      </div>
    `;
    return;
  }

  const visibleItems = showAllPublished
    ? items
    : items.slice(0, PUBLISHED_VISIBLE_LIMIT);

  const hiddenCount = Math.max(items.length - PUBLISHED_VISIBLE_LIMIT, 0);

  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleItems.length} of ${items.length}</h3>
    <p>Your history of content that went live.</p>
  `;
  publishedList.appendChild(header);

  visibleItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "page-card";

    row.innerHTML = `
      <h3>${item.title || "Untitled"}</h3>

      <p>${item.product || item.page || item.type || "GhostMedia AI"}</p>

      <span class="status-pill">
        POSTED
      </span>

      <p>
        <strong>Platform:</strong>
        ${item.platform || "Manual"}
      </p>

      <p>
        <strong>Published:</strong>
        ${
          item.postedAt
            ? new Date(item.postedAt).toLocaleString()
            : "Unknown"
        }
      </p>

      <div class="btn-row">
        <button
          class="btn"
          onclick="deletePublished('${item.id}')">
          🗑 Delete
        </button>
      </div>
    `;

    publishedList.appendChild(row);
  });

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.className = "btn ghost-toggle-btn";

    toggle.textContent = showAllPublished
      ? "▲ Hide Published"
      : `▼ Show ${hiddenCount} More`;

    toggle.addEventListener("click", () => {
      showAllPublished = !showAllPublished;
      renderPublished();
    });

    publishedList.appendChild(toggle);
  }
}

function deletePublished(id) {
  if (!confirm("Delete this published item?")) return;

  savePublishedItems(
    getPublishedItems().filter(
      item => String(item.id) !== String(id)
    )
  );

  renderPublished();
}

renderPublished();
