import { N } from "./numbers.js";
import { computeCps } from "./state.js";
import { UPGRADES, upgradeCost, upgradeLevel } from "./upgrades.js";

export function bindUI(store) {
  const elCoins = document.getElementById("coins");
  const elCps = document.getElementById("cps");
  const btnClick = document.getElementById("click");
  const btnBuyMiner = document.getElementById("buyMiner");

  // create upgrades area
  const upgradesRoot = document.createElement("div");
  upgradesRoot.className = "row";
  upgradesRoot.style.flexDirection = "column";
  upgradesRoot.style.alignItems = "flex-start";
  document.body.appendChild(upgradesRoot);

  const offlineNote = document.createElement("div");
  offlineNote.className = "row muted";
  document.body.insertBefore(offlineNote, upgradesRoot);

  const upgradeButtons = new Map();
  for (const u of UPGRADES) {
    const b = document.createElement("button");
    b.dataset.upgradeId = u.id;
    upgradesRoot.appendChild(b);
    upgradeButtons.set(u.id, b);

    const small = document.createElement("div");
    small.className = "muted";
    small.style.marginBottom = "8px";
    small.textContent = u.desc;
    upgradesRoot.appendChild(small);
  }

  return {
    btnClick,
    btnBuyMiner,
    upgradeButtons,
    render(s) {
      elCoins.textContent = N.fmt(s.coins);
      elCps.textContent = computeCps(s).toFixed(1);

      btnBuyMiner.disabled = s.coins < s.minerCost;
      btnBuyMiner.textContent = `Buy Miner (cost ${N.fmt(s.minerCost)})`;

      const off = s._offlineSec
        ? `Offline gained ~${s._offlineSec.toFixed(0)}s`
        : "";
      offlineNote.textContent = off;

      for (const u of UPGRADES) {
        const lvl = upgradeLevel(s, u.id);
        const cost = upgradeCost(s, u.id);
        const b = upgradeButtons.get(u.id);
        b.disabled = s.coins < cost || (u.maxLevel && lvl >= u.maxLevel);
        b.textContent = `${u.name} (lvl ${lvl}) — cost ${N.fmt(cost)}`;
      }
    },
  };
}
