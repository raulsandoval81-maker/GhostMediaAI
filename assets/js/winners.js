const postedList = document.getElementById("postedList");
const winnerList = document.getElementById("winnerList");

let showAllPosted = false;
let showAllWinners = false;

const WINNERS_VISIBLE_LIMIT = 2;

function getPostedItems() {
  return JSON.parse(localStorage.getItem("ghost-posted") || "[]");
}

function savePostedItems(items) {
  localStorage.setItem("ghost-posted", JSON.stringify(items));
}

function getWinnerItems() {
  return JSON.parse(localStorage.getItem("ghost-winners") || "[]");
}

function saveWinnerItems(items) {
  localStorage.setItem("ghost-winners", JSON.stringify(items));
}

function renderSectionHeader(container, visibleCount, totalCount, message) {
  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleCount} of ${totalCount}</h3>
    <p>${message}</p>
  `;
  container.appendChild(header);
}

function renderToggle(container, hiddenCount, expanded, label, onClick) {
  if (hiddenCount <= 0) return;

  const toggle = document.createElement("button");
  toggle.className = "btn ghost-toggle-btn";
  toggle.textContent = expanded
    ? `▲ Hide ${label}`
    : `▼ Show ${hiddenCount} More`;

  toggle.addEventListener("click", onClick);
  container.appendChild(toggle);
}

function renderWinners() {
  const posted = getPostedItems();
  const winners = getWinnerItems();

  if (postedList) postedList.innerHTML = "";
  if (winnerList) winnerList.innerHTML = "";

  if (postedList) {
    if (!posted.length) {
      postedList.innerHTML = `
        <div class="page-card faded">
          <h3>No posted items waiting for results</h3>
          <p>Published content will appear here before becoming a winner.</p>
        </div>
      `;
    } else {
      const visiblePosted = showAllPosted
        ? posted
        : posted.slice(0, WINNERS_VISIBLE_LIMIT);

      const hiddenPosted = Math.max(posted.length - WINNERS_VISIBLE_LIMIT, 0);

      renderSectionHeader(
        postedList,
        visiblePosted.length,
        posted.length,
        "Posted content waiting for results."
      );

      visiblePosted.forEach((item) => {
        const row = document.createElement("div");
        row.className = "page-card";

        row.innerHTML = `
          <h3>${item.title || "Untitled"}</h3>

          <p>${item.product || item.page || item.type || "GhostMedia AI"}</p>

          <div class="results-grid">
            <input id="views-${item.id}" type="number" placeholder="Views" value="${item.views || ""}">
            <input id="likes-${item.id}" type="number" placeholder="Likes" value="${item.likes || ""}">
            <input id="comments-${item.id}" type="number" placeholder="Comments" value="${item.comments || ""}">
            <input id="shares-${item.id}" type="number" placeholder="Shares" value="${item.shares || ""}">
          </div>

          <button class="btn" onclick="markWinner('${item.id}')">
            🏆 Mark Winner
          </button>
        `;

        postedList.appendChild(row);
      });

      renderToggle(
        postedList,
        hiddenPosted,
        showAllPosted,
        "Posted",
        () => {
          showAllPosted = !showAllPosted;
          renderWinners();
        }
      );
    }
  }

  if (winnerList) {
    if (!winners.length) {
      winnerList.innerHTML = `
        <div class="page-card faded">
          <h3>No winners yet</h3>
          <p>Winning content will appear here.</p>
        </div>
      `;
    } else {
      const visibleWinners = showAllWinners
        ? winners
        : winners.slice(0, WINNERS_VISIBLE_LIMIT);

      const hiddenWinners = Math.max(winners.length - WINNERS_VISIBLE_LIMIT, 0);

      renderSectionHeader(
        winnerList,
        visibleWinners.length,
        winners.length,
        "Winning content that can feed the Factory."
      );

      visibleWinners.forEach((item) => {
        const row = document.createElement("div");
        row.className = "page-card";

        row.innerHTML = `
          <h3>🏆 ${item.title || "Untitled"}</h3>

          <p>${item.product || item.page || item.type || "GhostMedia AI"}</p>

          <p>
            Views: ${item.views || 0} ·
            Likes: ${item.likes || 0} ·
            Comments: ${item.comments || 0} ·
            Shares: ${item.shares || 0}
          </p>

          <span class="status-pill">WINNER</span>
        `;

        winnerList.appendChild(row);
      });

      renderToggle(
        winnerList,
        hiddenWinners,
        showAllWinners,
        "Winners",
        () => {
          showAllWinners = !showAllWinners;
          renderWinners();
        }
      );
    }
  }
}

function getMetric(id, metric) {
  const el = document.getElementById(`${metric}-${id}`);
  return Number(el?.value || 0);
}

window.markWinner = function(id) {
  const posted = getPostedItems();

  const item = posted.find(
    x => String(x.id) === String(id)
  );

  if (!item) {
    alert("Posted item not found.");
    return;
  }

  const winner = {
    ...item,
    views: getMetric(id, "views"),
    likes: getMetric(id, "likes"),
    comments: getMetric(id, "comments"),
    shares: getMetric(id, "shares"),
    status: "WINNER",
    resultLoggedAt: new Date().toISOString(),
    promotedAt: new Date().toISOString()
  };

  const winners = getWinnerItems();

  winners.unshift(winner);

  saveWinnerItems(winners);

  savePostedItems(
    posted.filter(
      x => String(x.id) !== String(id)
    )
  );

  try {
    if (typeof gmRebuildPatterns === "function") {
      gmRebuildPatterns();
    }
  } catch (err) {
    console.error(err);
  }

  showAllPosted = false;
  showAllWinners = false;

  renderWinners();

  alert("Winner saved successfully.");
};

renderWinners();