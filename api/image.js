import {
  handlePreflight,
  requireApiAccess,
  requireJsonPost,
  safeProviderError
} from "./_security.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!requireApiAccess(req, res, "image")) return;
  if (!requireJsonPost(req, res, 16 * 1024)) return;

  try {
    const {
      title = "",
      prompt = "",
      size = "1024x1024",
      count = 3
    } = req.body || {};

    if ((typeof title !== "string" && typeof prompt !== "string") || (!String(title).trim() && !String(prompt).trim())) {
      return res.status(400).json({
        error: "Title or prompt is required."
      });
    }

    const cleanTitle = String(title).trim().slice(0, 200);
    const cleanPrompt = String(prompt).trim().slice(0, 6000);
    const allowedSizes = new Set(["1024x1024", "1024x1536", "1536x1024"]);
    const safeSize = allowedSizes.has(size) ? size : "1024x1024";

    if (!cleanTitle && !cleanPrompt) {
      return res.status(400).json({ error: "Title or prompt is required." });
    }

    const safeCount = Math.min(Math.max(Number(count) || 1, 1), 3);

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: cleanPrompt || cleanTitle,
        size: safeSize,
        n: safeCount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return safeProviderError(res, response.status, "Image generation is temporarily unavailable.");
    }

    const images = (data.data || [])
      .map((item) => {
        if (item.b64_json) {
          return `data:image/png;base64,${item.b64_json}`;
        }

        return item.url || "";
      })
      .filter(Boolean);

    return res.status(200).json({
      images
    });

  } catch {
    return res.status(500).json({
      error: "Image generation failed safely."
    });
  }
}
