import { tick } from "./state.js";

export function startSimThrottled(initialState, { renderHz = 10 } = {}) {
  let sim = structuredClone(initialState);
  let last = performance.now();
  let acc = 0;
  const renderInterval = 1 / renderHz;

  const listeners = new Set();

  function publish() {
    listeners.forEach((fn) => fn(sim));
  }

  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;

    sim = tick(sim, dt);
    acc += dt;

    if (acc >= renderInterval) {
      acc = 0;
      publish();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  return {
    getState: () => sim,

    // UI actions call this
    apply(fn) {
      sim = fn(sim);
      publish(); // immediate feedback
    },

    subscribe(fn) {
      listeners.add(fn);
      fn(sim);
      return () => listeners.delete(fn);
    },
  };
}
