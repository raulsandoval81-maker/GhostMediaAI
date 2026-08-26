export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      title = "",
      prompt = "",
      size = "1024x1024",
      count = 3
    } = req.body || {};

    if (!title && !prompt) {
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
      return res.status(response.status).json({
        error: "OpenAI image request failed.",
        message:
          data.error?.message ||
          data.message ||
          "Image generation failed.",
        details: data
      });
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

  } catch (error) {
    return res.status(500).json({
      error: "Image generation failed.",
      message: error.message
    });
  }
}
