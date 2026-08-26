/* Shared creative-output compatibility layer.
 * Records stay in the canonical Review queue until a future durable asset store exists.
 */
function gmCreativeContext(data = {}) {
  return {
    sourceId: data.sourceId || data.ideaId || data.contentId || null,
    sourceType: data.sourceType || data.source || "manual",
    product: data.product || data.page || data.category || "",
    category: data.category || data.page || data.product || "",
    topic: data.topic || data.category || data.page || data.product || "General",
    hook: data.hook || data.title || "",
    angle: data.angle || data.pattern || data.message || "",
    emotion: data.emotion || "",
    caption: data.caption || "",
    cta: data.cta || "",
    platform: data.platform || "",
    createdAt: data.createdAt || new Date().toISOString()
  };
}

function gmEscapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function gmBuildCreativeStrategy(data = {}) {
  const context = gmCreativeContext(data);
  const subject = data.subject || data.whatHappened || context.topic || "this moment";
  const message = data.message || context.angle || `Why ${subject} matters`;
  const hook = context.hook || `The moment that changed ${subject}`;
  const caption = context.caption || `${hook}\n\n${message}`;
  const cta = context.cta || "What stands out to you?";

  return { ...context, hook, caption, cta };
}

function gmQueueCreativeAsset(data = {}) {
  const context = gmCreativeContext(data);
  const queue = gmGetQueue();
  const record = gmNormalizeItem({
    id: data.id || crypto.randomUUID(),
    title: data.title || context.hook || "Untitled Creative",
    type: data.type || "creative",
    format: data.format || data.type || "creative",
    status: "READY",
    source: data.source || "creative",
    product: context.product,
    page: context.category,
    topic: context.topic,
    caption: context.caption,
    payload: {
      ...(data.payload || {}),
      ...data,
      ...context,
      status: "READY"
    },
    createdAt: context.createdAt
  }, { status: "READY" });

  try {
    gmSaveQueue(gmUpsert(queue, record));
  } catch (error) {
    if (error?.name === "QuotaExceededError") {
      throw new Error("This media is too large for browser storage. Use a smaller file or download it and keep the Review record separately.");
    }
    throw error;
  }
  return record;
}

function gmReadFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function gmCompressImageDataUrl(src, options = {}) {
  const maxDimension = Number(options.maxDimension || 1600);
  const quality = Number(options.quality || 0.82);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Could not prepare that image."));
    image.src = src;
  });
}

async function gmCompressImageFile(file, options = {}) {
  return gmCompressImageDataUrl(await gmReadFileAsDataUrl(file), options);
}

window.gmCreativeContext = gmCreativeContext;
window.gmEscapeHtml = gmEscapeHtml;
window.gmBuildCreativeStrategy = gmBuildCreativeStrategy;
window.gmQueueCreativeAsset = gmQueueCreativeAsset;
window.gmReadFileAsDataUrl = gmReadFileAsDataUrl;
window.gmCompressImageDataUrl = gmCompressImageDataUrl;
window.gmCompressImageFile = gmCompressImageFile;
