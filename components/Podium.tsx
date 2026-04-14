import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Participant } from '../types';
import { colors } from '../constants/theme';

interface Props {
  top3: Participant[];
}

interface PodiumSlotProps {
  participant: Participant;
  position: 1 | 2 | 3;
}

const POSITION_CONFIG = {
  1: { medal: '🥇', podiumHeight: 60, avatarSize: 54, nameColor: colors.gold,   podiumColor: colors.gold, showCrown: true  },
  2: { medal: '🥈', podiumHeight: 44, avatarSize: 46, nameColor: colors.silver, podiumColor: '#4a4e69',   showCrown: false },
  3: { medal: '🥉', podiumHeight: 32, avatarSize: 40, nameColor: colors.bronze, podiumColor: '#4a4e69',   showCrown: false },
} as const;

function PodiumSlot({ participant, position }: PodiumSlotProps) {
  const config = POSITION_CONFIG[position];
  return (
    <View style={styles.slot}>
      {config.showCrown && <Text style={styles.crown}>👑</Text>}
      <View style={[styles.avatar, { width: config.avatarSize, height: config.avatarSize, borderRadius: config.avatarSize / 2 }]}>
        <Text style={styles.avatarEmoji}>{participant.avatarUrl}</Text>
      </View>
      <Text style={[styles.name, { color: config.nameColor }]} numberOfLines={1}>{participant.name}</Text>
      <Text style={styles.score}>{participant.score}</Text>
      <View style={[styles.podiumBlock, { height: config.podiumHeight, backgroundColor: config.podiumColor }]}>
        <Text style={[styles.medal, { color: config.nameColor }]}>{config.medal}</Text>
      </View>
    </View>
  );
}

export default function Podium({ top3 }: Props) {
  if (top3.length < 3) return null;
  const [first, second, third] = top3;

  return (
    <View style={styles.podium}>
      <PodiumSlot participant={second} position={2} />
      <PodiumSlot participant={first} position={1} />
      <PodiumSlot participant={third} position={3} />
    </View>
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
    backgroundColor: colors.card,
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
    color: colors.textSecondary,
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
