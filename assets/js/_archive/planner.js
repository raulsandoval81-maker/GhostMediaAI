const plannerOutput =
  document.getElementById("plannerOutput");

const autoPlanBtn =
  document.getElementById("autoPlanBtn");

const GM_PLANNER_KEY =
  "ghost-planner";

autoPlanBtn?.addEventListener(
  "click",
  buildWeek
);

buildWeek();

function buildWeek() {

  const planner =
    JSON.parse(
      localStorage.getItem(
        GM_PLANNER_KEY
      ) || "[]"
    );

  plannerOutput.innerHTML = "";

  // REAL PLANNER MODE

  if (planner.length) {

    const slots = [
      "Mon 6:00 AM",
      "Mon 6:00 PM",
      "Tue 6:00 AM",
      "Tue 6:00 PM",
      "Wed 6:00 AM",
      "Wed 6:00 PM",
      "Thu 6:00 AM",
      "Thu 6:00 PM",
      "Fri 6:00 AM",
      "Fri 6:00 PM"
    ];

    planner.forEach((item, index) => {

      plannerOutput.innerHTML += `
        <div class="card">

          <h2>
            ${slots[index] || "Extra"}
          </h2>

<div class="page">

  <strong>
    ${item.title || "Untitled"}
  </strong>

  <span>
    (${item.niche || "General"})
  </span>

</div>


        </div>
      `;

    });

    return;
  }

  // FALLBACK TEST PLAN

  const weekPlan = [
    {
      day: "Monday",
      am: "Wrestling History",
      pm: "Youth Sports Parents"
    },
    {
      day: "Tuesday",
      am: "MMA Drama",
      pm: "Coaching"
    },
    {
      day: "Wednesday",
      am: "Technique",
      pm: "Underdog"
    },
    {
      day: "Thursday",
      am: "Humor",
      pm: "Combat Culture"
    },
    {
      day: "Friday",
      am: "Boxing",
      pm: "Wrestling History"
    }
  ];

  weekPlan.forEach((slot) => {

    plannerOutput.innerHTML += `
      <div class="card">

        <h2>${slot.day}</h2>

        <div class="page">
          <strong>6:00 AM</strong>
          <span>${slot.am}</span>
        </div>

        <div class="page">
          <strong>6:00 PM</strong>
          <span>${slot.pm}</span>
        </div>

      </div>
    `;
  });
}