import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Participant } from '../types';
import LeaderboardRow from './LeaderboardRow';
import { colors } from '../constants/theme';

interface Props {
  participants: Participant[];
}

export default function LeaderboardList({ participants }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>ALL PARTICIPANTS</Text>
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
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 10,
  },
  header: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});
