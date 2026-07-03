const ideaSelect =
  document.getElementById("ideaSelect");

const generateContentBtn =
  document.getElementById("generateContentBtn");

const factoryContentBtn =
  document.getElementById("factoryContentBtn");

const hookOutput =
  document.getElementById("hookOutput");

const captionOutput =
  document.getElementById("captionOutput");

const hashtagsOutput =
  document.getElementById("hashtagsOutput");

let currentContent = null;

function getIdeaCategory(idea) {
  return (
    idea.page ||
    idea.genre ||
    idea.category ||
    idea.topic ||
    "General"
  );
}

function loadIdeasIntoSelect() {
  const ideas =
    gmGetIdeas();

  ideaSelect.innerHTML = "";

  const promotedIdeas =
    ideas.filter(
      idea =>
        String(idea.status || "").toUpperCase() ===
        "PROMOTED"
    );

  const selectableIdeas =
    promotedIdeas.length
      ? promotedIdeas
      : ideas;

  selectableIdeas.forEach((idea) => {
    const option =
      document.createElement("option");

    option.value =
      idea.id;

    option.textContent =
      `${idea.title} — ${getIdeaCategory(idea)}`;

    ideaSelect.appendChild(option);
  });
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

    audience:
      idea.audience || [],

    score:
      idea.score || 0,

    platforms:
      idea.platforms || [],

    originalContent:
      idea.originalContent ||
      extractSourceFromNotes(idea.notes) ||
      idea.notes ||
      "",

    source:
      idea.source || "idea"
  };
}

function extractFromNotes(notes, label) {
  const text =
    String(notes || "");

  const regex =
    new RegExp(`${label}:\\s*(.*)`, "i");

  const match =
    text.match(regex);

  return match
    ? match[1].trim()
    : "";
}

function extractSourceFromNotes(notes) {
  const text =
    String(notes || "");

  const marker =
    "Source:";

  if (!text.includes(marker)) {
    return "";
  }

  return text
    .split(marker)
    .slice(1)
    .join(marker)
    .trim();
}

function buildStory(idea, ai) {
  const title =
    idea.title || "Untitled Idea";

  return {
    hook:
      title,

    tension:
      ai.tension,

    escalation:
      buildEscalation(ai),

    turningPoint:
      buildTurningPoint(ai),

    resolution:
      buildResolution(idea, ai),

    lesson:
      ai.lesson,

    cta:
      buildCTA(ai)
  };
}

function buildEscalation(ai) {
  const topic =
    String(ai.topic || "").toLowerCase();

  if (topic.includes("game")) {
    return "The project is starting to feel real.";
  }

  if (topic.includes("fuel")) {
    return "Small habits are starting to show up in the results.";
  }

  if (topic.includes("academy") || topic.includes("sandman")) {
    return "The work behind the scenes is beginning to show.";
  }

  return "The pressure kept building.";
}

function buildTurningPoint(ai) {
  const pattern =
    String(ai.pattern || "").toLowerCase();

  if (pattern.includes("development")) {
    return "Then the next piece finally started working.";
  }

  if (pattern.includes("comeback")) {
    return "Then everything changed.";
  }

  if (pattern.includes("milestone")) {
    return "Then the progress became visible.";
  }

  return "Then the story shifted.";
}

function buildResolution(idea, ai) {
  const title =
    idea.title || "The moment became the story.";

  const topic =
    ai.topic || "GhostMedia AI";

  return `${title} became a ${topic} story.`;
}

function buildCTA(ai) {
  const topic =
    String(ai.topic || "").toLowerCase();

  if (topic.includes("game")) {
    return "Follow the build.";
  }

  if (topic.includes("fuel")) {
    return "Start with one better habit today.";
  }

  if (topic.includes("academy") || topic.includes("sandman")) {
    return "Built in the shadows. Revealed through the work.";
  }

  return "What do you think?";
}

function buildStrategy(idea, ai, story) {
  return `Topic:
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
  const source =
    String(ai.originalContent || "").trim();

  return `${story.hook}

${story.tension}

${story.escalation}

${story.turningPoint}

${story.resolution}

${story.lesson}

${source ? source + "\n\n" : ""}${story.cta}`;
}

function buildHashtags(ai) {
  const topic =
    String(ai.topic || "").toLowerCase();

  if (topic.includes("game")) {
    return "#gamedev #indiedev #wrestlinggame #sportsゲーム #sandmancombat";
  }

  if (topic.includes("fuel")) {
    return "#nutrition #hydration #healthhabits #fuelai #fitness";
  }

  if (topic.includes("cornerman")) {
    return "#coaching #fightiq #combatsports #cornermanai";
  }

  if (topic.includes("academy") || topic.includes("sandman")) {
    return "#wrestling #youthsports #coaching #sandmancombat #athletedevelopment";
  }

  if (topic.includes("mma")) {
    return "#mma #combatsports #fightlife #ufc #fightiq";
  }

  return "#ghostmediaai #contentstrategy #storytelling #media";
}

function buildContent(idea) {
  const ai =
    getAIPackage(idea);

  const story =
    buildStory(idea, ai);

  return {
    ideaId:
      idea.id,

    title:
      idea.title,

    page:
      ai.topic,

    topic:
      ai.topic,

    pattern:
      ai.pattern,

    emotion:
      ai.emotion,

    tension:
      ai.tension,

    lesson:
      ai.lesson,

    audience:
      ai.audience,

    score:
      ai.score,

    platforms:
      ai.platforms,

    originalContent:
      ai.originalContent,

    story,

    strategy:
      buildStrategy(idea, ai, story),

    caption:
      buildCaption(idea, ai, story),

    hashtags:
      buildHashtags(ai),

    status:
      "ready",

    source:
      "content",

    createdAt:
      new Date().toISOString()
  };
}

function renderContent(content) {
  hookOutput.textContent =
    content.strategy;

  captionOutput.textContent =
    content.caption;

  hashtagsOutput.textContent =
    content.hashtags;
}

generateContentBtn.addEventListener("click", () => {
  const ideas =
    gmGetIdeas();

  const selectedId =
    ideaSelect.value;

  const idea =
    ideas.find(
      item =>
        String(item.id) ===
        String(selectedId)
    );

  if (!idea) return;

  currentContent =
    buildContent(idea);

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
      sentToFactoryAt:
        new Date().toISOString()
    })
  );

  window.location.href =
    "/dashboard/factory.html";
});

loadIdeasIntoSelect();