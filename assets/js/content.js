const ideaSelect = document.getElementById("ideaSelect");
const generateContentBtn = document.getElementById("generateContentBtn");
const factoryContentBtn = document.getElementById("factoryContentBtn");

const hookOutput = document.getElementById("hookOutput");
const captionOutput = document.getElementById("captionOutput");
const hashtagsOutput = document.getElementById("hashtagsOutput");

let currentContent = null;

function getIdeaCategory(idea) {
  return idea.page || idea.product || idea.project || idea.genre || idea.category || idea.topic || "General";
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function routeProduct(idea, ai) {
  const text = `
    ${idea.page || ""}
    ${idea.topic || ""}
    ${idea.title || ""}
    ${ai.topic || ""}
    ${ai.originalContent || ""}
  `.toLowerCase();

  if (text.includes("sandman combat games") || text.includes("arena mode") || text.includes("game")) {
    return "Sandman Combat Games";
  }

  if (text.includes("fuelai") || text.includes("nutrition") || text.includes("hydration") || text.includes("weight")) {
    return "FuelAI";
  }

  if (text.includes("cornerman") || text.includes("match") || text.includes("scout") || text.includes("fight iq")) {
    return "CornermanAI";
  }

  if (text.includes("academy") || text.includes("practice") || text.includes("ceremony") || text.includes("athlete")) {
    return "Sandman Academy";
  }

  if (text.includes("sandman system") || text.includes("xp") || text.includes("progression")) {
    return "Sandman System";
  }

  if (text.includes("ghostmedia") || text.includes("ghost media")) {
    return "GhostMedia AI";
  }

  return "General";
}

function loadIdeasIntoSelect() {
  const ideas = gmGetIdeas();
  ideaSelect.innerHTML = "";

  const promotedIdeas = ideas.filter(
    idea => String(idea.status || "").toUpperCase() === "PROMOTED"
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
    topic: idea.topic || idea.page || idea.genre || idea.category || "General",
    pattern: idea.pattern || extractFromNotes(idea.notes, "Pattern") || "Attention Signal",
    emotion: idea.emotion || extractFromNotes(idea.notes, "Emotion") || "Curiosity",
    tension: idea.tension || extractFromNotes(idea.notes, "Tension") || "There is a story under the story.",
    lesson: idea.lesson || extractFromNotes(idea.notes, "Lesson") || "Find the reason people care.",
    audience: normalizeArray(idea.audience),
    score: idea.score ?? "",
    platforms: normalizeArray(idea.platforms),
    suggestedIdeas: normalizeArray(idea.suggestedIdeas || idea.ideas),
    originalContent: idea.originalContent || extractSourceFromNotes(idea.notes) || idea.notes || "",
    source: idea.source || "idea"
  };
}

function buildHeadlineOptions(idea, ai, product) {
  const text = `${idea.title || ""} ${ai.topic || ""} ${ai.originalContent || ""}`.toLowerCase();

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
  return `🤖 GhostMedia AI Report

Coach, here's my recommendation.

I would route this to ${product}.

The strongest story is not just the update itself. The strongest story is the progress behind it: ${ai.pattern}.

I would lead with:
"${headlines[0]}"

Reason:
${ai.tension}

Editorial judgment:
Use the milestone as the main post. Keep any deeper emotional angle as a follow-up story if it deserves more space.

Confidence:
${ai.score || "Not scored"}/10

Recommended CTA:
${ctas[0]}`;
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
  return `${report}

--------------------

Strategy

Product:
${product}

Topic:
${ai.topic}

Pattern:
${ai.pattern}

Emotion:
${ai.emotion}

Tension:
${ai.tension}

Lesson:
${ai.lesson}

Audience:
${ai.audience.length ? ai.audience.join(", ") : "General audience"}

Platforms:
${ai.platforms.length ? ai.platforms.join(", ") : "Instagram, Facebook"}

Score:
${ai.score || "Not scored"}

Headline Options:
${story.headlineOptions.map((h, i) => `${i + 1}. ${h}`).join("\n")}

CTA Options:
${story.ctaOptions.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Story Structure:

Hook:
${story.hook}

Tension:
${story.tension}

Escalation:
${story.escalation}

Turning Point:
${story.turningPoint}

Resolution:
${story.resolution}

Lesson:
${story.lesson}

CTA:
${story.cta}`;
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
    ["#gamedev", "#indiedev", "#wrestlinggame", "#sportsgame", "#sandmancombat", "#arenamode"].forEach(t => tags.add(t));
  }

  if (product === "FuelAI") {
    ["#fuelai", "#nutrition", "#hydration", "#healthhabits", "#fitness"].forEach(t => tags.add(t));
  }

  if (product === "CornermanAI") {
    ["#cornermanai", "#coaching", "#fightiq", "#combatsports"].forEach(t => tags.add(t));
  }

  if (product === "Sandman Academy") {
    ["#sandmancombat", "#wrestling", "#youthsports", "#coaching", "#athletedevelopment"].forEach(t => tags.add(t));
  }

  if (!tags.size) {
    ["#ghostmediaai", "#contentstrategy", "#storytelling", "#media"].forEach(t => tags.add(t));
  }

  return Array.from(tags).join(" ");
}

function buildContent(idea) {
  const ai = getAIPackage(idea);
  const product = routeProduct(idea, ai);
  const headlines = buildHeadlineOptions(idea, ai, product);
  const ctas = buildCTAOptions(product);
  const story = buildStory(idea, ai, product, headlines, ctas);
  const report = buildEditorialReport(ai, product, headlines, ctas);

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

function renderContent(content) {
  hookOutput.textContent = content.strategy;
  captionOutput.textContent = content.caption;
  hashtagsOutput.textContent = content.hashtags;
}

generateContentBtn.addEventListener("click", () => {
  const ideas = gmGetIdeas();
  const selectedId = ideaSelect.value;

  const idea = ideas.find(
    item => String(item.id) === String(selectedId)
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

loadIdeasIntoSelect();