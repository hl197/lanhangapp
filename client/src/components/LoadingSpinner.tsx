import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS } from '../utils/constants';

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 12,
    color: COLORS.textSecondary,
  },
});
