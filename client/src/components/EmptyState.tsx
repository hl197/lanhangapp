import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
}

export default function EmptyState({ icon = "book-outline", message }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#BDBDBD" />
      <Text variant="bodyLarge" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  text: {
    color: "#9E9E9E",
    marginTop: 12,
    textAlign: "center",
  },
});
