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
    1: { medal: '🥇', podiumHeight: 60, avatarSize: 54, nameColor: colors.gold,   podiumColor: colors.gold,        showCrown: true  },
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
