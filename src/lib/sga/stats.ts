export function mean(arr: number[]) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdDev(arr: number[]) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const sq = arr.reduce((a, b) => a + (b - m) ** 2, 0);
  return Math.sqrt(sq / arr.length);
}

export function percentil(vals: number[], q: number) {
  if (!vals.length) return 0;
  const a = [...vals].sort((x, y) => x - y);
  const idx = (a.length - 1) * q;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (idx - lo);
}

export function regresionLineal(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
  const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);
  const sumY2 = y.reduce((s, yi) => s + yi * yi, 0);
  const den = n * sumX2 - sumX * sumX;
  const slope = den === 0 ? 0 : (n * sumXY - sumX * sumY) / den;
  const intercept = n === 0 ? 0 : (sumY - slope * sumX) / n;
  const rDen = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = rDen === 0 ? 0 : (n * sumXY - sumX * sumY) / rDen;
  return { slope, intercept, r };
}
