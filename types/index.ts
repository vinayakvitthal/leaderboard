export type Badge =
  | 'Quiz Master'
  | 'Code Ninja'
  | 'Scholar'
  | 'Streak'
  | 'Hacker'
  | 'Rising Star';

export type Trend = 'up' | 'down' | 'same';

export interface Participant {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  badge: Badge;
  trend: Trend;
  trendDelta: number;
}
