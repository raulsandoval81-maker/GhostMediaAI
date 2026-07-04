export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, source } = req.body || {};

    if (!title) {
      return res.status(400).json({
        error: "Carousel title is required."
      });
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
${title}

Source Context:
${JSON.stringify(source || {}, null, 2)}
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
      return res.status(response.status).json({
        error: "OpenAI request failed.",
        details: data
      });
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    const parsed = JSON.parse(text);

    return res.status(200).json({
      slide1: parsed.slide1 || title,
      slide2: parsed.slide2 || "",
      slide3: parsed.slide3 || "",
      slide4: parsed.slide4 || "",
      slide5: parsed.slide5 || "",
      caption: parsed.caption || "",
      hashtags: parsed.hashtags || ""
    });

  } catch (error) {
    return res.status(500).json({
      error: "Carousel generation failed.",
      message: error.message
    });
  }
}