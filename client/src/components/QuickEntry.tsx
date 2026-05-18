import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface QuickEntryProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  iconBg?: string[];
}

export default function QuickEntry({
  icon,
  title,
  subtitle,
  onPress,
  iconBg = ["#E8F0F8", "#DCE4F0"],
}: QuickEntryProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg[0] }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "rgba(26,51,80,0.04)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 18 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#9CAAB8",
  },
});
