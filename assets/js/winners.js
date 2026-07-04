const postedList = document.getElementById("postedList");
const winnerList = document.getElementById("winnerList");

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

function renderWinners() {
  const posted = getPostedItems();
  const winners = getWinnerItems();

  if (postedList) postedList.innerHTML = "";
  if (winnerList) winnerList.innerHTML = "";

  if (!posted.length && postedList) {
    postedList.innerHTML = `
      <div class="page-card faded">
        <h3>No posted items waiting for results</h3>
        <p>Published content will appear here before becoming a winner.</p>
      </div>
    `;
  }

  posted.forEach((item) => {
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

    if (postedList) {
      postedList.appendChild(row);
    }
  });

  if (!winners.length && winnerList) {
    winnerList.innerHTML = `
      <div class="page-card faded">
        <h3>No winners yet</h3>
        <p>Winning content will appear here.</p>
      </div>
    `;
  }

  winners.forEach((item) => {
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

    if (winnerList) {
      winnerList.appendChild(row);
    }
  });
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

  renderWinners();

  alert("Winner saved successfully.");
};

renderWinners();