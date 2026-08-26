const ideaSelect = document.getElementById("ideaSelect");
const generateContentBtn = document.getElementById("generateContentBtn");
const factoryContentBtn = document.getElementById("factoryContentBtn");
const imageContentBtn = document.getElementById("imageContentBtn");

const hookOutput = document.getElementById("hookOutput");
const captionOutput = document.getElementById("captionOutput");
const hashtagsOutput = document.getElementById("hashtagsOutput");

let currentContent = null;

function getIdeaCategory(idea) {
  return (
    idea.page ||
    idea.product ||
    idea.project ||
    idea.genre ||
    idea.category ||
    idea.topic ||
    "General"
  );
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(items) {
  const list = normalizeArray(items).filter(Boolean);

  if (!list.length) {
    return `<li>None</li>`;
  }

  return list.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function routeProduct(idea, ai) {
  const text = `
    ${idea.page || ""}
    ${idea.topic || ""}
    ${idea.title || ""}
    ${ai.topic || ""}
    ${ai.originalContent || ""}
  `.toLowerCase();

  if (
    text.includes("sandman combat games") ||
    text.includes("arena mode") ||
    text.includes("game")
  ) {
    return "Sandman Combat Games";
  }

  if (
    text.includes("fuelai") ||
    text.includes("nutrition") ||
    text.includes("hydration") ||
    text.includes("weight")
  ) {
    return "FuelAI";
  }

  if (
    text.includes("cornerman") ||
    text.includes("match") ||
    text.includes("scout") ||
    text.includes("fight iq")
  ) {
    return "CornermanAI";
  }

  if (
    text.includes("academy") ||
    text.includes("practice") ||
    text.includes("ceremony") ||
    text.includes("athlete")
  ) {
    return "Sandman Academy";
  }

  if (
    text.includes("sandman system") ||
    text.includes("xp") ||
    text.includes("progression")
  ) {
    return "Sandman System";
  }

  if (
    text.includes("ghostmedia") ||
    text.includes("ghost media")
  ) {
    return "GhostMedia AI";
  }

  return "General";
}

function loadIdeasIntoSelect() {
  const ideas = gmGetIdeas();
  ideaSelect.innerHTML = "";

  const promotedIdeas = ideas.filter(
    (idea) => String(idea.status || "").toUpperCase() === "PROMOTED"
  );

  const selectableIdeas = promotedIdeas.length ? promotedIdeas : ideas;

  selectableIdeas.forEach((idea) => {
    const option = document.createElement("option");
    option.value = idea.id;
    option.textContent = `${idea.title} — ${getIdeaCategory(idea)}`;
    ideaSelect.appendChild(option);
  });
}

function extractFromNotes(notes, label) {
  const text = String(notes || "");
  const regex = new RegExp(`${label}:\\s*(.*)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractSourceFromNotes(notes) {
  const text = String(notes || "");
  const marker = "Source:";

  if (!text.includes(marker)) return "";

  return text.split(marker).slice(1).join(marker).trim();
}

function getAIPackage(idea) {
  return {
    topic:
      idea.topic ||
      idea.page ||
      idea.genre ||
      idea.category ||
      "General",

    pattern:
      idea.pattern ||
      extractFromNotes(idea.notes, "Pattern") ||
      "Attention Signal",

    emotion:
      idea.emotion ||
      extractFromNotes(idea.notes, "Emotion") ||
      "Curiosity",

    tension:
      idea.tension ||
      extractFromNotes(idea.notes, "Tension") ||
      "There is a story under the story.",

    lesson:
      idea.lesson ||
      extractFromNotes(idea.notes, "Lesson") ||
      "Find the reason people care.",

    audience: normalizeArray(idea.audience),

    score: idea.score ?? "",

    platforms: normalizeArray(idea.platforms),

    suggestedIdeas: normalizeArray(idea.suggestedIdeas || idea.ideas),

    originalContent:
      idea.originalContent ||
      extractSourceFromNotes(idea.notes) ||
      idea.notes ||
      "",

    source: idea.source || "idea"
  };
}

function buildHeadlineOptions(idea, ai, product) {
  if (product === "Sandman Combat Games") {
    return [
      "Arena Mode Is Finally Playable",
      "From Prototype to Playable",
      "The Biggest Sandman Combat Games Milestone Yet",
      "Months of Work Led to This Moment",
      "A Father and Son Built This Together"
    ];
  }

  if (product === "FuelAI") {
    return [
      "One Better Habit Starts Here",
      "FuelAI Turns Progress Into a Plan",
      "The Numbers Start With the Habits"
    ];
  }

  if (product === "Sandman Academy") {
    return [
      "The Work Is Starting to Show",
      "Built in the Room Before Anyone Saw It",
      "A New Sandman Academy Milestone"
    ];
  }

  return [
    idea.title || ai.pattern || ai.topic || "Story Worth Telling",
    ai.pattern || "The Signal Behind the Story",
    ai.topic || "A New GhostMedia AI Story"
  ];
}

function buildEscalation(ai, product) {
  if (product === "Sandman Combat Games") {
    return "After months of development, the project finally crossed the line from prototype to playable.";
  }

  if (product === "FuelAI") {
    return "The habits started turning into measurable progress.";
  }

  if (product === "Sandman Academy") {
    return "The work behind the scenes began showing up in public.";
  }

  return "The pressure kept building until the story became clear.";
}

function buildTurningPoint(ai, product) {
  if (product === "Sandman Combat Games") {
    return "Arena Mode became the proof that the game is no longer just an idea.";
  }

  if (product === "FuelAI") {
    return "The plan became easier to follow once the system made the next step clear.";
  }

  if (product === "Sandman Academy") {
    return "The private work started becoming a public story.";
  }

  return "That is when the signal became worth turning into content.";
}

function buildCTAOptions(product) {
  if (product === "Sandman Combat Games") {
    return [
      "Follow the build.",
      "Tell us what feature you want next.",
      "Share this with someone waiting for a real wrestling game."
    ];
  }

  if (product === "FuelAI") {
    return [
      "Try one better habit today.",
      "Track your progress.",
      "Start with your next meal."
    ];
  }

  if (product === "Sandman Academy") {
    return [
      "Visit a practice.",
      "Share this with another parent.",
      "Join the next chapter."
    ];
  }

  return [
    "Follow for the next update.",
    "Save this idea.",
    "Share this with someone building something."
  ];
}

function buildEditorialReport(ai, product, headlines, ctas) {
  return {
    route: product,
    recommendation:
      `I would route this to ${product}.`,

    strongestStory:
      `The strongest story is not just the update itself. The strongest story is the progress behind it: ${ai.pattern}.`,

    lead:
      headlines[0],

    reason:
      ai.tension,

    judgment:
      "Use the milestone as the main post. Keep any deeper emotional angle as a follow-up story if it deserves more space.",

    confidence:
      ai.score || "Not scored",

    recommendedCTA:
      ctas[0]
  };
}

function buildStory(idea, ai, product, headlines, ctas) {
  const hook = headlines[0];

  return {
    hook,
    tension: ai.tension,
    escalation: buildEscalation(ai, product),
    turningPoint: buildTurningPoint(ai, product),
    resolution: `${hook} is the clearest way to tell this ${product} story.`,
    lesson: ai.lesson,
    cta: ctas[0],
    headlineOptions: headlines,
    ctaOptions: ctas
  };
}

function buildStrategy(idea, ai, story, product, report) {
  return {
    report,
    product,
    topic: ai.topic,
    pattern: ai.pattern,
    emotion: ai.emotion,
    tension: ai.tension,
    lesson: ai.lesson,
    audience: ai.audience.length ? ai.audience : ["General audience"],
    platforms: ai.platforms.length ? ai.platforms : ["Instagram", "Facebook"],
    score: ai.score || "Not scored",
    story
  };
}

function buildCaption(idea, ai, story) {
  const source = String(ai.originalContent || "").trim();

  return `${story.hook}

${story.tension}

${story.escalation}

${story.turningPoint}

${story.lesson}

${source ? source + "\n\n" : ""}${story.cta}`;
}

function buildHashtags(ai, product) {
  const tags = new Set();

  if (product === "Sandman Combat Games") {
    [
      "#gamedev",
      "#indiedev",
      "#wrestlinggame",
      "#sportsgame",
      "#sandmancombat",
      "#arenamode"
    ].forEach((tag) => tags.add(tag));
  }

  if (product === "FuelAI") {
    [
      "#fuelai",
      "#nutrition",
      "#hydration",
      "#healthhabits",
      "#fitness"
    ].forEach((tag) => tags.add(tag));
  }

  if (product === "CornermanAI") {
    [
      "#cornermanai",
      "#coaching",
      "#fightiq",
      "#combatsports"
    ].forEach((tag) => tags.add(tag));
  }

  if (product === "Sandman Academy") {
    [
      "#sandmancombat",
      "#wrestling",
      "#youthsports",
      "#coaching",
      "#athletedevelopment"
    ].forEach((tag) => tags.add(tag));
  }

  if (!tags.size) {
    [
      "#ghostmediaai",
      "#contentstrategy",
      "#storytelling",
      "#media"
    ].forEach((tag) => tags.add(tag));
  }

  return Array.from(tags).join(" ");
}

function buildContent(idea) {
  const ai = getAIPackage(idea);
  const product = routeProduct(idea, ai);
  const headlines = buildHeadlineOptions(idea, ai, product);
  const ctas = buildCTAOptions(product);
  const report = buildEditorialReport(ai, product, headlines, ctas);
  const story = buildStory(idea, ai, product, headlines, ctas);

  return {
    ideaId: idea.id,
    title: story.hook,
    page: product,
    product,
    topic: ai.topic,
    pattern: ai.pattern,
    emotion: ai.emotion,
    tension: ai.tension,
    lesson: ai.lesson,
    audience: ai.audience,
    score: ai.score,
    platforms: ai.platforms,
    originalContent: ai.originalContent,
    story,
    editorialReport: report,
    strategy: buildStrategy(idea, ai, story, product, report),
    caption: buildCaption(idea, ai, story),
    hashtags: buildHashtags(ai, product),
    status: "ready",
    source: "content",
    createdAt: new Date().toISOString()
  };
}

function renderStrategy(strategy) {
  const report = strategy.report;
  const story = strategy.story;

  return `
    <div class="content-brief">

      <section class="report-card">
        <h3>🤖 GhostMedia AI Report</h3>
        <p><strong>Coach, here's my recommendation.</strong></p>
        <p>${escapeHtml(report.recommendation)}</p>
        <p>${escapeHtml(report.strongestStory)}</p>

        <div class="content-callout">
          <span>I would lead with:</span>
          <strong>"${escapeHtml(report.lead)}"</strong>
        </div>

        <p><strong>Reason:</strong><br>${escapeHtml(report.reason)}</p>
        <p><strong>Editorial judgment:</strong><br>${escapeHtml(report.judgment)}</p>
        <p><strong>Confidence:</strong> ${escapeHtml(report.confidence)}/10</p>
        <p><strong>Recommended CTA:</strong> ${escapeHtml(report.recommendedCTA)}</p>
      </section>

      <section class="strategy-card">
        <h3>📋 Strategy</h3>

        <div class="brief-grid">
          <div>
            <span>Product</span>
            <strong>${escapeHtml(strategy.product)}</strong>
          </div>

          <div>
            <span>Score</span>
            <strong>${escapeHtml(strategy.score)}</strong>
          </div>
        </div>

        <p><strong>Topic:</strong><br>${escapeHtml(strategy.topic)}</p>
        <p><strong>Pattern:</strong><br>${escapeHtml(strategy.pattern)}</p>
        <p><strong>Emotion:</strong><br>${escapeHtml(strategy.emotion)}</p>
        <p><strong>Tension:</strong><br>${escapeHtml(strategy.tension)}</p>
        <p><strong>Lesson:</strong><br>${escapeHtml(strategy.lesson)}</p>

        <h4>Audience</h4>
        <ul>${renderList(strategy.audience)}</ul>

        <h4>Platforms</h4>
        <ul>${renderList(strategy.platforms)}</ul>
      </section>

      <section class="strategy-card">
        <h3>🧲 Headline Options</h3>
        <ol>
          ${story.headlineOptions
            .map((headline) => `<li>${escapeHtml(headline)}</li>`)
            .join("")}
        </ol>
      </section>

      <section class="strategy-card">
        <h3>🎯 CTA Options</h3>
        <ol>
          ${story.ctaOptions
            .map((cta) => `<li>${escapeHtml(cta)}</li>`)
            .join("")}
        </ol>
      </section>

      <section class="strategy-card">
        <h3>🧱 Story Structure</h3>

        <p><strong>Hook:</strong><br>${escapeHtml(story.hook)}</p>
        <p><strong>Tension:</strong><br>${escapeHtml(story.tension)}</p>
        <p><strong>Escalation:</strong><br>${escapeHtml(story.escalation)}</p>
        <p><strong>Turning Point:</strong><br>${escapeHtml(story.turningPoint)}</p>
        <p><strong>Resolution:</strong><br>${escapeHtml(story.resolution)}</p>
        <p><strong>Lesson:</strong><br>${escapeHtml(story.lesson)}</p>
        <p><strong>CTA:</strong><br>${escapeHtml(story.cta)}</p>
      </section>

    </div>
  `;
}

function renderContent(content) {
  hookOutput.outerHTML = `
    <div id="hookOutput" class="content-output">
      ${renderStrategy(content.strategy)}
    </div>
  `;

  captionOutput.outerHTML = `
    <div id="captionOutput" class="content-output caption-card">
      ${escapeHtml(content.caption).replace(/\n/g, "<br>")}
    </div>
  `;

  hashtagsOutput.outerHTML = `
    <div id="hashtagsOutput" class="content-output hashtag-card">
      ${escapeHtml(content.hashtags)}
    </div>
  `;
}

generateContentBtn.addEventListener("click", () => {
  const ideas = gmGetIdeas();
  const selectedId = ideaSelect.value;

  const idea = ideas.find(
    (item) => String(item.id) === String(selectedId)
  );

  if (!idea) return;

  currentContent = buildContent(idea);
  renderContent(currentContent);
});

factoryContentBtn.addEventListener("click", () => {
  if (!currentContent) {
    alert("Generate content first.");
    return;
  }

  localStorage.setItem(
    "ghost-factory-payload",
    JSON.stringify({
      ...currentContent,
      source: "content",
      sentToFactoryAt: new Date().toISOString()
    })
  );

  window.location.assign("/dashboard/factory.html?from=content");
});

imageContentBtn.addEventListener("click", () => {
  if (!currentContent) {
    alert("Generate content first.");
    return;
  }

  localStorage.setItem("ghost-image-payload", JSON.stringify({
    sourceId: currentContent.ideaId || null,
    sourceType: "draft-content",
    sourceTitle: currentContent.title,
    title: currentContent.title,
    product: currentContent.product || currentContent.page || "",
    category: currentContent.page || currentContent.product || "",
    topic: currentContent.topic || "",
    hook: currentContent.title || "",
    prompt: currentContent.strategy?.recommendation || currentContent.caption || "",
    caption: currentContent.caption || "",
    cta: currentContent.story?.cta || ""
  }));

  window.location.assign("/dashboard/image-generator.html?from=content");
});

loadIdeasIntoSelect();
