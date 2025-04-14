export function heavyTask(input) {
  let total = 0;
  for (let i = 0; i < input * 1e5; i++) {
    total += Math.sqrt(i);
  }
  return total;
}
