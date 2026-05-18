import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  badge?: number;
  onPress: () => void;
}

interface MenuListProps {
  items: MenuItem[];
}

export default function MenuList({ items }: MenuListProps) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.item, index < items.length - 1 && styles.itemBorder]}
          onPress={item.onPress}
          activeOpacity={0.6}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <Ionicons name="chevron-forward" size={16} color="#9CAAB8" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: "#1A2A3A",
    marginLeft: 12,
  },
  badge: {
    backgroundColor: "#DC2626",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
