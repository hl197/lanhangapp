import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  iconBg?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  iconBg = "#E8F0F8",
}: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
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
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 18 },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A2A3A",
  },
  label: {
    fontSize: 11,
    color: "#9CAAB8",
    marginTop: 2,
  },
});
