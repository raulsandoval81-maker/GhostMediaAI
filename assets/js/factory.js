const factoryWinner = document.getElementById("factoryWinner");
const generateFactoryBtn = document.getElementById("generateFactoryBtn");
const saveFactoryBtn = document.getElementById("saveFactoryBtn");
const factoryOutput = document.getElementById("factoryOutput");
const generateCarouselBtn = document.getElementById("generateCarouselBtn");
const generateImageBtn = document.getElementById("generateImageBtn");

let factoryIdeas = [];
let currentWinner = null;
let showAllFactoryIdeas = false;
const FACTORY_VISIBLE_LIMIT = 2;

const factoryPayload = JSON.parse(
  localStorage.getItem("ghost-factory-payload") || "null"
);

function getWinners() {
  return gmGetWinners();
}

function getWinnerGenre(winner) {
  return (
    winner?.page ||
    winner?.genre ||
    winner?.category ||
    winner?.product ||
    winner?.project ||
    "General"
  );
}

function loadFactoryWinners() {
  const winners = getWinners();

  factoryWinner.innerHTML = "";

  if (factoryPayload) {
    const option = document.createElement("option");
    option.value = "payload";
    option.textContent = `${factoryPayload.title || "Generated Content"} — From Content`;
    factoryWinner.appendChild(option);
  }

  winners.forEach((winner) => {
    const option = document.createElement("option");
    option.value = winner.id;
    option.textContent = `${winner.title} — ${getWinnerGenre(winner)}`;
    factoryWinner.appendChild(option);
  });

  if (factoryPayload) {
    factoryWinner.value = "payload";
    currentWinner = null;
  } else {
    currentWinner = winners[0] || null;
  }
}

function getSelectedSource() {
  if (factoryPayload && factoryWinner.value === "payload") {
    return {
      title: factoryPayload.title || "Generated Content",
      page: factoryPayload.page || factoryPayload.product || "General",
      genre: factoryPayload.page || factoryPayload.product || "General",
      category: factoryPayload.page || factoryPayload.product || "General",
      topic: factoryPayload.topic || "",
      pattern: factoryPayload.pattern || "",
      emotion: factoryPayload.emotion || "",
      tension: factoryPayload.tension || "",
      lesson: factoryPayload.lesson || "",
      audience: factoryPayload.audience || [],
      platforms: factoryPayload.platforms || [],
      story: factoryPayload.story || {},
      caption: factoryPayload.caption || "",
      hashtags: factoryPayload.hashtags || "",
      strategy: factoryPayload.strategy || "",
      notes:
        factoryPayload.caption ||
        factoryPayload.pattern ||
        factoryPayload.strategy ||
        "",
      sourceType: "content"
    };
  }

  const winners = getWinners();
  const selectedId = factoryWinner.value;

  currentWinner =
    winners.find((winner) => String(winner.id) === String(selectedId)) || null;

  if (!currentWinner) return null;

  return {
    ...currentWinner,
    sourceType: "winner"
  };
}

function generateVariations(winner) {
  if (!winner) return [];

  const page = getWinnerGenre(winner);
  const title = winner.title || "Winning Idea";
  const notes = winner.notes || winner.caption || winner.pattern || "";
  const topic = winner.topic || "";
  const pattern = winner.pattern || "";
  const tension = winner.tension || "";
  const lesson = winner.lesson || "";

  const text = `
    ${title}
    ${page}
    ${topic}
    ${pattern}
    ${tension}
    ${lesson}
    ${notes}
  `.toLowerCase();

  if (
    page === "Sandman Combat Games" ||
    text.includes("sandman combat games") ||
    text.includes("arena mode") ||
    text.includes("playable") ||
    text.includes("game development") ||
    text.includes("father and son")
  ) {
    return [
      "Arena Mode Is Finally Playable",
      "From Prototype To Playable",
      "The First Time It Felt Like A Real Game",
      "Months Of Work Led To This Moment",
      "A Father And Son Built This Together",
      "The Build Is Starting To Become Real",
      "One Small Fix Changed The Whole Game",
      "This Is What Progress Looks Like",
      "The Update That Proved The Game Has Legs",
      "Why This Milestone Matters"
    ];
  }

  if (
    page === "Gym Humor" ||
    text.includes("gym humor") ||
    text.includes("funny") ||
    text.includes("comedy") ||
    text.includes("joke")
  ) {
    return [
      "The Guy Who Treats Warmups Like The Olympics",
      "Every Gym Has This One Dude",
      "When Someone Gives Advice Nobody Asked For",
      "The Loudest Guy In The Gym Is Usually The Tiredest",
      "That One Person Who Turns Every Drill Into A Competition",
      "Gym Bro Logic Makes No Sense",
      "The Fake Coach In Every Weight Room",
      "When The Warmup Is Harder Than Practice",
      "Things You Only Hear In Combat Sports Gyms",
      "The Guy Who Says One More Rep And Lies"
    ];
  }

  if (
    page === "Youth Sports Parents" ||
    text.includes("parent") ||
    text.includes("dad") ||
    text.includes("mom")
  ) {
    return [
      "Parents Who Think Their Kid Is Going D1 At Age 8",
      "The Ride Home After A Tough Loss",
      "Every Ref Is Apparently Blind",
      "The Parent Group Chat Nobody Wants",
      "When Parents Care More Than Athletes",
      "Travel Ball Parent Starter Pack",
      "The Parent Who Knows More Than The Coach",
      "Parents Who Scout 8 Year Olds",
      "The Sideline Screamer",
      "When Dad Becomes Assistant Coach"
    ];
  }

  if (
    page === "Wrestling History" ||
    text.includes("weight cut") ||
    text.includes("bad weight") ||
    text.includes("history") ||
    text.includes("old school")
  ) {
    return [
      "The Worst Weight Cut I Ever Saw",
      "How We Used To Cut Weight Before Hydration Tests",
      "The Night Before Weigh Ins Used To Be Chaos",
      "Every Old Wrestler Has A Weight Cut Story",
      "The Dumbest Weight Cutting Trick Ever",
      "Why Wrestling Finally Changed The Rules",
      "Cutting Weight In The 90s Was Different",
      "Things Coaches Allowed Back Then",
      "The Most Miserable Bus Ride After A Cut",
      "What Young Wrestlers Will Never Experience"
    ];
  }

  if (
    page === "MMA Drama" ||
    text.includes("mma drama") ||
    text.includes("fight drama") ||
    text.includes("controversy")
  ) {
    return [
      "The Fight Everyone Saw Differently",
      "When The Corner Made It Worse",
      "The Moment The Crowd Turned",
      "Why Fighters Need Better Corners",
      "The Dumbest Fight IQ Moment Ever",
      "When Ego Cost The Match",
      "The Post Fight Excuse Nobody Believed",
      "The Coach Who Lost Control",
      "The Round That Changed Everything",
      "What Casual Fans Missed"
    ];
  }

  if (
    page === "MMA Moments" ||
    text.includes("mma") ||
    text.includes("ufc") ||
    text.includes("fight")
  ) {
    return [
      "The Moment The Fight Changed",
      "The Exchange Everyone Replayed",
      "The Corner Advice That Actually Mattered",
      "The Mistake That Cost The Round",
      "The Scramble That Decided The Fight",
      "Why This Finish Was Smarter Than It Looked",
      "The Fighter Who Stayed Calm Under Fire",
      "The Sequence Casual Fans Missed",
      "How One Adjustment Changed Everything",
      "The Moment Fight IQ Took Over"
    ];
  }

  if (
    page === "Strength Motivation" ||
    text.includes("strength") ||
    text.includes("lifting") ||
    text.includes("motivation")
  ) {
    return [
      "Strength Is Built When Nobody Is Watching",
      "The Rep You Wanted To Skip Matters",
      "Strong People Do Boring Work Longer",
      "Why Motivation Is Not Enough",
      "Discipline Looks Boring Until It Works",
      "The Weight Room Exposes Excuses",
      "Small Wins Become Real Strength",
      "The Hard Set Builds The Athlete",
      "Consistency Beats Hype Every Time",
      "You Do Not Rise To The Goal, You Fall To The Habit"
    ];
  }

  if (
    page === "Combat Sports News" ||
    text.includes("news") ||
    text.includes("headline") ||
    text.includes("combat sports")
  ) {
    return [
      "The Story Behind The Headline",
      "What This Means For The Division",
      "The Matchup Nobody Is Talking About",
      "Why This News Actually Matters",
      "The Bigger Pattern Behind This Fight",
      "What Fans Are Missing",
      "The Decision That Changes The Bracket",
      "Why This Could Shift Momentum",
      "The Real Impact Of This Result",
      "What Coaches Should Notice"
    ];
  }

  if (
    page === "Wrestling Technique" ||
    text.includes("technique") ||
    text.includes("setup") ||
    text.includes("shot") ||
    text.includes("finish")
  ) {
    return [
      "The Setup Before The Shot Matters Most",
      "Why This Finish Works",
      "The Small Detail That Changes The Move",
      "Most Wrestlers Miss This Position",
      "The Difference Between Forcing And Setting Up",
      "How To Win The Hand Fight First",
      "The Mistake That Kills The Shot",
      "Why Good Technique Looks Simple",
      "The Drill That Fixes This Fast",
      "The Position Coaches Keep Repeating"
    ];
  }

  if (
    page === "Wrestling Highlights" ||
    text.includes("highlight") ||
    text.includes("pin") ||
    text.includes("wrestling")
  ) {
    return [
      "The Craziest Pin I've Ever Seen",
      "The Match Nobody Expected To Matter",
      "One Move Changed Everything",
      "The Crowd Went Silent After This",
      "The Sequence Coaches Replay",
      "The Best Scramble Of The Year",
      "How This Match Turned Around",
      "The Moment Momentum Shifted",
      "The Finish Everyone Missed",
      "Why This Highlight Matters"
    ];
  }

  if (
    page === "Underdog Stories" ||
    text.includes("underdog") ||
    text.includes("upset") ||
    text.includes("nobody expected")
  ) {
    return [
      "Nobody Thought They Could Win",
      "The Biggest Surprise Of The Season",
      "How The Underdog Pulled It Off",
      "The Match That Changed Everything",
      "Why This Story Resonates",
      "The Moment Belief Changed",
      "What People Got Wrong",
      "The Quiet Athlete Nobody Saw Coming",
      "The Upset Nobody Predicted",
      "Proof Hard Work Still Wins"
    ];
  }

  return [
    `The Hidden Lesson Behind ${title}`,
    `Why ${title} Hit A Nerve`,
    `The Part Nobody Talks About`,
    `What Coaches Notice First`,
    `The Story Under The Story`,
    `Why This Keeps Happening`,
    `The Mistake Everyone Misses`,
    `What This Says About The Sport`,
    `The Moment People React To`,
    `The Follow-Up Nobody Asked For`
  ];
}

async function sendToCarousel(title) {
  const source = getSelectedSource() || {};

  try {
    const response = await fetch("/api/carousel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        source
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Carousel generation failed.");
    }

    localStorage.setItem(
      "ghost-carousel-payload",
      JSON.stringify({
        title: data.slide1 || title,

        slide1: data.slide1 || title,
        slide2: data.slide2 || "",
        slide3: data.slide3 || "",
        slide4: data.slide4 || "",
        slide5: data.slide5 || "",

        caption: data.caption || "",
        hashtags: data.hashtags || "",

        sourceId: source.id || source.ideaId || source.sourceWinnerId || null,
        sourceType: source.sourceType || "factory",
        product: source.product || source.page || "",
        category: source.category || source.page || source.product || "",
        topic: source.topic || "",
        hook: data.slide1 || title,
        cta: source.cta || "",

        source: source.sourceType || "factory",
        originalSource: source,
        createdAt: new Date().toISOString()
      })
    );

    window.location.href = "/carousel/";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

function renderFactoryOutput() {
  factoryOutput.innerHTML = "";

  if (!factoryIdeas.length) {
    factoryOutput.innerHTML = `
      <div class="page-card faded">
        <h3>No variations yet</h3>
        <p>Select a top result or content package, then generate variations.</p>
      </div>
    `;
    return;
  }

  const visibleIdeas = showAllFactoryIdeas
    ? factoryIdeas
    : factoryIdeas.slice(0, FACTORY_VISIBLE_LIMIT);

  const hiddenCount = Math.max(factoryIdeas.length - FACTORY_VISIBLE_LIMIT, 0);

  const header = document.createElement("div");
  header.className = "section-title compact-section-title";
  header.innerHTML = `
    <div class="section-divider"></div>
    <h3>Showing ${visibleIdeas.length} of ${factoryIdeas.length}</h3>
    <p>Use a variation for carousel, planner, or save all to Ideas.</p>
  `;
  factoryOutput.appendChild(header);

  visibleIdeas.forEach((title) => {
    const row = document.createElement("div");
    row.className = "variation-row";

    row.innerHTML = `
      <button class="build-carousel-btn" title="Build Carousel">🎠</button>
      <div class="variation-title">${title}</div>
    `;

    row.querySelector(".build-carousel-btn").addEventListener("click", () => {
      sendToCarousel(title);
    });

    factoryOutput.appendChild(row);
  });

  if (hiddenCount > 0) {
    const toggle = document.createElement("button");
    toggle.className = "btn ghost-toggle-btn";
    toggle.textContent = showAllFactoryIdeas
      ? "▲ Hide Variations"
      : `▼ Show ${hiddenCount} More`;

    toggle.addEventListener("click", () => {
      showAllFactoryIdeas = !showAllFactoryIdeas;
      renderFactoryOutput();
    });

    factoryOutput.appendChild(toggle);
  }
}

factoryWinner?.addEventListener("change", () => {
  factoryIdeas = [];
  renderFactoryOutput();
  getSelectedSource();
});

generateFactoryBtn.addEventListener("click", async () => {

  const source = getSelectedSource();

  if (!source) {
    alert("Select a source first.");
    return;
  }

  generateFactoryBtn.disabled = true;
  generateFactoryBtn.textContent = "Generating...";

  try {

    const response = await fetch("/api/factory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Factory generation failed.");
    }

    if (Array.isArray(data.variations) && data.variations.length) {

      factoryIdeas = data.variations;

    } else {

throw new Error("AI returned no variations.");
    }

    renderFactoryOutput();

  } catch (err) {

    console.error(err);

alert(err.message);

  } finally {

    generateFactoryBtn.disabled = false;
    generateFactoryBtn.textContent = "Generate Variations";

  }

});

saveFactoryBtn.addEventListener("click", () => {
  if (!factoryIdeas.length) return;

  const source = getSelectedSource();

  const ideas = gmGetIdeas();

  const existingTitles = new Set(
    ideas.map((idea) =>
      String(idea.title || "")
        .trim()
        .toLowerCase()
    )
  );

  let saved = 0;
  let skipped = 0;

  factoryIdeas.forEach((title) => {
    const cleanTitle = String(title || "").trim();
    const key = cleanTitle.toLowerCase();

    if (!cleanTitle) return;

    if (existingTitles.has(key)) {
      skipped++;
      return;
    }

    ideas.unshift({
      id: Date.now() + Math.random(),
      title: cleanTitle,
      page: getWinnerGenre(source),
      genre: getWinnerGenre(source),
      notes:
        source?.sourceType === "content"
          ? "Generated by Factory from content."
          : "Generated by Factory from winning pattern.",
      status: "NEW",
      source: "factory",
      sourceWinnerId: source?.id || null,
      sourceWinnerTitle: source?.title || "",
      sourceContentId:
        source?.sourceType === "content"
          ? factoryPayload?.ideaId || null
          : null,
      createdAt: new Date().toISOString()
    });

    existingTitles.add(key);
    saved++;
  });

  gmSaveIdeas(ideas);

  factoryIdeas = [];
  renderFactoryOutput();

  alert(`Variations saved as ideas: ${saved}. Duplicates skipped: ${skipped}.`);

  window.location.assign("/dashboard/ideas.html?from=factory");
});

generateCarouselBtn?.addEventListener("click", () => {
  const source = getSelectedSource();

  if (!source) {
    alert("Select a source first.");
    return;
  }

  sendToCarousel(source.title || "Winning Idea");
});

generateImageBtn?.addEventListener("click", () => {
  const source = getSelectedSource();

  if (!source) {
    alert("Select a source first.");
    return;
  }

  localStorage.setItem("ghost-image-payload", JSON.stringify({
    sourceId: source.id || source.ideaId || source.sourceWinnerId || null,
    sourceType: source.sourceType || "create-variations",
    sourceTitle: source.title || "",
    title: source.title || "Create a visual",
    product: source.product || source.page || "",
    category: source.category || source.page || source.product || "",
    topic: source.topic || "",
    hook: source.hook || source.title || "",
    prompt: source.caption || source.angle || source.pattern || source.notes || "",
    caption: source.caption || "",
    cta: source.cta || ""
  }));

  window.location.assign("/dashboard/image-generator.html?from=variations");
});

loadFactoryWinners();
renderFactoryOutput();
