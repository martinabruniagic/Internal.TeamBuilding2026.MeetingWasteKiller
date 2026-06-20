import { scoreColor } from '@/lib/scoreColor';

interface Props { score: number; }

export default function ScoreBadge({ score }: Props) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${scoreColor(score)}`}>
      {score.toFixed(0)}
    </span>
  );
}
