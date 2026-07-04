// Ghost Media Gate v1

const ghostGlitch = document.getElementById("ghostGlitch");
const ghostLockup = document.getElementById("ghostLockup");
const statusBox = document.getElementById("statusBox");
const enterBtn = document.getElementById("enterHQ");

const ideas =
  JSON.parse(localStorage.getItem("ghostmedia-ideas") || "[]");

const winners =
  ideas.filter(i => (i.status || "").toUpperCase() === "WINNER");

const queued =
  ideas.filter(i => (i.status || "").toUpperCase() === "QUEUED");

const scheduled =
  JSON.parse(localStorage.getItem("ghost-schedule") || "[]");

statusBox.innerHTML = `
  <p id="bootTitle">Searching...</p>
  <span id="bootMessage">Signal locating...</span>
  <span id="missionTask">Preparing mission...</span>
`;

function getMissionTask() {
  if (scheduled.length) return "Current Mission: Publish scheduled content.";
  if (winners.length) return "Current Mission: Analyze winners for patterns.";
  if (ideas.length) return "Current Mission: Move ideas into production.";
  return "Current Mission: Begin a new mission.";
}

setTimeout(() => {
  document.getElementById("bootTitle").textContent =
    "NO FACE. NO NAME.";

  document.getElementById("bootMessage").textContent =
    "JUST CONTENT THAT HITS.";

  document.getElementById("missionTask").textContent =
    getMissionTask();
}, 3200);

  // Boot sequence

setTimeout(() => {

  ghostGlitch.style.opacity = "0";

  ghostLockup.style.opacity = "1";

}, 2200);

setTimeout(() => {

  statusBox.style.opacity = "1";

}, 3000);

// Enter Headquarters

enterBtn.addEventListener("click", () => {

  document.body.style.transition =
    "opacity .6s ease";

  document.body.style.opacity = "0";

  setTimeout(() => {

    window.location.href =
      "/dashboard/index.html";

  }, 600);

});

// Random Ghost Glitch

setInterval(() => {

  if (ghostLockup.style.opacity !== "1") return;

  ghostLockup.style.transform =
    "translate(-49.5%, -50%)";

  ghostLockup.style.filter =
    "drop-shadow(0 0 40px white)";

  setTimeout(() => {

    ghostLockup.style.transform =
      "translate(-50%, -50%)";

    ghostLockup.style.filter =
      "drop-shadow(0 0 22px rgba(255,255,255,.3))";

  },120);

},9000 + Math.random()*5000);