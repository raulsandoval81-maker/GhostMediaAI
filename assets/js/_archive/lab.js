const winnerSelect = document.getElementById("winnerSelect");
const cloneBtn = document.getElementById("cloneBtn");
const labList = document.getElementById("labList");

let clonedIdeas = [];

function loadWinners() {
  const ideas = gmGetIdeas();
  const winners = ideas.filter((idea) => idea.status === "WINNER");

  winnerSelect.innerHTML = "";

  winners.forEach((idea) => {
    const option = document.createElement("option");
    option.value = idea.id;
    option.textContent = `${idea.title} — ${idea.page}`;
    winnerSelect.appendChild(option);
  });
}

function buildClones(title, page) {
  if (page === "Youth Sports Parents") {
    return [
      "Parents Who Think Their Kid Is Going D1 At Age 8",
      "The Ride Home After A Tough Loss",
      "Every Ref Is Apparently Blind",
      "The Parent Group Chat Nobody Wants",
      "When Parents Care More Than Athletes"
    ];
  }

  return [
    `${title} Part 2`,
    `Another Version Of ${title}`,
    `Why ${title} Worked`,
    `The Sequel To ${title}`,
    `More Like ${title}`
  ];
}

function renderClones() {
  labList.innerHTML = "";

  clonedIdeas.forEach((title) => {
    const row = document.createElement("div");
    row.className = "page";
    row.innerHTML = `
      <strong>${title}</strong>
      <span>CLONE</span>
    `;
    labList.appendChild(row);
  });
}

cloneBtn.addEventListener("click", () => {
  const ideas = gmGetIdeas();
  const winner = ideas.find((idea) => String(idea.id) === String(winnerSelect.value));

  if (!winner) return;

  clonedIdeas = buildClones(winner.title, winner.page);
  renderClones();
});

loadWinners();