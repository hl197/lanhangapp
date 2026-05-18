import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import {
  getCurrentBorrows,
  renewBook,
  returnBook,
  BorrowRecord,
} from "../../api/borrow";
import BookCoverBlock from "../../components/BookCoverBlock";
import StatCard from "../../components/StatCard";
import SectionBar from "../../components/SectionBar";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";
import { MOCK_BORROW_RECORDS } from "../../utils/mock-data";

export default function BorrowListScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchBorrows();
    }, []),
  );

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res: any = await getCurrentBorrows();
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
      setRecords(MOCK_BORROW_RECORDS as any);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id: number) => {
    try {
      await renewBook(id);
      fetchBorrows();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      await returnBook(id);
      fetchBorrows();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const getTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || "";
  const getAuthor = (item: BorrowRecord) => item.book?.author || "";
  const now = new Date();
  const overdueCount = records.filter((r) => r.status === "overdue").length;
  const dueSoonCount = records.filter((r) => {
    if (!r.dueDate || r.status === "returned") return false;
    const days =
      (new Date(r.dueDate).getTime() - now.getTime()) / (1000 * 86400);
    return days >= 0 && days <= 7;
  }).length;

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />

      <FlatList
        data={records}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const overdue = item.status === "overdue";
          const title = getTitle(item);
          const author = getAuthor(item);
          const borrowDate = item.borrowDate?.substring(0, 10) || "";
          const dueDate = item.dueDate?.substring(0, 10) || "";

          let daysLeft: string;
          let daysColor: string;
          if (overdue) {
            daysLeft = "已逾期";
            daysColor = "#D32F2F";
          } else if (item.dueDate) {
            const days = Math.ceil(
              (new Date(item.dueDate).getTime() - now.getTime()) /
                (1000 * 86400),
            );
            daysLeft = `${days} 天`;
            daysColor = days <= 7 ? "#D32F2F" : "#2E7D32";
          } else {
            daysLeft = "-";
            daysColor = "#6B7B8D";
          }

          return (
            <View style={[styles.borrowCard, overdue && styles.overdueCard]}>
              <View style={styles.cardTop}>
                <BookCoverBlock title={title} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={styles.cardAuthor}>{author || "未知作者"}</Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>借阅</Text>
                  </View>
                </View>
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>借阅日期</Text>
                  <Text style={styles.dateValue}>{borrowDate}</Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>应还日期</Text>
                  <Text
                    style={[styles.dateValue, overdue && { color: "#D32F2F" }]}
                  >
                    {dueDate}
                  </Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>剩余天数</Text>
                  <Text style={[styles.dateValue, { color: daysColor }]}>
                    {daysLeft}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                {item.status === "borrowed" && (
                  <TouchableOpacity
                    style={styles.returnBtn}
                    onPress={() => handleReturn(item.id)}
                  >
                    <Text style={styles.returnText}>归还</Text>
                  </TouchableOpacity>
                )}
                {!item.renewed && !overdue && (
                  <TouchableOpacity
                    style={styles.renewBtn}
                    onPress={() => handleRenew(item.id)}
                  >
                    <Text style={styles.renewText}>续借</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <>
            <View style={styles.welcomeBar}>
              <View>
                <Text style={styles.welcomeTitle}>欢迎回来</Text>
                <Text style={styles.welcomeSub}>
                  您当前有{" "}
                  <Text style={styles.welcomeHighlight}>{records.length}</Text>{" "}
                  本书在借
                </Text>
              </View>
              <View style={styles.welcomeCircle}>
                <Text style={styles.welcomeNum}>{records.length}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <StatCard
                icon="📖"
                value={records.length}
                label="在借数量"
                iconBg="#E8F0F8"
              />
              <StatCard
                icon="⏰"
                value={dueSoonCount}
                label="即将到期"
                iconBg="#FEF3E4"
              />
              <StatCard
                icon="📋"
                value={records.filter((r) => r.status === "returned").length}
                label="历史借阅"
                iconBg="#EEF2FF"
              />
            </View>

            <View style={styles.sectionHeader}>
              <SectionBar title="当前借阅" />
            </View>
          </>
        }
        ListEmptyComponent={<EmptyState message="暂无借阅记录" />}
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
  list: { padding: 16, paddingTop: 16 },
  welcomeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  welcomeTitle: { fontSize: 16, fontWeight: "700", color: "#1A2A3A" },
  welcomeSub: { fontSize: 13, color: "#6B7B8D", marginTop: 4 },
  welcomeHighlight: { color: "#1E3A5F", fontWeight: "700" },
  welcomeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F0F8",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeNum: { fontSize: 20, fontWeight: "700", color: "#1E3A5F" },
  statsRow: { flexDirection: "row", marginBottom: 24, gap: 10 },
  sectionHeader: { marginBottom: 12 },
  borrowCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  overdueCard: { borderLeftWidth: 3, borderLeftColor: "#D32F2F" },
  cardTop: { flexDirection: "row", marginBottom: 14 },
  cardInfo: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  cardAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F0F8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: { fontSize: 10, fontWeight: "500", color: "#2D5A87" },
  dateRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4F8",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
    marginBottom: 12,
  },
  dateItem: { flex: 1 },
  dateLabel: { fontSize: 11, color: "#9CAAB8", marginBottom: 4 },
  dateValue: { fontSize: 13, color: "#1A2A3A", fontWeight: "500" },
  cardActions: { flexDirection: "row", justifyContent: "flex-end" },
  renewBtn: {
    borderWidth: 1,
    borderColor: "#3D7AB5",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  renewText: { fontSize: 13, fontWeight: "500", color: "#3D7AB5" },
  returnBtn: {
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  returnText: { fontSize: 13, fontWeight: "500", color: "#DC2626" },
});
