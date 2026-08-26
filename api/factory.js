import {
  handlePreflight,
  requireApiAccess,
  requireJsonPost,
  safeProviderError
} from "./_security.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!requireApiAccess(req, res, "factory")) return;
  if (!requireJsonPost(req, res, 64 * 1024)) return;

  try {
    const { source } = req.body || {};

    if (!source || typeof source !== "object" || Array.isArray(source)) {
      return res.status(400).json({
        error: "Source content is required."
      });
    }
    if (Buffer.byteLength(JSON.stringify(source), "utf8") > 60000) {
      return res.status(413).json({ error: "Factory source is too large." });
    }

    const prompt = `
You are GhostMedia Factory.

Generate content assets from the supplied source.

Do not chat.
Do not explain.
Do not address the user.
Return ONLY valid JSON.

Return this exact structure:

{
  "variations": [],
  "strategy": {
    "why": "",
    "audience": "",
    "emotion": "",
    "opportunity": "",
    "recommendation": ""
  }
}

Rules:
- variations must contain exactly 10 strings
- variations are PUBLIC content titles or angles
- strategy is PRIVATE internal guidance
- do not put private advice inside variations
- each variation must be specific to the source
- no hashtags in variations
- no numbering
- no markdown
- keep each variation under 12 words
- avoid duplicate meanings

Source:
${JSON.stringify(source, null, 2)}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return safeProviderError(res, response.status, "Variation generation is temporarily unavailable.");
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    const parsed = JSON.parse(text);

    return res.status(200).json({
      variations: Array.isArray(parsed.variations)
        ? parsed.variations.map(x => String(x).trim()).filter(Boolean).slice(0, 10)
        : [],
      strategy: parsed.strategy || {}
    });

  } catch {
    return res.status(500).json({
      error: "Variation generation failed safely."
    });
  }
}
