import {
  defaultState,
  click,
  buyMiner,
  buyUpgrade,
  applyOffline,
} from "./state.js";
import { startSimThrottled } from "./sim.js";
import { bindUI } from "./ui.js";
import { load, save, migrate } from "./save.js";

const loaded = migrate(load());
const seeded = applyOffline(loaded ?? defaultState(), Date.now());

const sim = startSimThrottled(seeded, { renderHz: 10 });

const ui = bindUI();

// render subscription
sim.subscribe((s) => ui.render(s));

// actions
ui.btnClick.addEventListener("click", () => sim.apply(click));
ui.btnBuyMiner.addEventListener("click", () => sim.apply(buyMiner));
for (const [id, btn] of ui.upgradeButtons.entries()) {
  btn.addEventListener("click", () => sim.apply((s) => buyUpgrade(s, id)));
}

// saving
setInterval(() => save(sim.getState()), 5000);
window.addEventListener("beforeunload", () => save(sim.getState()));
