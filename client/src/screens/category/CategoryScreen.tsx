import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  BOOK_CATEGORIES,
  CATEGORY_STYLES,
} from "../../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const CATEGORY_ICONS: Record<string, string> = {
  计算机科学: "💻",
  文学: "📖",
  历史: "📜",
  经济管理: "📊",
  自然科学: "🔬",
  哲学: "🧠",
  艺术: "🎨",
  教育: "📚",
  语言: "🌐",
  医学: "🏥",
  工程技术: "⚙️",
  其他: "📁",
};

export default function CategoryScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>分类浏览</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={BOOK_CATEGORIES}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const cs = CATEGORY_STYLES[item] || CATEGORY_STYLES["其他"];
          const icon = CATEGORY_ICONS[item] || "📁";
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: cs.bg }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Search", { category: item })}
            >
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.name}>{item}</Text>
              <Text style={styles.count}>{cs.primary}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 4 },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
  list: { padding: 16, paddingBottom: 32 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: { fontSize: 32, marginBottom: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#1A2A3A", marginBottom: 4 },
  count: { fontSize: 11, color: "#6B7B8D" },
});
