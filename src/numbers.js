export const N = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  gte: (a, b) => a >= b,
  floor: (a) => Math.floor(a),
  fmt: (x) => {
    if (!Number.isFinite(x)) return "∞";
    if (x < 1e6) return x.toFixed(0);
    const units = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
    let u = 0;
    while (x >= 1000 && u < units.length - 1) {
      x /= 1000;
      u++;
    }
    return `${x.toFixed(x >= 100 ? 0 : x >= 10 ? 1 : 2)}${units[u]}`;
  },
};
