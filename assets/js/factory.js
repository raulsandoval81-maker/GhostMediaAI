const factoryWinner = document.getElementById("factoryWinner");
const generateFactoryBtn = document.getElementById("generateFactoryBtn");
const saveFactoryBtn = document.getElementById("saveFactoryBtn");
const factoryOutput = document.getElementById("factoryOutput");

const generateCarouselBtn = document.getElementById("generateCarouselBtn");

let factoryIdeas = [];
let currentWinner = null;

let factoryPayload =
  JSON.parse(
    localStorage.getItem("ghost-factory-payload") || "null"
  );

  if (factoryPayload && factoryWinner) {

  factoryWinner.innerHTML = `
    <option value="payload">
      ${factoryPayload.title} — From Content
    </option>
  `;

}

function getWinners() {
  return gmGetIdeas().filter(
    idea => String(idea.status || "").toUpperCase() === "WINNER"
  );
}

function getWinnerGenre(winner) {
  return winner?.page || winner?.genre || winner?.category || "General";
}


function loadFactoryWinners() {
  const winners = getWinners();

  factoryWinner.innerHTML = winners
    .map(winner => {
      const genre = getWinnerGenre(winner);

      return `
        <option value="${winner.id}">
          ${winner.title} — ${genre}
        </option>
      `;
    })
    .join("");

  currentWinner = winners[0] || null;
}

function generateVariations(winner) {
  if (!winner) return [];

  const page = getWinnerGenre(winner);
  const title = winner.title || "Winning Idea";
  const notes = winner.notes || "";

  const text = `${title} ${page} ${notes}`.toLowerCase();

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

function sendToCarousel(title) {

  const source =
    factoryPayload || currentWinner || {};

  const story =
    source.story || {};

  const fallbackCaption =
    String(source.caption || source.notes || "");

  const captionLines =
    fallbackCaption
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

  const slide1 =
    story.tension ||
    source.tension ||
    title ||
    source.title ||
    "Start with tension.";

  const slide2 =
    story.escalation ||
    captionLines[1] ||
    "The pressure kept building.";

  const slide3 =
    story.turningPoint ||
    captionLines[2] ||
    "Then everything changed.";

  const slide4 =
    story.resolution ||
    source.title ||
    title ||
    "The moment became the story.";

  const slide5 =
    story.lesson ||
    source.lesson ||
    source.cta ||
    "What do you think?";

  localStorage.setItem(
    "ghost-carousel-payload",
    JSON.stringify({
      slide1,
      slide2,
      slide3,
      slide4,
      slide5,

      caption:
        source.caption || "",

      hashtags:
        source.hashtags || "",

      strategy:
        source.strategy || "",

      story,

      source:
        factoryPayload ? "content" : "winner",

      createdAt:
        new Date().toISOString()
    })
  );

  window.location.href = "/carousel/";
}

function addToPlanner(title) {
  const planner = JSON.parse(
    localStorage.getItem("ghost-planner") || "[]"
  );

  planner.push({
    id: Date.now() + Math.random(),
    title,
    niche: getWinnerGenre(currentWinner),
    sourceWinnerId: currentWinner?.id || null,
    sourceWinnerTitle: currentWinner?.title || "",
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(
    "ghost-planner",
    JSON.stringify(planner)
  );

  alert(`"${title}" added to Planner`);
}

function renderFactoryOutput() {
  factoryOutput.innerHTML = "";

  factoryIdeas.forEach(title => {
    const row = document.createElement("div");
    row.className = "variation-row";

    row.innerHTML = `
      <button class="build-carousel-btn" title="Build Carousel">
        🎠
      </button>

      <div class="variation-title">
        ${title}
      </div>

      <button class="add-planner-btn" title="Add To Planner">
        📅
      </button>
    `;

    row
      .querySelector(".build-carousel-btn")
      .addEventListener("click", () => {
        sendToCarousel(title);
      });

    row
      .querySelector(".add-planner-btn")
      .addEventListener("click", () => {
        addToPlanner(title);
      });

    factoryOutput.appendChild(row);
  });
}

factoryWinner?.addEventListener("change", () => {
  const winners = getWinners();
  const selectedId = factoryWinner.value;

  currentWinner = winners.find(
    winner => String(winner.id) === String(selectedId)
  ) || null;
});

generateFactoryBtn.addEventListener("click", () => {

  if (factoryPayload) {
    factoryIdeas =
      generateVariations({
        title: factoryPayload.title,
        page: factoryPayload.page,
        genre: factoryPayload.page,
        category: factoryPayload.page,
        notes: factoryPayload.caption || factoryPayload.strategy || ""
      });

    renderFactoryOutput();
    return;
  }

  const winners = getWinners();
  const selectedId = factoryWinner.value;

  currentWinner = winners.find(
    winner => String(winner.id) === String(selectedId)
  ) || null;

  factoryIdeas = generateVariations(currentWinner);
  renderFactoryOutput();

});

saveFactoryBtn.addEventListener("click", () => {
  if (!factoryIdeas.length) return;

  const ideas = gmGetIdeas();

  const existingTitles = new Set(
    ideas.map(idea =>
      String(idea.title || "")
        .trim()
        .toLowerCase()
    )
  );

  let saved = 0;
  let skipped = 0;

  factoryIdeas.forEach(title => {
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

page:
  factoryPayload?.page ||
  getWinnerGenre(currentWinner),

genre:
  factoryPayload?.page ||
  getWinnerGenre(currentWinner),


notes:
  factoryPayload
    ? "Generated by Factory from content."
    : "Generated by Factory from winning pattern.",

  status: "NEW",
      source: "factory",


sourceWinnerId:
  currentWinner?.id || null,

sourceWinnerTitle:
  currentWinner?.title || "",

sourceContentId:
  factoryPayload?.ideaId || null,

      createdAt: new Date().toISOString()
    });

    existingTitles.add(key);
    saved++;
  });

  gmSaveIdeas(ideas);

  factoryIdeas = [];
  renderFactoryOutput();

  alert(`Factory ideas saved: ${saved}. Duplicates skipped: ${skipped}.`);

  window.location.href = "/dashboard/ideas.html";
});

generateCarouselBtn?.addEventListener("click", () => {

  if (factoryPayload) {
    sendToCarousel(
      factoryPayload.title || "Generated Content"
    );
    return;
  }

  const winners = getWinners();
  const selectedId = factoryWinner.value;

  currentWinner = winners.find(
    winner => String(winner.id) === String(selectedId)
  ) || null;

  if (!currentWinner) {
    alert("Select a winner first.");
    return;
  }

  sendToCarousel(
    currentWinner.title || "Winning Idea"
  );

});

if (!factoryPayload) {
  loadFactoryWinners();
}