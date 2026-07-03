export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { content } = req.body || {};

    if (!content || !String(content).trim()) {
      return res.status(400).json({
        error: "Content is required."
      });
    }

    const prompt = `
You are GhostMedia AI, an AI media analyst.

Analyze this content and return ONLY valid JSON.
No markdown. No explanation.

Return this exact structure:

{
  "topic": "",
  "pattern": "",
  "emotion": "",
  "tension": "",
  "lesson": "",
  "audience": [],
  "score": 0,
  "ideas": [],
  "platforms": [],
  "nextStep": ""
}

Rules:
- score must be a number from 1 to 10
- ideas must contain exactly 5 content ideas
- platforms should recommend social platforms
- nextStep must be one of: Scout, Ideas, Content, Factory, Archive

Content:
${content}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

    const analysis = JSON.parse(text);

    return res.status(200).json(analysis);
  } catch (error) {
    return res.status(500).json({
      error: "Analyze failed.",
      message: error.message
    });
  }
}