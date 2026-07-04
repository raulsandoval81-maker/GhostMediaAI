const discoverPage =
  document.getElementById("factoryPage");

const generateBtn =
  document.getElementById("generateBtn");

const saveAllBtn =
  document.getElementById("saveAllBtn");

const discoverList =
  document.getElementById("factoryList");

let generatedIdeas = [];

const IDEA_BANK = {
  "Wrestling Highlights": [
    "Fastest Pin In NCAA History?",
    "Last Second Takedown For The Win",
    "Craziest Scramble Ever Caught On Camera",
    "Freshman Beats Returning State Champ",
    "Biggest Throw In A Finals Match",
    "Match Won With One Second Left",
    "The Takedown Nobody Saw Coming",
    "Wildest Overtime Finish Ever",
    "Five Point Move Changed Everything",
    "State Finals Crowd Went Silent",
    "Heavyweight Moved Like A Lightweight",
    "Perfect Counter At The Perfect Time",
    "The Escape That Saved The Match",
    "Championship Match Turned In Seconds",
    "Most Dominant Performance Of The Season"
  ],

  "Wrestling History": [
    "The Wrestler Nobody Talks About Anymore",
    "Old School Wrestling Rules Were Brutal",
    "The Match That Changed College Wrestling",
    "Forgotten Olympic Wrestling Legend",
    "The Rivalry That Built A Dynasty",
    "The Rule Change That Saved Wrestling",
    "The Coach Who Changed A Whole Program",
    "When Wrestling Looked Completely Different",
    "The Tournament Everyone Still Talks About",
    "The Move That Used To Be Legal",
    "The Old School Weight Cut Era",
    "The Dynasty Nobody Could Stop",
    "The Wrestler Who Was Ahead Of His Time",
    "The Match That Created A Legend",
    "What Modern Wrestlers Never Experienced"
  ],

  "MMA Moments": [
    "Knockout That Silenced The Arena",
    "Submission Nobody Saw Coming",
    "Wildest 10 Seconds In MMA",
    "The Comeback After Getting Dropped",
    "Flying Knee That Ended Everything",
    "The Round That Changed The Fight",
    "The Corner Advice That Actually Worked",
    "The Scramble That Decided The Match",
    "The Fighter Who Stayed Calm Under Fire",
    "The Finish That Looked Impossible",
    "The Mistake That Cost The Fight",
    "The Adjustment Casual Fans Missed",
    "One Exchange Changed Everything",
    "The Fighter Who Refused To Break",
    "The Moment Fight IQ Took Over"
  ],

  "MMA Drama": [
    "The Press Conference That Started A War",
    "The Rivalry That Got Too Personal",
    "Fighter Walkout That Changed The Energy",
    "The Callout Nobody Expected",
    "The Beef That Sold The Fight",
    "The Corner Argument Everyone Heard",
    "The Post Fight Excuse Nobody Believed",
    "The Decision That Split The Fanbase",
    "The Trash Talk That Backfired",
    "The Rematch Story Everyone Wanted",
    "The Coach Who Made It Worse",
    "The Weight Miss That Changed The Card",
    "The Moment Respect Turned Into Drama",
    "The Fight Week Clip That Went Viral",
    "The Handshake That Never Happened"
  ],

  "Gym Humor": [
    "January Gym Members In February",
    "When Someone Steals Your Bench",
    "Leg Day Excuses Hall Of Fame",
    "The Guy Who Screams On Warmups",
    "Protein Shaker Left In The Car",
    "Every Gym Has This One Dude",
    "When The Warmup Is Harder Than The Workout",
    "The Fake Coach In Every Weight Room",
    "The Person Who Gives Advice Nobody Asked For",
    "When Someone Says One More Rep And Lies",
    "The Loudest Guy Is Always The Most Tired",
    "Gym Bro Logic Makes No Sense",
    "When The Mirror Set Takes Ten Minutes",
    "That One Person Who Turns Every Drill Into A Competition",
    "Things You Only Hear In Combat Sports Gyms"
  ],

  "Strength Motivation": [
    "Nobody Cares About Your Motivation",
    "Discipline Shows Up When Motivation Leaves",
    "Train When Nobody Is Clapping",
    "The Weight Does Not Care About Excuses",
    "Earn The Body Before You Show It",
    "Strong People Do Boring Work Longer",
    "The Rep You Wanted To Skip Matters",
    "Consistency Beats Hype Every Time",
    "The Hard Set Builds The Athlete",
    "You Do Not Rise To The Goal, You Fall To The Habit",
    "Strength Is Built When Nobody Is Watching",
    "Small Wins Become Real Strength",
    "The Weight Room Exposes Excuses",
    "Boring Reps Build Dangerous People",
    "The Days You Do Not Feel Like Training Count Most"
  ],

  "Youth Sports Parents": [
    "Parents Who Coach From The Stands",
    "The Ride Home After A Bad Game",
    "When Your Kid Says They Want To Quit",
    "The Parent Who Thinks Every Ref Is Wrong",
    "What Coaches Wish Parents Understood",
    "The Parent Group Chat Nobody Wants",
    "When Parents Care More Than Athletes",
    "The Dad Who Turns Every Game Into A Tryout",
    "The Mom Who Knows The Team Better Than The Coach",
    "The Sideline Screamer Everyone Recognizes",
    "When Your Kid Needs Support, Not A Lecture",
    "The Parent Who Scouts Eight Year Olds",
    "The Toughest Part Of Youth Sports Is The Adults",
    "What The Quiet Kid Needs After A Loss",
    "The Best Parents Know When To Be Silent"
  ],

  "Combat Sports News": [
    "Fight Announcement Everyone Missed",
    "Prospect To Watch This Weekend",
    "Ranking Shakeup After Big Upset",
    "Injury Changes The Whole Card",
    "Underdog Enters As Huge Favorite Killer",
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
  ],

  "Wrestling Technique": [
    "One Setup Every Beginner Needs",
    "Why Your Double Leg Keeps Failing",
    "Fix This Before Shooting Again",
    "Simple Sprawl Drill That Works",
    "How To Finish When They Sprawl",
    "The Setup Before The Shot Matters Most",
    "Most Wrestlers Miss This Position",
    "The Difference Between Forcing And Setting Up",
    "How To Win The Hand Fight First",
    "The Mistake That Kills The Shot",
    "Why Good Technique Looks Simple",
    "The Drill That Fixes This Fast",
    "The Position Coaches Keep Repeating",
    "Small Details That Win Big Matches",
    "Why Your Finish Fails At The Edge"
  ],

  "Underdog Stories": [
    "Cut From The Team To Champion",
    "Lost All Season Then Won When It Mattered",
    "Smallest Athlete In The Bracket",
    "Nobody Picked Him To Win",
    "The Comeback After Everyone Quit Watching",
    "From Benchwarmer To Team Captain",
    "The Athlete Who Refused To Quit",
    "Last Seed Won The Whole Tournament",
    "Overlooked All Year, Remembered Forever",
    "The Walk-On Who Shocked Everyone",
    "One Win Changed Everything",
    "The Match That Saved A Season",
    "The Long Road Back From Injury",
    "Nobody Believed Until The Finals",
    "The Champion Nobody Saw Coming"
  ]
};

function renderGeneratedIdeas() {
  discoverList.innerHTML = "";

  generatedIdeas.forEach((title) => {
    const row =
      document.createElement("div");

    row.className = "page";

    row.innerHTML = `
      <strong>${title}</strong>
      <span>READY</span>
    `;

    discoverList.appendChild(row);
  });
}

generateBtn.addEventListener("click", () => {
  const page =
    discoverPage.value;

  generatedIdeas =
    IDEA_BANK[page] || [];

  renderGeneratedIdeas();
});

saveAllBtn.addEventListener("click", () => {
  if (!generatedIdeas.length) return;

  const ideas =
    gmGetIdeas();

  const page =
    discoverPage.value;

  generatedIdeas.forEach((title) => {
    ideas.unshift({
      id: Date.now() + Math.random(),
      title,
      page,
      notes: "Generated by Discover.",
      status: "NEW",
      source: "discover",
      createdAt: new Date().toISOString()
    });
  });

  gmSaveIdeas(ideas);

  generatedIdeas = [];
  renderGeneratedIdeas();

  alert("Ideas saved.");

  window.location.href =
    "/dashboard/ideas.html";
});