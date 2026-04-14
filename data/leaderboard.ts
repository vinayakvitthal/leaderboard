import { Participant } from '../types';

const MOCK_PARTICIPANTS: Participant[] = [
  { id: '1',  name: 'Arjun',  avatarUrl: '😎', score: 1240, badge: 'Quiz Master', trend: 'same', trendDelta: 0 },
  { id: '2',  name: 'Priya',  avatarUrl: '😊', score: 1180, badge: 'Code Ninja',  trend: 'up',   trendDelta: 2 },
  { id: '3',  name: 'Rohan',  avatarUrl: '🙂', score: 1050, badge: 'Scholar',     trend: 'down', trendDelta: 1 },
  { id: '4',  name: 'Sneha',  avatarUrl: '🤩', score: 940,  badge: 'Streak',      trend: 'up',   trendDelta: 3 },
  { id: '5',  name: 'Kiran',  avatarUrl: '😏', score: 880,  badge: 'Hacker',      trend: 'down', trendDelta: 2 },
  { id: '6',  name: 'Meera',  avatarUrl: '😄', score: 820,  badge: 'Rising Star', trend: 'up',   trendDelta: 1 },
  { id: '7',  name: 'Dev',    avatarUrl: '🧐', score: 760,  badge: 'Scholar',     trend: 'same', trendDelta: 0 },
  { id: '8',  name: 'Ananya', avatarUrl: '😃', score: 700,  badge: 'Quiz Master', trend: 'down', trendDelta: 1 },
  { id: '9',  name: 'Raj',    avatarUrl: '🤓', score: 650,  badge: 'Code Ninja',  trend: 'up',   trendDelta: 2 },
  { id: '10', name: 'Lena',   avatarUrl: '😁', score: 580,  badge: 'Hacker',      trend: 'same', trendDelta: 0 },
];

/**
 * Fetch leaderboard participants sorted by score descending.
 * Replace this function body to wire up the real API — no component changes needed.
 */
export async function fetchLeaderboard(): Promise<Participant[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...MOCK_PARTICIPANTS].sort((a, b) => b.score - a.score);
}
