const queueReady = document.getElementById("queueReady");
const queueQueued = document.getElementById("queueQueued");

let showAllReady = false;
let showAllQueued = false;

const QUEUE_VISIBLE_LIMIT = 2;

function getQueueItems() {
  const ideas = gmGetIdeas();

  const creativeQueue = gmGetQueue();

  const creativeItems = creativeQueue.map((item) => ({
    id: item.id,
    title: item.title || "Queued Carousel",
    type: item.type || "carousel",
    status: item.status || "QUEUED",
    product: item.payload?.product || item.payload?.page || "",
    caption: item.payload?.caption || "",
    hashtags: item.payload?.hashtags || "",
    slides: item.slides || item.payload?.slides || [],
    payload: item.payload || {},
    source: item.source || "creative",
    storageCollection: "queue",
    queuedAt: item.queuedAt || ""
  }));

  return [...ideas.map((item) => ({ ...item, storageCollection: "ideas" })), ...creativeItems];
}

function getLabel(item) {
  return (
    item.product ||
    item.page ||
    item.topic ||
    item.genre ||
    item.type ||
    "Uncategorized"
  );
}

function renderReviewPreview(item) {
  const payload = item.payload || {};
  const image = payload.image || payload.payload?.image || "";
  const video = payload.sourceVideo || "";
  const clip = item.type === "short-clip" || payload.format === "short-video";

  if (image) {
    return `<div class="review-media-preview"><img src="${image}" alt="${gmEscapeHtml(item.title || "Creative preview")}"></div>`;
  }

  if (video) {
    return `<div class="review-media-preview"><video controls playsinline src="${video}"></video></div>`;
  }

  if (clip) {
    return `
      <div class="review-media-preview page-card faded">
        <p><strong>Source:</strong> ${gmEscapeHtml(payload.sourceFile?.name || "Device video reference")}</p>
        <p><strong>Clip:</strong> ${payload.startTime ?? 0}s → ${payload.endTime ?? 0}s</p>
        <p>${gmEscapeHtml(payload.hook || payload.caption || "Short clip concept")}</p>
      </div>
    `;
  }

  return item.caption ? `<p>${gmEscapeHtml(item.caption)}</p>` : "";
}

function canOpenCarouselPreview(item) {
  return item.type === "carousel" || Array.isArray(item.slides) && item.slides.length > 0;
}

function renderSection(container, items, type) {
  container.innerHTML = "";

  const expanded = type === "ready" ? showAllReady : showAllQueued;

  const visibleItems = expanded
    ? items
    : items.slice(0, QUEUE_VISIBLE_LIMIT);

  const hiddenCount = Math.max(items.length - QUEUE_VISIBLE_LIMIT, 0);

  if (!items.length) {
    container.innerHTML = `
      <div class="page-card faded">
        <h3>No items here</h3>
        <p>Nothing is currently in this section.</p>
      </div>
    `;
    return;
  }

  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleItems.length} of ${items.length}</h3>
  `;
  container.appendChild(header);

  visibleItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "page-card";

    const title = item.title || "Untitled";
    const label = getLabel(item);
    const mediaPreview = renderReviewPreview(item);
    const previewButton = canOpenCarouselPreview(item)
      ? `<button class="btn" onclick="previewItem('${item.id}')">👁 Review</button>`
      : "";

    if (type === "ready") {
      row.innerHTML = `
        <h3>${gmEscapeHtml(title)}</h3>
        <p>${gmEscapeHtml(label)}</p>
        ${mediaPreview}

        <span class="status-pill">
          NEEDS REVIEW
        </span>

        <div class="btn-row">
          ${previewButton}

          <button class="btn"
            onclick="approveItem('${item.id}','${item.storageCollection || "ideas"}')">
            ✅ Approve
          </button>

          <button class="btn"
            onclick="deleteReviewItem('${item.id}','${item.storageCollection || "ideas"}')">
            🗑 Delete
          </button>
        </div>
      `;
    }

    if (type === "queued") {
      row.innerHTML = `
        <h3>${gmEscapeHtml(title)}</h3>
        <p>${gmEscapeHtml(label)}</p>
        ${mediaPreview}

        <span class="status-pill">
          APPROVED FOR SCHEDULING
        </span>

        <div class="btn-row">
          ${previewButton}

          <button class="btn"
            onclick="sendToSchedule('${item.id}','${item.storageCollection || "ideas"}')">
            📅 Send To Schedule
          </button>

        </div>
      `;
    }

    container.appendChild(row);
  });

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.className = "btn ghost-toggle-btn";

    toggle.textContent = expanded
      ? "▲ Hide Items"
      : `▼ Show ${hiddenCount} More`;

    toggle.addEventListener("click", () => {
      if (type === "ready") {
        showAllReady = !showAllReady;
      } else {
        showAllQueued = !showAllQueued;
      }

      renderQueue();
    });

    container.appendChild(toggle);
  }
}

function renderQueue() {
  const items = getQueueItems();

  const readyItems = items.filter((item) => {
    const status = String(item.status || "").toUpperCase();
    return status === "IDEA" || status === "NEW" || status === "READY";
  });

  const queuedItems = items.filter((item) => {
    const status = String(item.status || "").toUpperCase();
    return status === "QUEUED";
  });

  renderSection(queueReady, readyItems, "ready");
  renderSection(queueQueued, queuedItems, "queued");
}

function previewItem(id) {
  const items = getQueueItems();

  const item = items.find(
    x => String(x.id) === String(id)
  );

  if (!item) return;

  const payload =
    item.payload && Object.keys(item.payload).length
      ? item.payload
      : {
          slide1: item.slides?.[0] || item.title || "Slide 1",
          slide2: item.slides?.[1] || "Slide 2",
          slide3: item.slides?.[2] || "Slide 3",
          slide4: item.slides?.[3] || "Slide 4",
          slide5: item.slides?.[4] || "Slide 5",
          caption: item.caption || "",
          hashtags: item.hashtags || ""
        };

  localStorage.setItem(
    "ghost-carousel-payload",
    JSON.stringify(payload)
  );

  window.location.assign("/carousel/?from=queue");
}

function sendToSchedule(id, storageCollection) {
  const items = getQueueItems();

  const item = items.find(
    x => String(x.id) === String(id)
  );

  if (!item) return;

  const scheduled = gmGetSchedule();

  scheduled.unshift({
    ...item,
    status: "SCHEDULED",
    recommendedSlot: "Next available posting window",
    sentToScheduleAt: new Date().toISOString()
  });

  gmSaveSchedule(scheduled);

  if (storageCollection === "queue") {
    const queue = gmGetQueue();
    gmSaveQueue(queue.filter(x => String(x.id) !== String(id)));
  } else {
    gmUpdateIdeaStatus(id, "SCHEDULED");
  }

  window.location.assign("/dashboard/schedule.html");
}

function moveIdea(id, status) {
  gmUpdateIdeaStatus(id, status);
  showAllReady = false;
  showAllQueued = false;
  renderQueue();
}

function approveItem(id, storageCollection) {
  if (storageCollection === "queue") {
    const queue = gmGetQueue().map((item) =>
      String(item.id) === String(id)
        ? { ...item, status: "QUEUED", approvedAt: new Date().toISOString() }
        : item
    );
    gmSaveQueue(queue);
  } else {
    gmUpdateIdeaStatus(id, "QUEUED");
  }

  showAllReady = false;
  showAllQueued = false;
  renderQueue();
}

function deleteReviewItem(id, storageCollection) {
  if (storageCollection === "queue") {
    gmSaveQueue(gmGetQueue().filter((item) => String(item.id) !== String(id)));
    renderQueue();
    return;
  }

  deleteIdea(id);
}

function deleteIdea(id) {
  if (!confirm("Delete this item?")) return;

  gmSaveIdeas(
    gmGetIdeas().filter(
      x => String(x.id) !== String(id)
    )
  );

  renderQueue();
}

function deleteQueuedItem(id, source) {
  if (!confirm("Delete this queued item?")) return;

  if (source === "carousel") {
    const queue = gmGetQueue();
    gmSaveQueue(
      queue.filter(x => String(x.id) !== String(id))
    );
  } else {
    deleteIdea(id);
    return;
  }

  renderQueue();
}

renderQueue();
