import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, CATEGORY_STYLES } from "../utils/constants";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover?: string;
    available: number;
    total: number;
    category?: string;
    location?: string;
  };
  onPress: (id: number) => void;
  style?: any;
}

export default function BookCard({ book, onPress, style }: BookCardProps) {
  const cs =
    CATEGORY_STYLES[book.category || "其他"] || CATEGORY_STYLES["其他"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(book.id)}
      style={[styles.card, style]}
    >
      {/* 左侧色条 */}
      <View style={[styles.bar, { backgroundColor: cs.primary }]} />

      {/* 封面区域 */}
      <View style={[styles.coverArea, { backgroundColor: cs.bg }]}>
        <Ionicons name="book" size={32} color={cs.primary} />
        <View
          style={[
            styles.badge,
            { backgroundColor: book.available > 0 ? "#2D5A87" : "#B8780A" },
          ]}
        >
          <Text style={styles.badgeText}>
            {book.available > 0 ? "可借" : "已借出"}
          </Text>
        </View>
      </View>

      {/* 信息 */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author || "未知"}
        </Text>
        <Text style={styles.available}>
          {book.available > 0
            ? `${book.available}/${book.total} 可借`
            : "暂无余量"}
        </Text>
        {book.location && (
          <Text style={styles.location} numberOfLines={1}>
            {book.location}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bar: { height: 4 },
  coverArea: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { color: "#FFF", fontSize: 10, fontWeight: "500" as const },
  content: { padding: 12, paddingTop: 10 },
  title: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: COLORS.text,
    lineHeight: 20,
  },
  author: {
    fontSize: 11,
    fontWeight: "300" as const,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 4,
  },
  available: { fontSize: 10, color: COLORS.textHint },
  location: {
    fontSize: 10,
    color: COLORS.textHint,
    marginTop: 2,
    fontFamily: "monospace" as const,
  },
});
