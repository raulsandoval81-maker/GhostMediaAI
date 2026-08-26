/* Legacy aliases only. storage.js is the canonical persistence implementation. */
(function exposeLegacyGhostLoopAliases() {
  if (typeof window.gmGetIdeas !== "function") {
    console.warn("GhostMedia: load storage.js before ghost-loop.js.");
    return;
  }

  window.gmIdeas = window.gmGetIdeas;
  window.gmUpdateStatus = window.gmUpdateIdeaStatus;
  window.gmPatterns = window.gmGetPatterns;
})();
