# Animations & Theme Toggle — Design Spec

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

Add a light/dark theme toggle and entrance animations to the leaderboard app. The toggle is a moon/sun icon button in the top-right corner of the header. Animations are a staggered fade-up cascade on the leaderboard rows and podium on mount.

---

## Architecture

A new `contexts/ThemeContext.tsx` holds `isDark: boolean` and `toggleTheme: () => void`. It wraps the app in a `ThemeProvider`. All components read the active color set via a `useTheme()` hook — no theme props are passed down. `constants/theme.ts` exports both `darkColors` (existing `colors`) and a new `lightColors` palette.

---

## Theme Palettes

**Dark (existing — renamed `darkColors`):**
- background: `#1a1a2e`, card: `#16213e`, row: `#2a2a4a`, textPrimary: `#FFFFFF`, textSecondary: `#AAAAAA`

**Light (new — Cool Mist):**
- background: `#f0f4ff`, card: `#ffffff`, row: `#ffffff` (with `#e5eaf5` border), textPrimary: `#1a2340`, textSecondary: `#6b7280`
- Accent, gold, silver, bronze, trendUp/Down/Same: unchanged across both themes
- `StatusBar` style: `dark-content` in light mode, `light-content` in dark mode

---

## Toggle

- Placement: top-right corner of the header, absolutely positioned icon button (28×28, rounded)
- Icon: 🌙 in dark mode, ☀️ in light mode
- Press feedback: `spring` scale pulse (1 → 1.15 → 1, `useNativeDriver: true`)
- Theme preference is held in `useState` inside `ThemeContext` (in-memory only; no persistence)

---

## Animations

### LeaderboardRow — staggered fade-up
- Each row animates on mount using a single `Animated.Value` starting at `0`
- Drives: `opacity` (0 → 1) and `translateY` (16 → 0)
- Duration: `400ms`, easing: `Easing.out(Easing.quad)`
- Stagger delay: `Math.min(rank, 8) * 60ms` (caps at rank 8 to avoid long waits for large lists)
- Implemented with `Animated.timing` inside a `useEffect` on mount

### Podium — single fade-up
- All three slots animate together as one `Animated.View`
- Same opacity + translateY approach
- Delay: `100ms` (fires just after rows begin, so podium leads slightly)
- Duration: `500ms`

### Theme toggle press
- `Animated.spring` on a scale value: 1 → 1.15 → 1
- `useNativeDriver: true`

---

## Files Changed

| File | Change |
|------|--------|
| `constants/theme.ts` | Add `lightColors`; rename export `colors` → `darkColors`; keep `colors` as alias for backward compat |
| `contexts/ThemeContext.tsx` | New: `ThemeProvider`, `useTheme()` |
| `app/index.tsx` | Wrap in `ThemeProvider`; add icon toggle button; flip `StatusBar` style |
| `components/Podium.tsx` | Replace `colors.*` with `useTheme()`; add fade-up `Animated.View` |
| `components/LeaderboardList.tsx` | Replace `colors.*` with `useTheme()` |
| `components/LeaderboardRow.tsx` | Replace `colors.*` with `useTheme()`; add staggered fade-up animation |

---

## Out of Scope

- Persisting theme preference across app restarts
- System theme detection (`useColorScheme`)
- Animating rank changes (re-order transitions)
