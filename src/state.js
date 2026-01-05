import { N } from "./numbers.js";
import { aggregateEffects, upgradeCost, upgradeLevel } from "./upgrades.js";

export function createStore(initialState) {
  let state = structuredClone(initialState);
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(next) {
    console.log("Set state. Current: ", state, ". New: ", next);
    state = next;
    listeners.forEach((fn) => fn(state));
    console.log("Resulting state: ", state);
  }

  function patch(partial) {
    setState({ ...state, ...partial });
  }

  function subscribe(fn) {
    listeners.add(fn);
    fn(state); // initial call
    return () => listeners.delete(fn);
  }

  return { getState, setState, patch, subscribe };
}

export function defaultState() {
  return {
    v: 2,
    coins: 0,
    miners: 0,
    minerCost: 10,
    upgrades: {}, // { [id]: level }
    lastSeenMs: Date.now(), // for offline
  };
}

export function computeCps(s) {
  const { minerMult } = aggregateEffects(s);
  return s.miners * 1 * minerMult;
}

export function click(s) {
  const { clickMult } = aggregateEffects(s);
  console.log(
    "ClickMultiplier",
    clickMult,
    ". Coins: ",
    s.coins,
    ": N.mul: ",
    N.mul(1, clickMult, ". N.add: ", N.add(s.coins, N.mul(1, clickMult)))
  );
  return { ...s, coins: N.add(s.coins, N.mul(1, clickMult)) };
}

export function buyMiner(s) {
  if (!N.gte(s.coins, s.minerCost)) return s;
  return {
    ...s,
    coins: N.sub(s.coins, s.minerCost),
    miners: s.miners + 1,
    minerCost: Math.ceil(s.minerCost * 1.15),
  };
}

export function buyUpgrade(s, id) {
  const uCost = upgradeCost(s, id);
  if (!N.gte(s.coins, uCost)) return s;

  const lvl = upgradeLevel(s, id);
  return {
    ...s,
    coins: N.sub(s.coins, uCost),
    upgrades: { ...s.upgrades, [id]: lvl + 1 },
  };
}

export function tick(s, dt) {
  const gain = N.mul(computeCps(s), dt);
  return { ...s, coins: N.add(s.coins, gain) };
}

// Offline progress: run a capped tick on load/resume
export function applyOffline(s, nowMs, { maxSeconds = 8 * 60 * 60 } = {}) {
  const last = s.lastSeenMs ?? nowMs;
  const offlineSec = Math.min(Math.max(0, (nowMs - last) / 1000), maxSeconds);
  if (offlineSec <= 0) return { ...s, lastSeenMs: nowMs };

  const after = tick(s, offlineSec);
  return { ...after, lastSeenMs: nowMs, _offlineSec: offlineSec };
}
