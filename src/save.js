const KEY = "mini_incremental_save";

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function migrate(s) {
  if (!s) return null;
  // v1 -> v2
  if (!s.v || s.v === 1) {
    return {
      v: 2,
      coins: s.coins ?? 0,
      miners: s.miners ?? 0,
      minerCost: s.minerCost ?? 10,
      upgrades: {},
      lastSeenMs: Date.now(),
    };
  }
  return s;
}
