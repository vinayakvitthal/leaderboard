import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { fetchLeaderboard } from '../data/leaderboard';
import { Participant } from '../types';
import { colors } from '../constants/theme';
import Podium from '../components/Podium';
import LeaderboardList from '../components/LeaderboardList';

export default function LeaderboardScreen() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.container}>
        <Text style={styles.title}>🏆 LEADERBOARD</Text>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && participants.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No participants yet.</Text>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: 16,
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
    color: colors.trendDown,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
