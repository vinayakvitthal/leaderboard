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
