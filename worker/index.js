// Cloudflare Worker — Global Leaderboard API
// Endpoints:
//   GET  /api/leaderboard         — top 25 scores
//   GET  /api/leaderboard?view=X  — alternate views (title, survival, demotions)
//   POST /api/leaderboard         — submit a score

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const MAX_ENTRIES_RETURNED = 25;
const BUILD_VERSION = "1.0.0";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/leaderboard") {
      if (request.method === "GET") {
        return handleGet(url, env);
      }
      if (request.method === "POST") {
        return handlePost(request, env);
      }
    }

    return json({ error: "Not found" }, 404);
  }
};

async function handleGet(url, env) {
  const view = url.searchParams.get("view") || "score";

  let orderBy;
  switch (view) {
    case "title":
      orderBy = "highest_floor DESC, score DESC";
      break;
    case "survival":
      orderBy = "time_survived_ms DESC, score DESC";
      break;
    case "demotions":
      orderBy = "demotions ASC, score DESC";
      break;
    default:
      orderBy = "score DESC";
  }

  const result = await env.DB.prepare(
    `SELECT name, score, highest_title, highest_floor, time_survived_ms,
            demotions, max_multiplier, created_at
     FROM leaderboard
     ORDER BY ${orderBy}
     LIMIT ?`
  ).bind(MAX_ENTRIES_RETURNED).all();

  return json({ entries: result.results || [] });
}

async function handlePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Validate
  const name = sanitizeName(body.name);
  const score = Math.floor(Number(body.score) || 0);
  const highestTitle = String(body.highestTitle || "Intern (Unpaid)").slice(0, 60);
  const highestFloor = Math.floor(Number(body.highestFloor) || 1);
  const timeSurvivedMs = Math.floor(Number(body.timeSurvivedMs) || 0);
  const demotions = Math.floor(Number(body.demotions) || 0);
  const maxMultiplier = Math.round((Number(body.maxMultiplier) || 1.0) * 10) / 10;

  if (score <= 0) {
    return json({ error: "Score must be positive" }, 400);
  }
  if (score > 999999) {
    return json({ error: "Score too high" }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO leaderboard (name, score, highest_title, highest_floor,
     time_survived_ms, demotions, max_multiplier, build_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(name, score, highestTitle, highestFloor, timeSurvivedMs,
         demotions, maxMultiplier, BUILD_VERSION).run();

  return json({ success: true, name, score });
}

function sanitizeName(name) {
  const cleaned = String(name || "ANON")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .trim()
    .slice(0, 12);
  return cleaned.length > 0 ? cleaned : "ANON";
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS
    }
  });
}
