import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BookCoverBlockProps {
  title: string;
  size?: { width: number; height: number };
  colors?: readonly [string, string, ...string[]];
}

export default function BookCoverBlock({
  title,
  size = { width: 55, height: 74 },
  colors = ["#1E3A5F", "#3D7AB5"] as const,
}: BookCoverBlockProps) {
  const firstChar = title.replace(/[《》\s]/g, "").charAt(0) || "书";

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, { width: size.width, height: size.height }]}
    >
      <Text style={styles.char}>{firstChar}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  char: {
    fontSize: 22,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
});
