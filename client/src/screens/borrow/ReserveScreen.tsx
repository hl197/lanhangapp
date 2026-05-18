import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BookCoverBlock from "../../components/BookCoverBlock";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";
import { MOCK_BOOKS } from "../../utils/mock-data";

const getReservations = () =>
  Promise.resolve(
    MOCK_BOOKS.slice(0, 3).map((book, i) => ({
      id: i + 1,
      book,
      reserveDate: "2026-05-15",
      status: i === 0 ? "active" : "expired",
      expireDate: "2026-05-30",
    })),
  );

const cancelReservation = (id: number) => Promise.resolve();

export default function ReserveScreen({ navigation }: any) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      getReservations()
        .then(setReservations)
        .finally(() => setLoading(false));
    }, []),
  );

  const confirmCancel = async () => {
    if (cancelTarget == null) return;
    await cancelReservation(cancelTarget);
    setReservations((prev) => prev.filter((r) => r.id !== cancelTarget));
    setCancelTarget(null);
  };

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
        <Text style={styles.topBarTitle}>我的预约</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={reservations}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isActive = item.status === "active";
          return (
            <View style={[styles.card, !isActive && styles.cardExpired]}>
              <BookCoverBlock title={item.book.title} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.book.title}
                </Text>
                <Text style={styles.cardAuthor}>{item.book.author}</Text>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>预约日期：</Text>
                  <Text style={styles.dateValue}>{item.reserveDate}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>到期日期：</Text>
                  <Text style={styles.dateValue}>{item.expireDate}</Text>
                </View>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isActive ? "#E8F0F8" : "#F0F4F8" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isActive ? "#2D5A87" : "#9CAAB8" },
                      ]}
                    >
                      {isActive ? "预约中" : "已过期"}
                    </Text>
                  </View>
                </View>
              </View>
              {isActive && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setCancelTarget(item.id)}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message="暂无预约记录" />}
      />

      <Modal
        visible={cancelTarget != null}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>取消预约</Text>
            <Text style={styles.modalMessage}>确定取消该预约吗？</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setCancelTarget(null)}
              >
                <Text style={styles.modalBtnCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnConfirm}
                onPress={confirmCancel}
              >
                <Text style={styles.modalBtnConfirmText}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  cardExpired: { opacity: 0.7 },
  cardBody: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  cardAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  dateRow: { flexDirection: "row", marginTop: 2 },
  dateLabel: { fontSize: 11, color: "#9CAAB8" },
  dateValue: { fontSize: 11, color: "#1A2A3A" },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  cancelText: { fontSize: 12, color: "#DC2626", fontWeight: "500" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 28,
    width: 280,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 8,
  },
  modalMessage: { fontSize: 14, color: "#6B7B8D", marginBottom: 24 },
  modalActions: { flexDirection: "row", gap: 12 },
  modalBtnCancel: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F0F4F8",
    alignItems: "center",
  },
  modalBtnCancelText: { fontSize: 14, color: "#6B7B8D", fontWeight: "500" },
  modalBtnConfirm: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1E3A5F",
    alignItems: "center",
  },
  modalBtnConfirmText: { fontSize: 14, color: "#FFF", fontWeight: "500" },
});
