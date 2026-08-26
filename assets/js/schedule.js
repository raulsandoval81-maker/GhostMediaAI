const scheduleList = document.getElementById("scheduleList");

function getScheduleItems() {
  return gmGetSchedule();
}

function saveScheduleItems(items) {
  gmSaveSchedule(items);
}

function getDefaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function getDefaultTime() {
  return "08:00";
}

function renderSchedule() {
  const items = getScheduleItems();
  scheduleList.innerHTML = "";

  if (!items.length) {
    scheduleList.innerHTML = `
      <div class="page-card faded">
        <h3>No scheduled items yet</h3>
        <p>Approved content from Review will appear here.</p>
      </div>
    `;
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "page-card";

    const date = item.scheduledDate || getDefaultDate();
    const time = item.scheduledTime || getDefaultTime();

    row.innerHTML = `
      <h3>${item.title || "Untitled"}</h3>
      <p>${item.product || item.page || item.type || "GhostMedia AI"}</p>

      <span class="status-pill">SCHEDULED</span>

      <p><strong>Recommended:</strong> ${item.recommendedSlot || "Next available posting window"}</p>

      <label>Platform</label>
      <select id="platform-${item.id}">
        <option ${item.platform === "Facebook" ? "selected" : ""}>Facebook</option>
        <option ${item.platform === "Instagram" ? "selected" : ""}>Instagram</option>
        <option ${item.platform === "LinkedIn" ? "selected" : ""}>LinkedIn</option>
        <option ${item.platform === "X" ? "selected" : ""}>X</option>
        <option ${item.platform === "YouTube" ? "selected" : ""}>YouTube</option>
        <option ${item.platform === "Manual" ? "selected" : ""}>Manual</option>
      </select>

      <label>Date</label>
      <input id="date-${item.id}" type="date" value="${date}">

      <label>Time</label>
      <input id="time-${item.id}" type="time" value="${time}">

      <div class="btn-row">
        <button class="btn" onclick="saveSchedule('${item.id}')">
          💾 Save Schedule
        </button>

        <button class="btn" onclick="markPosted('${item.id}')">
          📣 Mark as Published
        </button>

      </div>
    `;

    scheduleList.appendChild(row);
  });
}

function saveSchedule(id) {
  const items = getScheduleItems();

  const updated = items.map((item) => {
    if (String(item.id) !== String(id)) return item;

    return {
      ...item,
      platform: document.getElementById(`platform-${id}`).value,
      scheduledDate: document.getElementById(`date-${id}`).value,
      scheduledTime: document.getElementById(`time-${id}`).value,
      status: "SCHEDULED",
      updatedAt: new Date().toISOString()
    };
  });

  saveScheduleItems(updated);
  alert("Schedule saved.");
  renderSchedule();
}

function markPosted(id) {
  const items = getScheduleItems();
  const postedItem = items.find(item => String(item.id) === String(id));

  if (postedItem) {
    const posted = gmGetPosted();

    posted.unshift({
      ...postedItem,
      status: "POSTED",
      postedAt: new Date().toISOString()
    });

    gmSavePosted(posted);
  }

  saveScheduleItems(items.filter(item => String(item.id) !== String(id)));
  window.location.assign("/dashboard/published.html?from=schedule");
}

function removeScheduled(id) {
  if (!confirm("Delete this scheduled item?")) return;

  saveScheduleItems(
    getScheduleItems().filter(item => String(item.id) !== String(id))
  );

  renderSchedule();
}

renderSchedule();
