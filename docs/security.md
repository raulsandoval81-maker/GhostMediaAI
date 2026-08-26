# Ghost Media internal access

Ghost Media's AI endpoints require a signed, HttpOnly browser session. The static UI does not contain or persist the internal access key.

## Required server environment

- `OPENAI_API_KEY`: provider credential used only by serverless functions.
- `GHOST_ACCESS_KEY`: the internal key entered by the single authorized user. Use at least 16 random characters.
- `GHOST_SESSION_SECRET`: a separate random signing secret of at least 24 characters.
- `GHOST_ALLOWED_ORIGINS`: comma-separated production origins, including scheme and hostname, with no path. Example: `https://ghost.example.com`.
- `GHOST_AI_RATE_LIMIT` (optional): requests per AI endpoint, per client address, per hour. Default: `30`.

Vercel's production and deployment hostnames are also recognized from `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_URL`. Local development accepts only `localhost`, `127.0.0.1`, and `::1` HTTP/HTTPS origins.

## Browser authentication

When an AI request returns `401`, `/assets/js/api-client.js` asks the user for `GHOST_ACCESS_KEY` and sends it once to `/api/session`. A valid key creates a 12-hour, `HttpOnly`, `SameSite=Strict` signed cookie. The key is not written to local storage, session storage, cookies, HTML, or bundled JavaScript. The original AI request is then retried with the session cookie.

Production requests use a `Secure` cookie when Vercel reports HTTPS. All AI calls should remain same-origin.

## Operational note

The built-in rate limiter is intentionally lightweight and held in each warm serverless instance. It protects against accidental repeat loops and basic abuse in this single-user phase. If Ghost Media becomes multi-user or broadly public, replace it with a shared durable rate-limit store and full identity management.
