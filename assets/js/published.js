const publishedList = document.getElementById("publishedList");

function getPublishedItems() {
  return JSON.parse(
    localStorage.getItem("ghost-posted") || "[]"
  );
}

function savePublishedItems(items) {
  localStorage.setItem(
    "ghost-posted",
    JSON.stringify(items)
  );
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

  items.forEach((item) => {

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
          onclick="promoteWinner('${item.id}')">

          🏆 Promote Winner

        </button>

        <button
          class="btn"
          onclick="deletePublished('${item.id}')">

          🗑 Delete

        </button>

      </div>
    `;

    publishedList.appendChild(row);

  });

}

function promoteWinner(id) {

  const items = getPublishedItems();

  const winner =
    items.find(
      item => String(item.id) === String(id)
    );

  if (!winner) return;

  const winners = JSON.parse(
    localStorage.getItem("ghost-winners") || "[]"
  );

  winners.unshift({
    ...winner,
    status: "WINNER",
    promotedAt: new Date().toISOString()
  });

  localStorage.setItem(
    "ghost-winners",
    JSON.stringify(winners)
  );

  savePublishedItems(
    items.filter(
      item => String(item.id) !== String(id)
    )
  );

window.location.assign("/dashboard/winners.html?from=published");

}

function deletePublished(id) {

  if (!confirm("Delete this published item?"))
    return;

  savePublishedItems(
    getPublishedItems().filter(
      item => String(item.id) !== String(id)
    )
  );

  renderPublished();

}

renderPublished();