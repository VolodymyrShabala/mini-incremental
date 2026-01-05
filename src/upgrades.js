export const UPGRADES = [
  {
    id: "double_click",
    name: "Double Click Power",
    desc: "Clicks give 2x coins.",
    baseCost: 25,
    costMult: 2.25,
    maxLevel: 10,
    effect: (lvl) => ({ clickMult: 1 + lvl }), // lvl=1 => 2x
  },
  {
    id: "miner_tools",
    name: "Better Tools",
    desc: "Miners produce more.",
    baseCost: 50,
    costMult: 2.0,
    maxLevel: 25,
    effect: (lvl) => ({ minerMult: 1 + lvl * 0.25 }), // +25% per level
  },
];

export function upgradeLevel(state, id) {
  return state.upgrades[id] ?? 0;
}

export function upgradeCost(state, id) {
  const u = UPGRADES.find((x) => x.id === id);
  const lvl = upgradeLevel(state, id);
  return Math.ceil(u.baseCost * Math.pow(u.costMult, lvl));
}

export function aggregateEffects(state) {
  let clickMult = 1;
  let minerMult = 1;
  for (const u of UPGRADES) {
    const lvl = upgradeLevel(state, u.id);
    if (!lvl) continue;
    const eff = u.effect(lvl);
    if (eff.clickMult) clickMult *= eff.clickMult;
    if (eff.minerMult) minerMult *= eff.minerMult;
  }
  return { clickMult, minerMult };
}
