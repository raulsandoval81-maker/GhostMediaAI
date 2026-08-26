async function gmCreateApiSession() {
  const accessKey = window.prompt("Enter the Ghost Media internal access key:");
  if (!accessKey) return false;

  const response = await fetch("/api/session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessKey })
  });

  if (!response.ok) {
    let message = "Ghost Media access was not accepted.";
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {}
    throw new Error(message);
  }
  return true;
}

async function gmApiFetch(url, options = {}) {
  const request = { ...options, credentials: "same-origin" };
  let response = await fetch(url, request);
  if (response.status !== 401 || url === "/api/session") return response;
  if (!(await gmCreateApiSession())) return response;
  return fetch(url, request);
}

window.gmApiFetch = gmApiFetch;
