# Animations & Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a staggered fade-up entrance animation to leaderboard rows and podium, plus a moon/sun icon toggle in the top-right corner that switches between dark and light (Cool Mist) themes.

**Architecture:** A `ThemeContext` holds `isDark` state and exposes `toggleTheme` + the active color set via `useTheme()`. All components read theme colors from context instead of importing `colors` directly. Row animations are driven by React Native's built-in `Animated` API on mount with stagger delays based on rank.

**Tech Stack:** React Native `Animated` API, React Context, TypeScript, Expo (jest-expo for tests)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `constants/theme.ts` | Modify | Add `lightColors` + `podiumBlock` token; export `darkColors` alias |
| `contexts/ThemeContext.tsx` | Create | `ThemeProvider`, `useTheme()` hook |
| `contexts/__tests__/ThemeContext.test.tsx` | Create | Unit tests for toggle logic |
| `jest.config.js` | Create | Jest preset config |
| `package.json` | Modify | Add `test` script + `jest-expo` dev dep |
| `app/index.tsx` | Modify | Wrap in `ThemeProvider`; add icon toggle with spring pulse |
| `components/LeaderboardRow.tsx` | Modify | `useTheme()` + staggered fade-up animation |
| `components/Podium.tsx` | Modify | `useTheme()` + single fade-up animation |
| `components/LeaderboardList.tsx` | Modify | `useTheme()` |

---

### Task 1: Extend theme constants

**Files:**
- Modify: `constants/theme.ts`

- [ ] **Step 1: Replace contents of `constants/theme.ts`**

```typescript
export const darkColors = {
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
  podiumBlock: '#4a4e69',
};

export const lightColors = {
  background: '#f0f4ff',
  card: '#ffffff',
  row: '#ffffff',
  accent: '#6c63ff',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  trendUp: '#4CAF50',
  trendDown: '#F44336',
  trendSame: '#888888',
  textPrimary: '#1a2340',
  textSecondary: '#6b7280',
  podiumBlock: '#c5cde8',
};

// Backward-compatible alias — existing imports of `colors` still work
export const colors = darkColors;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/vinayak/kact/leaderboard && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add constants/theme.ts
git commit -m "feat: add lightColors and podiumBlock token to theme"
```

---

### Task 2: Set up test infrastructure

**Files:**
- Create: `jest.config.js`
- Modify: `package.json`

- [ ] **Step 1: Install test dependencies**

```bash
cd /home/vinayak/kact/leaderboard && npx expo install jest-expo @testing-library/react-native && npm install --save-dev @types/jest
```
Expected: packages installed, no peer-dep errors

- [ ] **Step 2: Create `jest.config.js`**

```javascript
module.exports = {
  preset: 'jest-expo',
};
```

- [ ] **Step 3: Add `test` script to `package.json`**

Open `package.json` and add `"test": "jest"` to the `"scripts"` section:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "test": "jest"
},
```

- [ ] **Step 4: Verify jest runs (no tests yet)**

```bash
cd /home/vinayak/kact/leaderboard && npm test -- --passWithNoTests
```
Expected: `Test Suites: 0 skipped` or similar, exit 0

- [ ] **Step 5: Commit**

```bash
git add jest.config.js package.json package-lock.json
git commit -m "chore: add jest-expo and testing-library test setup"
```

---

### Task 3: ThemeContext — test then implement

**Files:**
- Create: `contexts/ThemeContext.tsx`
- Create: `contexts/__tests__/ThemeContext.test.tsx`

- [ ] **Step 1: Create `contexts/` directory and write the failing test**

```bash
mkdir -p /home/vinayak/kact/leaderboard/contexts/__tests__
```

Create `contexts/__tests__/ThemeContext.test.tsx`:

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';

function Probe() {
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <>
      <Text testID="mode">{isDark ? 'dark' : 'light'}</Text>
      <Text testID="bg">{colors.background}</Text>
      <TouchableOpacity testID="toggle" onPress={toggleTheme} />
    </>
  );
}

describe('ThemeContext', () => {
  it('defaults to dark mode', () => {
    const { getByTestId } = render(
      <ThemeProvider><Probe /></ThemeProvider>
    );
    expect(getByTestId('mode').props.children).toBe('dark');
    expect(getByTestId('bg').props.children).toBe('#1a1a2e');
  });

  it('toggles to light mode on first press', () => {
    const { getByTestId } = render(
      <ThemeProvider><Probe /></ThemeProvider>
    );
    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('mode').props.children).toBe('light');
    expect(getByTestId('bg').props.children).toBe('#f0f4ff');
  });

  it('toggles back to dark mode on second press', () => {
    const { getByTestId } = render(
      <ThemeProvider><Probe /></ThemeProvider>
    );
    fireEvent.press(getByTestId('toggle'));
    fireEvent.press(getByTestId('toggle'));
    expect(getByTestId('mode').props.children).toBe('dark');
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTheme must be used within ThemeProvider');
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /home/vinayak/kact/leaderboard && npm test -- contexts/__tests__/ThemeContext.test.tsx
```
Expected: FAIL — `Cannot find module '../ThemeContext'`

- [ ] **Step 3: Create `contexts/ThemeContext.tsx`**

```typescript
import React, { createContext, useContext, useState } from 'react';
import { darkColors, lightColors } from '../constants/theme';

type Colors = typeof darkColors;

interface ThemeContextValue {
  colors: Colors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ colors: isDark ? darkColors : lightColors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd /home/vinayak/kact/leaderboard && npm test -- contexts/__tests__/ThemeContext.test.tsx
```
Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add contexts/ThemeContext.tsx contexts/__tests__/ThemeContext.test.tsx
git commit -m "feat: add ThemeContext with dark/light toggle"
```

---

### Task 4: Update `app/index.tsx` — ThemeProvider + toggle button

**Files:**
- Modify: `app/index.tsx`

- [ ] **Step 1: Replace `app/index.tsx` with the following**

```typescript
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { fetchLeaderboard } from '../data/leaderboard';
import { Participant } from '../types';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import Podium from '../components/Podium';
import LeaderboardList from '../components/LeaderboardList';

function LeaderboardScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboard();
      setParticipants(data);
    } catch (e) {
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        useNativeDriver: true,
        speed: 200,
        bounciness: 0,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 200,
        bounciness: 0,
      }),
    ]).start();
    toggleTheme();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>🏆 LEADERBOARD</Text>
          <Animated.View style={[styles.toggleWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={[styles.toggleBtn, { backgroundColor: colors.card }]}
              onPress={handleToggle}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: colors.trendDown }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.accent }]}
              onPress={load}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && participants.length === 0 && (
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No participants yet.</Text>
          </View>
        )}

        {!loading && !error && participants.length > 0 && (
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Podium top3={participants.slice(0, 3)} />
            <LeaderboardList participants={participants} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function LeaderboardScreenWithProvider() {
  return (
    <ThemeProvider>
      <LeaderboardScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    flex: 1,
  },
  toggleWrapper: {
    position: 'absolute',
    right: 0,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIcon: {
    fontSize: 16,
  },
  scroll: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/vinayak/kact/leaderboard && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/index.tsx
git commit -m "feat: add ThemeProvider wrap and moon/sun toggle button to header"
```

---

### Task 5: Update `LeaderboardRow` — useTheme + staggered fade-up

**Files:**
- Modify: `components/LeaderboardRow.tsx`

- [ ] **Step 1: Replace `components/LeaderboardRow.tsx` with the following**

```typescript
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Participant } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  participant: Participant;
  rank: number;
}

export default function LeaderboardRow({ participant, rank }: Props) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(16)).current;
  const isFirst = rank === 1;

  useEffect(() => {
    const delay = Math.min(rank, 8) * 60;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 400,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function rankColor(r: number): string {
    if (r === 1) return colors.gold;
    if (r === 2) return colors.silver;
    if (r === 3) return colors.bronze;
    return colors.textSecondary;
  }

  function trendLabel(trend: Participant['trend'], delta: number): string {
    if (trend === 'up') return `↑${delta}`;
    if (trend === 'down') return `↓${delta}`;
    return '—';
  }

  function trendColor(trend: Participant['trend']): string {
    if (trend === 'up') return colors.trendUp;
    if (trend === 'down') return colors.trendDown;
    return colors.trendSame;
  }

  return (
    <Animated.View
      style={[
        styles.row,
        { backgroundColor: colors.row },
        isFirst && [styles.rowFirst, { borderLeftColor: colors.gold }],
        { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
      ]}
    >
      <Text style={[styles.rank, { color: rankColor(rank) }]}>{rank}</Text>

      <View style={[styles.avatar, { backgroundColor: colors.card }]}>
        <Text style={styles.avatarEmoji}>{participant.avatarUrl}</Text>
      </View>

      <View style={styles.nameContainer}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{participant.name}</Text>
        <View style={[styles.badgePill, { backgroundColor: colors.card }]}>
          <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{participant.badge}</Text>
        </View>
      </View>

      <Text style={[styles.trend, { color: trendColor(participant.trend) }]}>
        {trendLabel(participant.trend, participant.trendDelta)}
      </Text>

      <Text style={[styles.score, { color: isFirst ? colors.gold : colors.accent }]}>
        {participant.score}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    gap: 8,
  },
  rowFirst: {
    backgroundColor: '#FFD70015',
    borderLeftWidth: 3,
  },
  rank: {
    width: 20,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgePill: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  badgeText: {
    fontSize: 9,
  },
  trend: {
    fontSize: 11,
    fontWeight: '600',
    width: 28,
    textAlign: 'right',
  },
  score: {
    fontSize: 13,
    fontWeight: '800',
    width: 36,
    textAlign: 'right',
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/vinayak/kact/leaderboard && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/LeaderboardRow.tsx
git commit -m "feat: add staggered fade-up animation and theme support to LeaderboardRow"
```

---

### Task 6: Update `Podium` — useTheme + fade-up animation

**Files:**
- Modify: `components/Podium.tsx`

- [ ] **Step 1: Replace `components/Podium.tsx` with the following**

```typescript
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Participant } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  top3: Participant[];
}

interface PodiumSlotProps {
  participant: Participant;
  position: 1 | 2 | 3;
}

function PodiumSlot({ participant, position }: PodiumSlotProps) {
  const { colors } = useTheme();

  const config = {
    1: { medal: '🥇', podiumHeight: 60, avatarSize: 54, nameColor: colors.gold,   podiumColor: colors.gold,       showCrown: true  },
    2: { medal: '🥈', podiumHeight: 44, avatarSize: 46, nameColor: colors.silver, podiumColor: colors.podiumBlock, showCrown: false },
    3: { medal: '🥉', podiumHeight: 32, avatarSize: 40, nameColor: colors.bronze, podiumColor: colors.podiumBlock, showCrown: false },
  }[position];

  return (
    <View style={styles.slot}>
      {config.showCrown && <Text style={styles.crown}>👑</Text>}
      <View style={[
        styles.avatar,
        { width: config.avatarSize, height: config.avatarSize, borderRadius: config.avatarSize / 2, backgroundColor: colors.card },
      ]}>
        <Text style={styles.avatarEmoji}>{participant.avatarUrl}</Text>
      </View>
      <Text style={[styles.name, { color: config.nameColor }]} numberOfLines={1}>{participant.name}</Text>
      <Text style={[styles.score, { color: colors.textSecondary }]}>{participant.score}</Text>
      <View style={[styles.podiumBlock, { height: config.podiumHeight, backgroundColor: config.podiumColor }]}>
        <Text style={[styles.medal, { color: config.nameColor }]}>{config.medal}</Text>
      </View>
    </View>
  );
}

export default function Podium({ top3 }: Props) {
  if (top3.length < 3) return null;
  const [first, second, third] = top3;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        delay: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.podium,
        { opacity: fadeAnim, transform: [{ translateY: translateAnim }] },
      ]}
    >
      <PodiumSlot participant={second} position={2} />
      <PodiumSlot participant={first} position={1} />
      <PodiumSlot participant={third} position={3} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  slot: {
    alignItems: 'center',
    width: 90,
  },
  crown: {
    fontSize: 16,
    marginBottom: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  score: {
    fontSize: 10,
    marginBottom: 4,
  },
  podiumBlock: {
    width: 70,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medal: {
    fontSize: 18,
    fontWeight: '900',
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/vinayak/kact/leaderboard && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/Podium.tsx
git commit -m "feat: add fade-up animation and theme support to Podium"
```

---

### Task 7: Update `LeaderboardList` — useTheme

**Files:**
- Modify: `components/LeaderboardList.tsx`

- [ ] **Step 1: Replace `components/LeaderboardList.tsx` with the following**

```typescript
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Participant } from '../types';
import LeaderboardRow from './LeaderboardRow';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  participants: Participant[];
}

export default function LeaderboardList({ participants }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.header, { color: colors.textSecondary }]}>ALL PARTICIPANTS</Text>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <LeaderboardRow participant={item} rank={index + 1} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
  },
  header: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles and all tests pass**

```bash
cd /home/vinayak/kact/leaderboard && npx tsc --noEmit && npm test
```
Expected: no TS errors, 4 tests PASS

- [ ] **Step 3: Commit**

```bash
git add components/LeaderboardList.tsx
git commit -m "feat: apply theme colors to LeaderboardList"
```

---

## Done

Run the app to verify:
```bash
cd /home/vinayak/kact/leaderboard && npx expo start
```

Check:
- Rows and podium animate in on load (fade up, staggered)
- Moon/sun button in top-right corner
- Tapping it toggles between dark and Cool Mist light theme
- Button pulses on tap
- `StatusBar` style matches theme
