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
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true, speed: 200, bounciness: 0 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 200, bounciness: 0 }),
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
