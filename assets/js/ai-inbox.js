const input = document.getElementById("aiInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const saveScoutBtn = document.getElementById("saveScoutBtn");
const ideasBtn = document.getElementById("ideasBtn");

const analysisCard = document.getElementById("analysisCard");
const analysisOutput = document.getElementById("analysisOutput");

let currentAnalysis = null;
let currentContent = "";

analyzeBtn.onclick = async () => {
  currentContent = input.value.trim();

  if (!currentContent) {
    alert("Paste something first.");
    return;
  }

  analyzeBtn.textContent = "Analyzing...";
  analyzeBtn.disabled = true;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: currentContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "AI analysis failed.");
    }

    currentAnalysis = data;

    renderAnalysis(currentAnalysis);

  } catch (error) {
    alert(error.message);

  } finally {
    analyzeBtn.textContent = "🤖 Analyze";
    analyzeBtn.disabled = false;
  }
};

function list(items) {
  if (!items || !items.length) {
    return "<li>None</li>";
  }

  return items.map(item => `<li>${item}</li>`).join("");
}

function renderAnalysis(report) {

  analysisCard.style.display = "block";

  analysisOutput.innerHTML = `

    <h2>🧠 Intelligence Brief</h2>

    <p><strong>${report.briefTitle || "GhostMedia Intelligence Report"}</strong></p>

    <hr>

    <h3>Source</h3>

    <p><strong>Type:</strong> ${report.sourceType || "Unknown"}</p>

    <p><strong>Name:</strong> ${report.sourceName || report.topic || "Unknown"}</p>

    <p><strong>URL:</strong> ${report.sourceUrl || "N/A"}</p>

    <p><strong>Content Type:</strong> ${report.contentType || "Unknown"}</p>

    <p><strong>Confidence:</strong> ${report.confidence || 0}%</p>

    <hr>

    <h3>Executive Summary</h3>

    <p>${report.executiveSummary || "No summary available."}</p>

    <hr>

    <h3>Key Intelligence</h3>

    <p><strong>Primary Topic:</strong> ${report.topic || "Unknown"}</p>

    <p><strong>Pattern:</strong> ${report.pattern || "Unknown"}</p>

    <p><strong>Emotion:</strong> ${report.emotion || "Unknown"}</p>

    <p><strong>Tension:</strong> ${report.tension || "Unknown"}</p>

    <p><strong>Core Lesson:</strong> ${report.lesson || "Unknown"}</p>

    <hr>

    <h3>Audience</h3>

    <ul>
      ${list(report.audience)}
    </ul>

    <hr>

    <h3>Opportunities Detected</h3>

    <ul>
      ${list(report.opportunities)}
    </ul>

    <hr>

    <h3>Recommended Content</h3>

    <ul>
      ${list(report.ideas)}
    </ul>

    <hr>

    <h3>Recommended Platforms</h3>

    <ul>
      ${list(report.platforms)}
    </ul>

    <hr>

    <h3>Intelligence Score</h3>

    <p><strong>${report.score || 0}/10</strong></p>

    <hr>

    <h3>Routing Recommendation</h3>

    <p><strong>Primary Destination:</strong>
      ${report.primaryDestination || report.nextStep || "Scout"}
    </p>

    <p><strong>Secondary Destination:</strong>
      ${report.secondaryDestination || "Ideas"}
    </p>

    <p><strong>Archive Value:</strong>
      ${report.archiveValue || "Medium"}
    </p>

  `;
}

saveScoutBtn.onclick = () => {

  if (!currentAnalysis) {
    alert("Analyze content first.");
    return;
  }

  const entries = gmGetScoutEntries();

  entries.unshift({

    source: "AI Inbox",

    topic: currentAnalysis.topic || "General",

    pattern: currentAnalysis.pattern || "Attention Signal",

    emotion: currentAnalysis.emotion || "",

    tension: currentAnalysis.tension || "",

    lesson: currentAnalysis.lesson || "",

    score: currentAnalysis.score || 0,

    notes: currentContent,

    ideas: currentAnalysis.ideas || [],

    platforms: currentAnalysis.platforms || [],

    createdAt: Date.now()

  });

  gmSaveScoutEntries(entries);

  alert("Saved to Research Notes.");
};

ideasBtn.onclick = () => {

  if (!currentAnalysis) {
    alert("Analyze content first.");
    return;
  }

  const ideas = gmGetIdeas();

  const mainIdea = {

    id: crypto.randomUUID(),

    title:
      currentAnalysis.briefTitle ||
      currentAnalysis.title ||
      currentAnalysis.pattern ||
      currentAnalysis.topic ||
      "AI Inbox Idea",

    page:
      currentAnalysis.project ||
      currentAnalysis.product ||
      "GhostMedia",

    topic: currentAnalysis.topic || "",

    pattern: currentAnalysis.pattern || "",

    emotion: currentAnalysis.emotion || "",

    tension: currentAnalysis.tension || "",

    lesson: currentAnalysis.lesson || "",

    audience: currentAnalysis.audience || [],

    score: currentAnalysis.score || 0,

    platforms: currentAnalysis.platforms || [],

    suggestedIdeas: currentAnalysis.ideas || [],

    notes: currentContent,

    originalContent: currentContent,

    source: "ai-inbox",

    status: "NEW",

    createdAt: new Date().toISOString()

  };

  ideas.unshift(mainIdea);

  gmSaveIdeas(ideas);

  alert("Content ideas created.");

  window.location.assign("/dashboard/ideas.html?from=ai-inbox");
};
