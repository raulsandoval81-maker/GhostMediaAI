const opportunity = gmGetOpportunity();

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "Not available";
}

function buildCTA(opportunity) {
  const topic = String(opportunity?.topic || "").toLowerCase();

  if (topic.includes("game")) return "Follow the build.";
  if (topic.includes("parent")) return "Share this with a sports parent.";
  if (topic.includes("motivation")) return "What keeps you going when progress is slow?";

  return "What should we build next?";
}

function renderWinnerReference() {
  const wrap = document.querySelector(".wrap");
  if (!wrap || !opportunity) return;

  const existing = document.getElementById("winnerReferenceCard");
  if (existing) existing.remove();

  const winner =
    opportunity.topItem ||
    opportunity.bestExample ||
    opportunity.winner ||
    null;

  const card = document.createElement("div");
  card.id = "winnerReferenceCard";
  card.className = "card";

  card.innerHTML = `
    <h2>🏆 Winner Reference</h2>

    <p>
      <strong>Best Example:</strong>
      ${winner?.title || opportunity.bestHook || "No specific winner attached"}
    </p>

    <p>
      <strong>Category:</strong>
      ${winner?.product || winner?.page || opportunity.topic || "General"}
    </p>

    <p>
      <strong>Results:</strong>
      ${winner?.views || 0} views ·
      ${winner?.likes || 0} likes ·
      ${winner?.comments || 0} comments ·
      ${winner?.shares || 0} shares
    </p>
  `;

  const firstCard = wrap.querySelector(".card");
  if (firstCard) {
    wrap.insertBefore(card, firstCard);
  } else {
    wrap.appendChild(card);
  }
}

function renderBrief() {
  if (!opportunity) {
    setText("briefTitle", "No opportunity selected");
    setText("briefCategory", "Go to Opportunities first.");
    setText("briefPattern", "None");
    setText("briefHook", "None");
    setText("briefAngle", "No brief can be generated yet.");
    setText("briefEmotion", "None");
    setText("briefGoal", "Select an opportunity.");
    setText("briefCTA", "Return to Opportunities.");
    const action = document.getElementById("sendToFactoryBtn");
    if (action) {
      action.disabled = true;
      action.textContent = "Select a Recommendation First";
    }
    return;
  }

  renderWinnerReference();

  setText("briefTitle", `Build more around: ${opportunity.topic}`);
  setText("briefCategory", opportunity.topic);

  setText(
    "briefPattern",
    `${opportunity.winners} winner(s) · Score ${Math.round(opportunity.score || 0)}`
  );

  setText(
    "briefHook",
    opportunity.bestHook || "Use the strongest proven hook."
  );

  setText(
    "briefAngle",
    `Create a ${opportunity.bestFormat || "content"} piece for ${opportunity.bestPlatform || "the best platform"} using the emotion that already worked: ${opportunity.bestEmotion || "curiosity"}.`
  );

  setText("briefEmotion", opportunity.bestEmotion || "Curiosity");

  setText(
    "briefGoal",
    `Repeat the pattern with better execution. Average views: ${opportunity.avgViews || 0}. Average shares: ${opportunity.avgShares || 0}.`
  );

  setText("briefCTA", buildCTA(opportunity));
}

const sendToFactoryBtn = document.getElementById("sendToFactoryBtn");

sendToFactoryBtn?.addEventListener("click", () => {
  const brief = {
    title: document.getElementById("briefTitle")?.textContent || "",
    category: document.getElementById("briefCategory")?.textContent || "",
    pattern: document.getElementById("briefPattern")?.textContent || "",
    hook: document.getElementById("briefHook")?.textContent || "",
    angle: document.getElementById("briefAngle")?.textContent || "",
    emotion: document.getElementById("briefEmotion")?.textContent || "",
    goal: document.getElementById("briefGoal")?.textContent || "",
    cta: document.getElementById("briefCTA")?.textContent || "",
    winnerReference:
      opportunity?.topItem ||
      opportunity?.bestExample ||
      null
  };

  localStorage.setItem(
    "ghost-active-brief",
    JSON.stringify(brief)
  );

  localStorage.setItem(
    "ghost-factory-payload",
    JSON.stringify({
      title: brief.title,
      page: brief.category,
      topic: brief.category,
      pattern: brief.pattern,
      emotion: brief.emotion,
      tension: brief.hook,
      lesson: brief.goal,
      caption: brief.angle,
      sourceType: "brief",
      source: "brief-engine",
      sentToFactoryAt: new Date().toISOString()
    })
  );

  window.location.href = "/dashboard/factory.html";
});

renderBrief();
