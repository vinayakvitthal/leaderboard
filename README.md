# Leaderboard

A React Native (Expo) leaderboard app for education contexts — classroom quiz scores and coding challenge participants. Features a dark-themed UI with a visual podium for the top 3 and a scrollable list of all participants.

## Features

- Visual podium highlighting 1st, 2nd, and 3rd place
- Scrollable list of all participants with rank, badge, and trend indicators
- Trend arrows showing rank movement (up/down/same) with delta count
- Badge pills (Quiz Master, Code Ninja, Scholar, Streak, Hacker, Rising Star)
- Loading, error, and empty states
- Mock data layer with a single function to swap in a real API
- Runs on Android, iOS, and Web

## Project Structure

```
leaderboard/
├── app/
│   └── index.tsx           # Leaderboard screen
├── components/
│   ├── Podium.tsx          # Top 3 podium with crown, medals, avatars
│   ├── LeaderboardList.tsx # Full participant list
│   └── LeaderboardRow.tsx  # Single row: rank · avatar · name + badge · trend · score
├── data/
│   └── leaderboard.ts      # Mock data + fetchLeaderboard()
├── types/
│   └── index.ts            # Shared TypeScript types
└── constants/
    └── theme.ts            # Colors and spacing
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Install

```bash
npm install
```

### Run

```bash
# Start the dev server (opens Expo Go QR code)
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in browser
npm run web
```

## Wiring Up a Real API

All data fetching is isolated in `data/leaderboard.ts`. Replace the `fetchLeaderboard()` function with your API call — no component changes needed:

```ts
export async function fetchLeaderboard(): Promise<Participant[]> {
  const response = await fetch('https://your-api.example.com/leaderboard');
  return response.json();
}
```

## Tech Stack

| Tool | Version |
|------|---------|
| Expo | ~54.0 |
| React Native | 0.81 |
| Expo Router | ~6.0 |
| TypeScript | ~5.9 |
| React | 19.1 |
