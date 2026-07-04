const GM_IDEAS_KEY = "ghostmedia-ideas";
const GM_PATTERNS_KEY = "ghostmedia-patterns";

function gmLoad(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function gmSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function gmIdeas() {
  return gmLoad(GM_IDEAS_KEY);
}

function gmSaveIdeas(ideas) {
  gmSave(GM_IDEAS_KEY, ideas);
}

function gmAddIdea(data) {
  const ideas = gmIdeas();

  ideas.unshift({
    id: crypto.randomUUID(),
    title: data.title || "Untitled Idea",
    platform: data.platform || "General",
    topic: data.topic || "General",
    format: data.format || "",
    hook: data.hook || "",
    emotion: data.emotion || "",
    cta: data.cta || "",
    status: "NEW",
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: new Date().toISOString()
  });

  gmSaveIdeas(ideas);
}

function gmUpdateStatus(id, status, extra = {}) {
  const ideas = gmIdeas().map(item =>
    item.id === id
      ? { ...item, ...extra, status, updatedAt: new Date().toISOString() }
      : item
  );

  gmSaveIdeas(ideas);
}

function gmRebuildPatterns() {
  const winners = gmLoad("ghost-winners");


  const patterns = winners.map(winner => ({
    id: crypto.randomUUID(),
    ideaId: winner.id,
    title: winner.title,
    hook: winner.hook || "",
    topic: winner.topic || "",
    format: winner.format || "",
    platform: winner.platform || "",
    emotion: winner.emotion || "",
    cta: winner.cta || "",
    views: Number(winner.views || 0),
    likes: Number(winner.likes || 0),
    comments: Number(winner.comments || 0),
    shares: Number(winner.shares || 0),
    createdAt: new Date().toISOString()
  }));

  gmSave(GM_PATTERNS_KEY, patterns);
  return patterns;
}

function gmPatterns() {
  return gmLoad(GM_PATTERNS_KEY);
}

function gmBestPattern() {
  const patterns = gmPatterns();
  const counts = {};

  patterns.forEach(p => {
    const key = [p.topic, p.format, p.hook].filter(Boolean).join(" | ");
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  return best
    ? { label: best[0], count: best[1] }
    : null;
}