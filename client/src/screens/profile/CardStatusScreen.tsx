import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getCardStatus } from "../../api/user";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../utils/constants";

const RULES = [
  "每人最多可同时借阅 5 本图书",
  "单次借阅期限为 30 天",
  "到期前可续借 1 次，续借期 30 天",
  "逾期将暂停借阅权限，请按时归还",
];

export default function CardStatusScreen({ navigation }: any) {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    getCardStatus()
      .then((res: any) => setCard(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  if (!card)
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.error }}>获取借阅证信息失败</Text>
      </View>
    );

  const name = user?.name || "用户";
  const initial = name.charAt(0);
  const maxBooks = card.maxBooks ?? 5;
  const borrowedBooks = card.borrowedBooks ?? 0;
  const remaining = maxBooks - borrowedBooks;

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
        <Text style={styles.topBarTitle}>借阅证</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        <LinearGradient
          colors={["#1a3350", "#1e3a5f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.schoolName}>南昌航空大学图书馆</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>借阅证</Text>
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.studentId}>
                {card.studentNo || card.cardNo || ""}
              </Text>
            </View>
          </View>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>有效期</Text>
              <Text style={styles.statValue}>
                {card.expireDate?.substring(0, 10) || "2026-12-31"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>可借 / 已借 / 剩余</Text>
              <Text style={styles.statValue}>
                <Text style={styles.statNum}>{maxBooks}</Text>
                {" / "}
                {borrowedBooks}
                {" / "}
                <Text style={styles.statNum}>{remaining}</Text>
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>借阅规则</Text>
          {RULES.map((rule, i) => (
            <View key={i} style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
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
  body: { padding: 20 },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  schoolName: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  cardBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardBadgeText: { fontSize: 10, fontWeight: "500", color: "#FFF" },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  userName: { fontSize: 18, fontWeight: "700", color: "#FFF", marginBottom: 4 },
  studentId: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  cardStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: 14,
  },
  statItem: { flex: 1 },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  statValue: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
  statNum: { fontWeight: "700", color: "#FFF" },
  rulesCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rulesTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2A3A",
    marginBottom: 14,
  },
  ruleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3D7AB5",
    marginTop: 7,
    marginRight: 10,
    flexShrink: 0,
  },
  ruleText: { fontSize: 13, color: "#6B7B8D", lineHeight: 20, flex: 1 },
});
