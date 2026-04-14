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
