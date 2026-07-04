const opportunityList =
  document.getElementById("opportunityList");

function getPatterns() {
  return JSON.parse(
    localStorage.getItem("ghostmedia-patterns") || "[]"
  );
}

function average(list, field) {
  if (!list.length) return 0;

  return Math.round(
    list.reduce(
      (sum, item) => sum + Number(item[field] || 0),
      0
    ) / list.length
  );
}

function mostCommon(list, field) {

  const counts = {};

  list.forEach((item) => {

    const value =
      item[field] || "Unknown";

    counts[value] =
      (counts[value] || 0) + 1;

  });

  return Object.entries(counts)
    .sort((a,b)=>b[1]-a[1])[0]?.[0] || "Unknown";

}

function renderOpportunities() {

  const patterns =
    getPatterns();

  const grouped = {};

  patterns.forEach((item)=>{

    const topic =
      item.topic || "General";

    if(!grouped[topic])
      grouped[topic]=[];

    grouped[topic].push(item);

  });

  opportunityList.innerHTML="";

  const opportunities =
    Object.keys(grouped)
      .map((topic)=>{

        const items =
          grouped[topic];

        return{

          topic,

          winners:
            items.length,

          avgViews:
            average(items,"views"),

          avgLikes:
            average(items,"likes"),

          avgComments:
            average(items,"comments"),

          avgShares:
            average(items,"shares"),

          bestHook:
            mostCommon(items,"hook"),

          bestEmotion:
            mostCommon(items,"emotion"),

          bestFormat:
            mostCommon(items,"format"),

          bestPlatform:
            mostCommon(items,"platform"),

          score:
            Math.min(
              items.length*20 +
              average(items,"shares")/5 +
              average(items,"likes")/10,
              100
            )

        };

      })
      .sort((a,b)=>b.score-a.score);

  if(!opportunities.length){

    opportunityList.innerHTML=`
      <div class="page-card faded">
        <h3>No opportunities yet.</h3>
        <p>Promote some winners first.</p>
      </div>
    `;

    return;

  }

  opportunities.forEach((opportunity)=>{

    const row =
      document.createElement("div");

    row.className="page-card";

    row.innerHTML=`

      <h3>${opportunity.topic}</h3>

      <p>
        Opportunity Score:
        <strong>${Math.round(opportunity.score)}</strong>
      </p>

      <p>
        Winners:
        ${opportunity.winners}
      </p>

      <p>
        Avg Views:
        ${opportunity.avgViews}
      </p>

      <p>
        Avg Likes:
        ${opportunity.avgLikes}
      </p>

      <p>
        Avg Shares:
        ${opportunity.avgShares}
      </p>

      <p>
        <strong>Best Hook:</strong>
        ${opportunity.bestHook}
      </p>

      <p>
        <strong>Best Emotion:</strong>
        ${opportunity.bestEmotion}
      </p>

      <p>
        <strong>Best Format:</strong>
        ${opportunity.bestFormat}
      </p>

      <p>
        <strong>Platform:</strong>
        ${opportunity.bestPlatform}
      </p>

      <button
        class="btn generate-opportunity-btn">
        🚀 Build Winning Brief
      </button>

    `;

    row
      .querySelector(".generate-opportunity-btn")
      .addEventListener("click",()=>{

        localStorage.setItem(
          "ghost-opportunity",
          JSON.stringify(opportunity)
        );

        window.location.href =
          "/dashboard/briefs.html";

      });

    opportunityList.appendChild(row);

  });

}

renderOpportunities();