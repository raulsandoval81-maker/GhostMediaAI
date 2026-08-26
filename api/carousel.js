import {
  handlePreflight,
  requireApiAccess,
  requireJsonPost,
  safeProviderError
} from "./_security.js";

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!requireApiAccess(req, res, "carousel")) return;
  if (!requireJsonPost(req, res, 48 * 1024)) return;

  try {
    const { title, source } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Carousel title is required."
      });
    }
    const cleanTitle = title.trim().slice(0, 300);
    const safeSource = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    if (Buffer.byteLength(JSON.stringify(safeSource), "utf8") > 40000) {
      return res.status(413).json({ error: "Carousel source is too large." });
    }

    const prompt = `
You are GhostMedia Carousel Builder.

Create a 5-slide public-facing social media carousel.

Do not chat.
Do not explain.
Do not address the user.
Return ONLY valid JSON.

Return this exact structure:

{
  "slide1": "",
  "slide2": "",
  "slide3": "",
  "slide4": "",
  "slide5": "",
  "caption": "",
  "hashtags": ""
}

Rules:
- carousel slides are PUBLIC content, not private strategy
- no advice to the creator inside slides
- each slide must be 3 to 7 words
- no slide may exceed 45 characters
- write like a poster, not a paragraph
- if the selected title is too long, shorten it
- slide1 must be a tight hook
- slides 2-5 must build a clear story
- caption may be longer and ready to post
- hashtags should be one line
- no markdown
- no numbering
- no explanation

Selected Title:
${cleanTitle}

Source Context:
${JSON.stringify(safeSource, null, 2)}
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
      return safeProviderError(res, response.status, "Carousel generation is temporarily unavailable.");
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    const parsed = JSON.parse(text);

    return res.status(200).json({
      slide1: parsed.slide1 || cleanTitle,
      slide2: parsed.slide2 || "",
      slide3: parsed.slide3 || "",
      slide4: parsed.slide4 || "",
      slide5: parsed.slide5 || "",
      caption: parsed.caption || "",
      hashtags: parsed.hashtags || ""
    });

  } catch {
    return res.status(500).json({
      error: "Carousel generation failed safely."
    });
  }
}
