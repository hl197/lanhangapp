import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getBorrowHistory, BorrowRecord } from "../../api/borrow";
import BookCoverBlock from "../../components/BookCoverBlock";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

const statusMap: Record<string, { label: string; color: string }> = {
  returned: { label: "已归还", color: "#059669" },
  overdue: { label: "逾期", color: "#DC2626" },
  borrowed: { label: "借阅中", color: "#D97706" },
};

export default function BorrowHistoryScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res: any = await getBorrowHistory();
      setRecords(res.data?.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || "";

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

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
        <Text style={styles.topBarTitle}>借阅历史</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={records}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const st = statusMap[item.status] || {
            label: item.status,
            color: "#6B7B8D",
          };
          const title = getTitle(item);

          return (
            <View style={[styles.card, { borderLeftColor: st.color }]}>
              <BookCoverBlock title={title} size={{ width: 50, height: 66 }} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {title}
                </Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={11} color="#9CAAB8" />
                  <Text style={styles.dateText}>
                    借阅：{item.borrowDate?.substring(0, 10)}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={11} color="#9CAAB8" />
                  <Text style={styles.dateText}>
                    归还：{item.returnDate?.substring(0, 10) || "-"}
                  </Text>
                </View>
                <View
                  style={[styles.badge, { backgroundColor: st.color + "18" }]}
                >
                  <Text style={[styles.badgeText, { color: st.color }]}>
                    {st.label}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message="暂无借阅历史" />}
      />
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
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 6,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  dateText: { fontSize: 11, color: "#6B7B8D", marginLeft: 4 },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "500" },
});
