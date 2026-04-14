# Leaderboard React Native App — Design Spec

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

A React Native (Expo) leaderboard app for education contexts — classroom quiz scores and coding challenge participants. Single screen, dark-themed, showing a visual podium for the top 3 and a full scrollable list of all participants below.

Data is mocked locally for now; the data layer is structured so the real API can be wired in by changing a single function.

---

## Architecture

**Toolchain:** Expo managed workflow, TypeScript, Expo Router.

**Project structure:**

```
leaderboard/
├── app/
│   └── index.tsx           # Leaderboard screen — fetches data, composes Podium + LeaderboardList
├── components/
│   ├── Podium.tsx          # Top 3 podium (1st/2nd/3rd blocks with crown, medals, avatars)
│   ├── LeaderboardList.tsx # FlatList of all participants (scrollEnabled=false, inside outer ScrollView)
│   └── LeaderboardRow.tsx  # Single row: rank · avatar · name + badge · trend · score
├── data/
│   └── leaderboard.ts      # Mock data + fetchLeaderboard(): Promise<Participant[]>
├── types/
│   └── index.ts            # Shared TypeScript types
└── constants/
    └── theme.ts            # Colors and spacing constants
```

---

## Data Model

```typescript
// types/index.ts

type Badge = 'Quiz Master' | 'Code Ninja' | 'Scholar' | 'Streak' | 'Hacker' | 'Rising Star';
type Trend = 'up' | 'down' | 'same';

interface Participant {
  id: string;
  name: string;
  avatarUrl: string;   // URL string; emoji string used as fallback in mock data
  score: number;
  badge: Badge;
  trend: Trend;
  trendDelta: number;  // number of spots moved (e.g. 2 = moved up 2 ranks)
}
```

`fetchLeaderboard()` returns `Promise<Participant[]>` sorted by score descending. To wire up the real API, replace only this function — no component changes needed.

---

## Components

### `app/index.tsx` — Leaderboard Screen
- Calls `fetchLeaderboard()` on mount via `useEffect`
- Holds `participants: Participant[]`, `loading: boolean`, `error: string | null` state
- Renders: loading spinner → error view → `ScrollView` containing `Podium` + `LeaderboardList`

### `components/Podium.tsx`
- Props: `top3: Participant[]` (first 3 items of participants array)
- Renders 2nd / 1st / 3rd in podium layout (1st is tallest/center)
- Shows: crown emoji above 1st, medal emoji on podium block, avatar circle, name, score

### `components/LeaderboardList.tsx`
- Props: `participants: Participant[]` (full array, all ranks)
- Renders a `FlatList` with `scrollEnabled={false}` (outer `ScrollView` handles scrolling)
- Section header: "ALL PARTICIPANTS" label above the list

### `components/LeaderboardRow.tsx`
- Props: `participant: Participant`, `rank: number`
- Rank number: gold for 1, silver for 2, bronze for 3, grey for rest
- Rank 1 row: gold left border + subtle gold background tint
- Trend: ↑ green for `up`, ↓ red for `down`, — grey for `same`; delta number shown alongside arrow
- Badge rendered as a small pill below the name

---

## Theme

```typescript
// constants/theme.ts
export const colors = {
  background: '#1a1a2e',
  card: '#16213e',
  row: '#2a2a4a',
  accent: '#6c63ff',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  trendUp: '#4CAF50',
  trendDown: '#F44336',
  trendSame: '#888888',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
};
```

---

## Loading & Error States

| State   | Behavior |
|---------|----------|
| Loading | Centered `ActivityIndicator` spinner on screen |
| Error   | Centered error message + "Retry" button that re-calls `fetchLeaderboard()` |
| Empty   | Centered "No participants yet" message |

---

## Out of Scope

- User authentication or profiles
- Filtering by category (quiz vs. coding challenge)
- Current user highlighting or pinning
- Push notifications or real-time updates
- Navigation to other screens
