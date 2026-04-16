const API_URL = "https://ladder-climber-api.seagullski.workers.dev/api/leaderboard";

export default class GlobalLeaderboard {
  static async fetch(view = "score") {
    try {
      const res = await fetch(`${API_URL}?view=${view}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.entries || [];
    } catch {
      return [];
    }
  }

  static async submit(run) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: run.name,
          score: run.score,
          highestTitle: run.highestTitle,
          highestFloor: run.highestFloor,
          timeSurvivedMs: run.timeSurvivedMs,
          demotions: run.demotions,
          maxMultiplier: run.maxMultiplier
        })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}
