const input =
  document.getElementById("aiInput");

const analyzeBtn =
  document.getElementById("analyzeBtn");

const analysisCard =
  document.getElementById("analysisCard");

const analysisOutput =
  document.getElementById("analysisOutput");

analyzeBtn.onclick = () => {

  const text =
    input.value.trim();

  if (!text) {
    alert("Paste something first.");
    return;
  }

  const report =
    buildAIReport(text);

  analysisCard.style.display = "block";

  analysisOutput.innerHTML = `
    <p><strong>Pattern:</strong> ${report.pattern}</p>
    <p><strong>Emotion:</strong> ${report.emotion}</p>
    <p><strong>Tension:</strong> ${report.tension}</p>
    <p><strong>Lesson:</strong> ${report.lesson}</p>

    <h3>Ideas</h3>

    <ul>
      ${report.ideas.map(i=>`<li>${i}</li>`).join("")}
    </ul>
  `;
};

function buildAIReport(text){

  return{

    pattern:"Unknown",

    emotion:"Curiosity",

    tension:"Find the hidden story.",

    lesson:"Everything has a lesson.",

    ideas:[
      "Turn into Carousel",
      "Create Story",
      "Expand with AI"
    ]

  };

}