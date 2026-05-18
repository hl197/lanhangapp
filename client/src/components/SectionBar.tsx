import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SectionBarProps {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
}

export default function SectionBar({
  title,
  linkText,
  onLinkPress,
}: SectionBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
      <Text style={styles.title}>{title}</Text>
      {linkText && onLinkPress && (
        <TouchableOpacity onPress={onLinkPress}>
          <Text style={styles.link}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bar: {
    width: 4,
    height: 18,
    backgroundColor: "#3D7AB5",
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2A3A",
    flex: 1,
  },
  link: {
    fontSize: 12,
    color: "#3D7AB5",
  },
});
