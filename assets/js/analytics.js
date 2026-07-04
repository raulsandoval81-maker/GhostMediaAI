const ideas = JSON.parse(localStorage.getItem("ghostmedia-ideas") || "[]");
const queue = JSON.parse(localStorage.getItem("ghost-queue") || "[]");
const schedule = JSON.parse(localStorage.getItem("ghost-schedule") || "[]");
const published = JSON.parse(localStorage.getItem("ghost-posted") || "[]");
const winners = JSON.parse(localStorage.getItem("ghost-winners") || "[]");
const patterns = JSON.parse(localStorage.getItem("ghostmedia-patterns") || "[]");

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function average(items, field) {
  if (!items.length) return 0;

  return Math.round(
    items.reduce((sum, item) => {
      return sum + Number(item[field] || 0);
    }, 0) / items.length
  );
}

function getWinnerScore(item) {
  return (
    Number(item.views || 0) +
    Number(item.likes || 0) * 5 +
    Number(item.comments || 0) * 10 +
    Number(item.shares || 0) * 15
  );
}

function renderCounts() {
  setText("ideaCount", ideas.length);
  setText("queueCount", queue.length);
  setText("scheduleCount", schedule.length);
  setText("publishedCount", published.length);
  setText("winnerCount", winners.length);
  setText("patternCount", patterns.length);
}

function renderPerformance() {
  const totalPosted = published.length + winners.length;

  const winRate = totalPosted
    ? Math.round((winners.length / totalPosted) * 100)
    : 0;

  setText("winRate", `${winRate}%`);
  setText("avgViews", average(winners, "views"));
  setText("avgLikes", average(winners, "likes"));
  setText("avgShares", average(winners, "shares"));
}

function renderTopWinner() {
  const target = document.getElementById("topWinnerCard");
  if (!target) return;

  if (!winners.length) {
    target.innerHTML = `
      <div class="page-card faded">
        <h3>No winner yet</h3>
        <p>Promote posted content into Winners to populate this section.</p>
      </div>
    `;
    return;
  }

  const best = [...winners].sort((a, b) => {
    return getWinnerScore(b) - getWinnerScore(a);
  })[0];

  target.innerHTML = `
    <div class="page-card">
      <h3>${best.title || "Untitled"}</h3>
      <p>${best.page || best.product || "GhostMedia"}</p>
      <p>
        👁 ${best.views || 0}
        &nbsp; 👍 ${best.likes || 0}
        &nbsp; 💬 ${best.comments || 0}
        &nbsp; 🔁 ${best.shares || 0}
      </p>
    </div>
  `;
}

function renderBarChart(id, rows) {
  const el = document.getElementById(id);
  if (!el) return;

  if (!rows.length) {
    el.innerHTML = `
      <div class="page-card faded">
        <h3>No chart data yet</h3>
        <p>More activity is needed before this chart has data.</p>
      </div>
    `;
    return;
  }

  const max = Math.max(
    ...rows.map((row) => Number(row.value || 0)),
    1
  );

  el.innerHTML = rows.map((row) => {
    const value = Number(row.value || 0);
    const percent = Math.max((value / max) * 100, value > 0 ? 6 : 0);

    return `
      <div class="chart-row">
        <div class="chart-label">${row.label}</div>

        <div class="chart-track">
          <div class="chart-fill" style="width:${percent}%"></div>
        </div>

        <div class="chart-value">${value}</div>
      </div>
    `;
  }).join("");
}

function renderFunnelChart() {
  renderBarChart("funnelChart", [
    { label: "Ideas", value: ideas.length },
    { label: "Queued", value: queue.length },
    { label: "Scheduled", value: schedule.length },
    { label: "Published", value: published.length },
    { label: "Winners", value: winners.length }
  ]);
}

function renderWinnerMetricChart() {
  renderBarChart("winnerMetricChart", [
    { label: "Views", value: average(winners, "views") },
    { label: "Likes", value: average(winners, "likes") },
    { label: "Comments", value: average(winners, "comments") },
    { label: "Shares", value: average(winners, "shares") }
  ]);
}

function renderPatternChart() {
  const patternCounts = {};

  patterns.forEach((item) => {
    const name = item.pattern || item.topic || "Unknown";
    patternCounts[name] = (patternCounts[name] || 0) + 1;
  });

  const rows = Object.entries(patternCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  renderBarChart("patternChart", rows);
}

renderCounts();
renderPerformance();
renderTopWinner();
renderFunnelChart();
renderWinnerMetricChart();
renderPatternChart();