const opportunity = JSON.parse(
  localStorage.getItem("ghost-opportunity") || "null"
);

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "Not available";
}

function buildCTA(opportunity) {
  const topic = String(opportunity?.topic || "").toLowerCase();

  if (topic.includes("game")) {
    return "Follow the build.";
  }

  if (topic.includes("parent")) {
    return "Share this with a sports parent.";
  }

  if (topic.includes("motivation")) {
    return "What keeps you going when progress is slow?";
  }

  return "What should we build next?";
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
    return;
  }

  setText(
    "briefTitle",
    `Build more around: ${opportunity.topic}`
  );

  setText(
    "briefCategory",
    opportunity.topic
  );

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

  setText(
    "briefEmotion",
    opportunity.bestEmotion || "Curiosity"
  );

  setText(
    "briefGoal",
    `Repeat the pattern with better execution. Average views: ${opportunity.avgViews || 0}. Average shares: ${opportunity.avgShares || 0}.`
  );

  setText(
    "briefCTA",
    buildCTA(opportunity)
  );
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
    cta: document.getElementById("briefCTA")?.textContent || ""
  };

  localStorage.setItem(
    "ghost-active-brief",
    JSON.stringify(brief)
  );

  window.location.href = "/dashboard/factory.html";

});

renderBrief();