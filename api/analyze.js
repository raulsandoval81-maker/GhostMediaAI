export default async function handler(req, res) {
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

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content:
                "You are GhostMedia AI, an AI media analyst. Analyze content for media opportunity. Return only valid JSON. No markdown."
            },
            {
              role: "user",
              content: `
Analyze this content and return JSON with these fields:

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
- score must be 1 to 10
- ideas must contain 5 content ideas
- platforms should recommend social platforms
- nextStep must be one of: Scout, Ideas, Content, Factory, Archive

Content:
${content}
`
            }
          ]
        })
      }
    );

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