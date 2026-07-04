const payload = JSON.parse(
  localStorage.getItem("ghost-image-payload") || "{}"
);

const titleInput = document.getElementById("title");
const promptInput = document.getElementById("prompt");
const styleInput = document.getElementById("style");
const ratioInput = document.getElementById("ratio");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");

titleInput.value = payload.title || "";
promptInput.value =
  payload.prompt ||
  payload.body ||
  payload.caption ||
  "";

function buildPrompt() {
  const title = titleInput.value.trim();
  const prompt = promptInput.value.trim();
  const style = styleInput.value;

  return `
Create a high-quality GhostMedia visual.

Title / Concept:
${title || "Untitled GhostMedia Concept"}

Image Direction:
${prompt || "Create a bold modern media image for social content."}

Style:
${style}

Rules:
- No readable text inside the image unless requested
- Make it modern and social-media ready
- Strong composition
- Clear subject
- Premium visual style
- Suitable for thumbnails, carousels, posts, or campaign art
`;
}

function renderLoading() {
  preview.innerHTML = `
    <div class="page-card">
      <h3>🧠 Generating concepts...</h3>
      <p>Ghost Image Studio is building three visual directions.</p>
    </div>
  `;
}

function renderImages(images) {
  if (!images || !images.length) {
    preview.innerHTML = `
      <div class="page-card faded">
        <h3>No images returned</h3>
        <p>Try a clearer prompt or different style.</p>
      </div>
    `;
    return;
  }

  preview.innerHTML = "";

  images.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "page-card image-concept-card";

    card.innerHTML = `
      <h3>Concept ${index + 1}</h3>

      <img
        class="generated-image"
        src="${src}"
        alt="Generated concept ${index + 1}"
      />

      <div class="btn-row">
        <button class="btn use-image-btn">
          ✅ Use This
        </button>

        <a
          class="btn"
          href="${src}"
          download="ghost-image-concept-${index + 1}.png"
        >
          ⬇ Download
        </a>
      </div>
    `;

    card.querySelector(".use-image-btn").addEventListener("click", () => {
      localStorage.setItem(
        "ghost-selected-image",
        JSON.stringify({
          title: titleInput.value.trim(),
          prompt: promptInput.value.trim(),
          style: styleInput.value,
          ratio: ratioInput.value,
          image: src,
          selectedAt: new Date().toISOString()
        })
      );

      alert("Image selected.");
    });

    preview.appendChild(card);
  });
}

generateBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!title && !prompt) {
    alert("Add a title or prompt first.");
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  renderLoading();

  try {
    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        prompt: buildPrompt(),
        style: styleInput.value,
        size: ratioInput.value,
        count: 3
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Image generation failed.");
    }

    renderImages(data.images || []);

  } catch (err) {
    console.error(err);

    preview.innerHTML = `
      <div class="page-card faded">
        <h3>Image generation failed</h3>
        <p>${err.message}</p>
      </div>
    `;

  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "✨ Generate 3 Concepts";
  }
});