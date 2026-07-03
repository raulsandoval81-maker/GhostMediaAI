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

function renderAnalysis(report) {
  analysisCard.style.display = "block";

  analysisOutput.innerHTML = `
    <p><strong>Topic:</strong> ${report.topic || "Unknown"}</p>
    <p><strong>Pattern:</strong> ${report.pattern || "Unknown"}</p>
    <p><strong>Emotion:</strong> ${report.emotion || "Unknown"}</p>
    <p><strong>Tension:</strong> ${report.tension || "Unknown"}</p>
    <p><strong>Lesson:</strong> ${report.lesson || "Unknown"}</p>
    <p><strong>Score:</strong> ${report.score || 0}/10</p>

    <h3>Audience</h3>
    <ul>
      ${(report.audience || [])
        .map(item => `<li>${item}</li>`)
        .join("")}
    </ul>

    <h3>Ideas</h3>
    <ul>
      ${(report.ideas || [])
        .map(item => `<li>${item}</li>`)
        .join("")}
    </ul>

    <h3>Recommended Platforms</h3>
    <ul>
      ${(report.platforms || [])
        .map(item => `<li>${item}</li>`)
        .join("")}
    </ul>

    <p><strong>Recommended Next Step:</strong> ${report.nextStep || "Scout"}</p>
  `;
}

saveScoutBtn.onclick = () => {
  if (!currentAnalysis) {
    alert("Analyze content first.");
    return;
  }

  const entries = JSON.parse(
    localStorage.getItem("ghostScoutEntries") || "[]"
  );

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

  localStorage.setItem(
    "ghostScoutEntries",
    JSON.stringify(entries)
  );

  alert("Saved to Scout.");
};

ideasBtn.onclick = () => {
  if (!currentAnalysis) {
    alert("Analyze content first.");
    return;
  }

  const ideas = gmGetIdeas();

  (currentAnalysis.ideas || []).forEach((title) => {
    ideas.unshift({
      id: Date.now() + Math.random(),
      title,
      page: currentAnalysis.topic || "AI Inbox",
      notes: `
Pattern: ${currentAnalysis.pattern || ""}
Emotion: ${currentAnalysis.emotion || ""}
Tension: ${currentAnalysis.tension || ""}
Lesson: ${currentAnalysis.lesson || ""}

Source:
${currentContent}
      `.trim(),
      status: "NEW",
      source: "ai-inbox",
      createdAt: new Date().toISOString()
    });
  });

  gmSaveIdeas(ideas);

  alert("Ideas sent to Ideas.");
  window.location.href = "/dashboard/ideas.html";
};