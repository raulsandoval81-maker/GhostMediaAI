const payload = JSON.parse(
  localStorage.getItem("ghost-image-payload") || "{}"
);

const titleInput = document.getElementById("title");
const promptInput = document.getElementById("prompt");
const styleInput = document.getElementById("style");
const ratioInput = document.getElementById("ratio");
const productInput = document.getElementById("product");
const topicInput = document.getElementById("topic");
const sourceContext = document.getElementById("imageSourceContext");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");

titleInput.value = payload.title || "";
promptInput.value =
  payload.prompt ||
  payload.body ||
  payload.caption ||
  "";
productInput.value = payload.product || payload.page || payload.category || "";
topicInput.value = payload.topic || payload.title || "";

if (sourceContext && (payload.sourceId || payload.sourceType || payload.source)) {
  sourceContext.textContent = `Source: ${payload.sourceType || payload.source || "content"}${payload.sourceTitle ? ` · ${payload.sourceTitle}` : ""}`;
}

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
  const safeImages = Array.isArray(images)
    ? images.filter((src) => typeof src === "string" && (/^data:image\/(png|jpeg|webp);base64,/i.test(src) || /^https:\/\//i.test(src)))
    : [];

  if (!safeImages.length) {
    preview.innerHTML = `
      <div class="page-card faded">
        <h3>No images returned</h3>
        <p>Try a clearer prompt or different style.</p>
      </div>
    `;
    return;
  }

  preview.innerHTML = "";

  safeImages.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "page-card image-concept-card";

    const heading = document.createElement("h3");
    heading.textContent = `Concept ${index + 1}`;
    const image = document.createElement("img");
    image.className = "generated-image";
    image.src = src;
    image.alt = `Generated concept ${index + 1}`;
    const buttonRow = document.createElement("div");
    buttonRow.className = "btn-row";
    const useButton = document.createElement("button");
    useButton.className = "btn use-image-btn";
    useButton.textContent = "✅ Send to Review";
    const download = document.createElement("a");
    download.className = "btn";
    download.href = src;
    download.download = `ghost-image-concept-${index + 1}.png`;
    download.textContent = "⬇ Download";
    buttonRow.append(useButton, download);
    card.append(heading, image, buttonRow);

    card.querySelector(".use-image-btn").addEventListener("click", async () => {
      const button = useButton;
      button.disabled = true;
      button.textContent = "Preparing...";

      try {
        const image = await gmCompressImageDataUrl(src);
        gmQueueCreativeAsset({
          type: "ai-image",
          format: "single-image",
          source: "ai-image-studio",
          sourceId: payload.sourceId || payload.ideaId || payload.contentId || null,
          sourceType: payload.sourceType || payload.source || "manual",
          title: titleInput.value.trim() || "AI Image",
          product: productInput.value.trim(),
          category: productInput.value.trim(),
          topic: topicInput.value.trim(),
          hook: payload.hook || titleInput.value.trim(),
          caption: payload.caption || "",
          cta: payload.cta || "",
          prompt: promptInput.value.trim(),
          style: styleInput.value,
          aspectRatio: ratioInput.value,
          image,
          provider: "openai",
          createdAt: new Date().toISOString()
        });
        window.location.assign("/dashboard/queue.html?from=ai-image");
      } catch (error) {
        alert(error.message || "Could not send that image to Review.");
        button.disabled = false;
        button.textContent = "✅ Send to Review";
      }
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
    const response = await gmApiFetch("/api/image", {
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
