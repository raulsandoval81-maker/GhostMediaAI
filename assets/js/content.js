const ideaSelect = document.getElementById("ideaSelect");
const generateContentBtn = document.getElementById("generateContentBtn");
const factoryContentBtn = document.getElementById("factoryContentBtn");

const hookOutput = document.getElementById("hookOutput");
const captionOutput = document.getElementById("captionOutput");
const hashtagsOutput = document.getElementById("hashtagsOutput");

let currentContent = null;

function getIdeaCategory(idea) {
  return idea.page || idea.genre || idea.category || "Uncategorized";
}

function loadIdeasIntoSelect() {
  const ideas = gmGetIdeas();

  ideaSelect.innerHTML = "";

  const promotedIdeas = ideas.filter((idea) => idea.status === "PROMOTED");
  const selectableIdeas = promotedIdeas.length ? promotedIdeas : ideas;

  selectableIdeas.forEach((idea) => {
    const option = document.createElement("option");

    option.value = idea.id;
    option.textContent = `${idea.title} — ${getIdeaCategory(idea)}`;

    ideaSelect.appendChild(option);
  });
}

function getContentBlueprint(page) {
  const blueprints = {
    "Wrestling Highlights": {
      postType: "Highlight",
      pattern: "Replay Moment",
      emotion: "Shock + Curiosity",
      tension: "One moment changed the match.",
      lesson: "Momentum can flip in seconds.",
      goal: "Views and shares",
      cta: "Would you rewatch this?",
      angle: "Turn the best moment into a story."
    },

    "Wrestling History": {
      postType: "Story",
      pattern: "Old School Memory",
      emotion: "Nostalgia + Debate",
      tension: "The sport used to feel completely different.",
      lesson: "History explains why the sport changed.",
      goal: "Comments and saves",
      cta: "Did you ever see this happen?",
      angle: "Compare old-school wrestling to today."
    },

    "MMA Moments": {
      postType: "Fight Story",
      pattern: "Momentum Shift",
      emotion: "Shock + Respect",
      tension: "Everyone thought the fight was over.",
      lesson: "Never count someone out.",
      goal: "Watch time and comments",
      cta: "What changed the fight?",
      angle: "Tell the moment as a comeback or turning point."
    },

    "MMA Drama": {
      postType: "Debate",
      pattern: "Controversy",
      emotion: "Reaction + Opinion",
      tension: "Both sides think they are right.",
      lesson: "Drama spreads when people feel forced to choose.",
      goal: "Comments",
      cta: "Whose side are you on?",
      angle: "Frame both sides without overexplaining."
    },

    "Gym Humor": {
      postType: "Meme",
      pattern: "Relatable Joke",
      emotion: "Funny + Familiar",
      tension: "Everybody knows this person.",
      lesson: "Relatable behavior gets shared fast.",
      goal: "Shares and tags",
      cta: "Tag the person who does this.",
      angle: "Make the gym behavior instantly recognizable."
    },

    "Strength Motivation": {
      postType: "Motivation",
      pattern: "Discipline Reminder",
      emotion: "Grit + Focus",
      tension: "Motivation disappears when the work gets boring.",
      lesson: "Discipline beats hype.",
      goal: "Saves",
      cta: "Save this for the next hard day.",
      angle: "Make the boring work feel important."
    },

    "Youth Sports Parents": {
      postType: "Relatable",
      pattern: "Parent Behavior",
      emotion: "Recognition + Tension",
      tension: "The adults can make the ride home harder than the game.",
      lesson: "Support beats control.",
      goal: "Comments and shares",
      cta: "Have you seen this parent?",
      angle: "Say the quiet part parents recognize."
    },

    "Combat Sports News": {
      postType: "News Breakdown",
      pattern: "Headline Context",
      emotion: "Curiosity",
      tension: "The headline matters more than people think.",
      lesson: "Context makes news useful.",
      goal: "Clicks and comments",
      cta: "What does this change?",
      angle: "Explain why the headline matters."
    },

    "Wrestling Technique": {
      postType: "Coach Tip",
      pattern: "Technical Detail",
      emotion: "Useful + Clear",
      tension: "One small mistake ruins the position.",
      lesson: "Small details win big exchanges.",
      goal: "Saves",
      cta: "Save this before practice.",
      angle: "Teach one detail people can use."
    },

    "Underdog Stories": {
      postType: "Comeback Story",
      pattern: "Underdog",
      emotion: "Redemption",
      tension: "Nobody believed them.",
      lesson: "Never count someone out.",
      goal: "Shares",
      cta: "Never count someone out.",
      angle: "Tell the story through tension and payoff."
    }
  };

  return blueprints[page] || {
    postType: "Standard",
    pattern: "Attention Signal",
    emotion: "Curiosity",
    tension: "There is a story under the story.",
    lesson: "Find the hidden reason people reacted.",
    goal: "Engagement",
    cta: "What do you think?",
    angle: "Make the idea simple and easy to react to."
  };
}

function buildStoryCaption(title, notes, blueprint) {

  const cleanNotes =
    String(notes || "")
      .replace(/^Emotion:.*$/gim, "")
      .replace(/^Tension:.*$/gim, "")
      .replace(/^Lesson:.*$/gim, "")
      .trim();

  return `${title}

${blueprint.tension}

The setback looked permanent.

Most people would have quit.

Then everything changed.

${cleanNotes ? cleanNotes + "\n\n" : ""}${blueprint.lesson || blueprint.cta}`;
}

function buildCaption(idea, blueprint) {
  const title = idea.title || "This moment";
  const notes = String(idea.notes || "").trim();

  if (
    blueprint.postType === "Comeback Story" ||
    blueprint.postType === "Fight Story"
  ) {
    return buildStoryCaption(title, notes, blueprint);
  }

  if (blueprint.postType === "Breakdown") {
    return `${title}

Most people watched the obvious part.

But the real story is the detail that changed everything.

${notes ? notes + "\n\n" : ""}${blueprint.cta}`;
  }

  if (blueprint.postType === "Story") {
    return `${title}

${blueprint.tension}

But if you were around it, you remember.

${notes ? notes + "\n\n" : ""}${blueprint.lesson}`;
  }

  if (blueprint.postType === "Meme") {
    return `${title}

${blueprint.tension}

Some of us have been this person.

${notes ? notes + "\n\n" : ""}${blueprint.cta}`;
  }

  if (blueprint.postType === "Debate") {
    return `${title}

${blueprint.tension}

And that is why people keep arguing about it.

${notes ? notes + "\n\n" : ""}${blueprint.cta}`;
  }

  if (blueprint.postType === "Coach Tip") {
    return `${title}

${blueprint.tension}

Simple. Boring. Effective.

${notes ? notes + "\n\n" : ""}${blueprint.lesson}`;
  }

  if (blueprint.postType === "Motivation") {
    return `${title}

${blueprint.tension}

The boring reps are usually the ones that count.

${notes ? notes + "\n\n" : ""}${blueprint.lesson}`;
  }

  return `${title}

${blueprint.tension}

${blueprint.angle}

${notes ? notes + "\n\n" : ""}${blueprint.lesson || blueprint.cta}`;
}

function buildContent(idea) {
  const page = getIdeaCategory(idea);
  const blueprint = getContentBlueprint(page);

  return {
    ideaId: idea.id,
    title: idea.title,
    page,
    postType: blueprint.postType,
    pattern: blueprint.pattern,
    angle: blueprint.angle,
    emotion: blueprint.emotion,
    tension: blueprint.tension,
    lesson: blueprint.lesson,

    emotion: blueprint.emotion,
tension: blueprint.tension,
lesson: blueprint.lesson,

story: {
  tension: blueprint.tension,
  escalation: "The setback looked permanent.",
  turningPoint: "Then everything changed.",
  resolution: idea.title,
  lesson: blueprint.lesson
},

goal: blueprint.goal,
    goal: blueprint.goal,
    cta: blueprint.cta,

    strategy: `Post Type:
${blueprint.postType}

Pattern:
${blueprint.pattern}

Emotion:
${blueprint.emotion}

Tension:
${blueprint.tension}

Lesson:
${blueprint.lesson}

Angle:
${blueprint.angle}

Goal:
${blueprint.goal}

CTA:
${blueprint.cta}`,

    caption: buildCaption(idea, blueprint),
    hashtags: getHashtags(page),
    status: "ready",
    createdAt: new Date().toISOString()
  };
}

function getHashtags(page) {
  const tags = {
    "Wrestling Highlights": "#wrestling #wrestlinghighlights #combatsports #matlife",
    "Wrestling History": "#wrestlinghistory #oldschoolwrestling #wrestlinglife #combatsports",
    "MMA Moments": "#mma #fightiq #combatsports #fightlife",
    "MMA Drama": "#mma #fightdrama #ufc #combatsports",
    "Gym Humor": "#gymhumor #gymmemes #fitnesslife #combatgym",
    "Strength Motivation": "#strengthtraining #discipline #motivation #fitness",
    "Youth Sports Parents": "#youthsports #sportsparents #coaching #parentlife",
    "Combat Sports News": "#combatsports #fightnews #mma #wrestling",
    "Wrestling Technique": "#wrestlingtechnique #wrestlingcoach #wrestlinglife #matwork",
    "Underdog Stories": "#underdog #comebackstory #sportsstory #motivation"
  };

  return tags[page] || "#content #media #storytelling";
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

  window.location.href = "/dashboard/factory.html";
});

loadIdeasIntoSelect();