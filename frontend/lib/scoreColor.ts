export function scoreColor(score: number): string {
  if (score >= 80) return 'bg-red-600 text-white';
  if (score >= 60) return 'bg-orange-400 text-white';
  if (score >= 40) return 'bg-yellow-400 text-black';
  return 'bg-green-500 text-white';
}
