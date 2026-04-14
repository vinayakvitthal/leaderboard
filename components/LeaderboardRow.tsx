import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Participant } from '../types';
import { colors } from '../constants/theme';

interface Props {
  participant: Participant;
  rank: number;
}

function rankColor(rank: number): string {
  if (rank === 1) return colors.gold;
  if (rank === 2) return colors.silver;
  if (rank === 3) return colors.bronze;
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

export default function LeaderboardRow({ participant, rank }: Props) {
  const isFirst = rank === 1;

  return (
    <View style={[styles.row, isFirst && styles.rowFirst]}>
      <Text style={[styles.rank, { color: rankColor(rank) }]}>{rank}</Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>{participant.avatarUrl}</Text>
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name}>{participant.name}</Text>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{participant.badge}</Text>
        </View>
      </View>

      <Text style={[styles.trend, { color: trendColor(participant.trend) }]}>
        {trendLabel(participant.trend, participant.trendDelta)}
      </Text>

      <Text style={[styles.score, { color: isFirst ? colors.gold : colors.accent }]}>
        {participant.score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.row,
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    gap: 8,
  },
  rowFirst: {
    backgroundColor: '#FFD70015',
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
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
    backgroundColor: colors.card,
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
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  badgePill: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  badgeText: {
    color: colors.textSecondary,
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
