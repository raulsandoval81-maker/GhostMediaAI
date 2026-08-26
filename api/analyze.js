import {
  fetchPublicText,
  handlePreflight,
  publicSourceError,
  requireApiAccess,
  requireJsonPost,
  safeProviderError
} from "./_security.js";

function isUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getContentForAnalysis(rawContent) {
  const trimmed = String(rawContent).trim();

  if (!isUrl(trimmed)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) throw new Error("INVALID_SOURCE_URL");
    return {
      sourceType: "Pasted Text",
      sourceUrl: "",
      analysisContent: trimmed
    };
  }

  const page = await fetchPublicText(trimmed);
  const text = stripHtml(page.text).slice(0, 12000);

  return {
    sourceType: "Public URL",
    sourceUrl: page.finalUrl,
    analysisContent: text
  };
}

export default async function handler(req, res) {
  if (handlePreflight(req, res)) return;
  if (!requireApiAccess(req, res, "analyze")) return;
  if (!requireJsonPost(req, res, 64 * 1024)) return;

  try {
    const { content } = req.body || {};

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        error: "Content is required."
      });
    }

    if (content.length > 50000) return res.status(413).json({ error: "Source content is too large." });

    let prepared;
    try {
      prepared = await getContentForAnalysis(content);
    } catch (error) {
      const safe = publicSourceError(error);
      return res.status(safe.status).json({ error: safe.message });
    }

    const prompt = `
You are GhostMedia AI, an AI media analyst.

Analyze the provided content and return ONLY valid JSON.
No markdown. No explanation.

Return this exact structure:

{
  "briefTitle": "",
  "sourceType": "",
  "sourceUrl": "",
  "sourceName": "",
  "contentType": "",
  "confidence": 0,
  "executiveSummary": "",
  "topic": "",
  "pattern": "",
  "emotion": "",
  "tension": "",
  "lesson": "",
  "audience": [],
  "opportunities": [],
  "score": 0,
  "ideas": [],
  "platforms": [],
  "primaryDestination": "",
  "secondaryDestination": "",
  "archiveValue": "",
  "nextStep": ""
}

Rules:
- sourceType must be: "${prepared.sourceType}"
- sourceUrl must be: "${prepared.sourceUrl}"
- score must be a number from 1 to 10
- ideas must contain exactly 5 content ideas
- platforms should recommend social platforms
- nextStep must be one of: Scout, Ideas, Content, Factory, Archive
- Do not invent a topic that is not supported by the content.
- briefTitle should sound like an intelligence report title
- sourceName should identify the brand, website, creator, or source when possible
- contentType should describe what the content is, such as Website, Article, Transcript, Email, Notes, Social Post, or Report
- confidence must be a number from 1 to 100
- executiveSummary must be 1 to 3 sentences
- opportunities must contain 5 to 7 opportunity areas
- primaryDestination must be one of: Scout, Ideas, Content, Factory, Archive
- secondaryDestination must be one of: Scout, Ideas, Content, Factory, Archive
- archiveValue must be one of: Low, Medium, High

Content:
${prepared.analysisContent}
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
      return safeProviderError(res, response.status, "Source analysis is temporarily unavailable.");
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    const analysis = JSON.parse(text);

    return res.status(200).json(analysis);
  } catch {
    return res.status(500).json({
      error: "Source analysis failed safely."
    });
  }
}
