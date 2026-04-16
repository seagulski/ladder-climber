const STORAGE_KEY = "ladder_climber_leaderboard_v1";
const MAX_ENTRIES = 10;

export default class LeaderboardManager {
  constructor() {
    this.entries = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
    } catch { /* silent */ }
  }

  getEntries() {
    return [...this.entries];
  }

  qualifies(score) {
    if (this.entries.length < MAX_ENTRIES) return true;
    const lowest = this.entries[this.entries.length - 1];
    return score > (lowest?.score ?? 0);
  }

  addEntry(run) {
    const entry = {
      name: this.sanitize(run.name),
      score: run.score ?? 0,
      highestTitle: run.highestTitle ?? "Intern (Unpaid)",
      timeSurvivedMs: run.timeSurvivedMs ?? 0,
      demotions: run.demotions ?? 0,
      date: new Date().toISOString()
    };

    this.entries.push(entry);
    this.entries.sort((a, b) => b.score - a.score);
    if (this.entries.length > MAX_ENTRIES) {
      this.entries = this.entries.slice(0, MAX_ENTRIES);
    }

    this.save();
    return entry;
  }

  sanitize(name) {
    const cleaned = (name || "ANON")
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, "")
      .trim()
      .slice(0, 12);
    return cleaned.length > 0 ? cleaned : "ANON";
  }
}
