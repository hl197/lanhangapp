import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getBookDetail, Book } from "../../api/books";
import { borrowBook } from "../../api/borrow";
import ArcCurve from "../../components/ArcCurve";
import { COLORS, CATEGORY_STYLES } from "../../utils/constants";
import { MOCK_BOOKS, MOCK_BOOKS_AVIATION } from "../../utils/mock-data";

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    getBookDetail(bookId)
      .then((res: any) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(() => {
        const allBooks = [...MOCK_BOOKS, ...MOCK_BOOKS_AVIATION];
        const found = allBooks.find((b) => b.id === bookId);
        setBook(found || null);
        setLoading(false);
      });
  }, [bookId]);

  const handleBorrow = async () => {
    if (!book || book.available <= 0) return;
    setBorrowing(true);
    try {
      await borrowBook(book.id);
      const res: any = await getBookDetail(bookId);
      setBook(res.data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBorrowing(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  if (!book)
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.error }}>图书不存在</Text>
      </View>
    );

  const cs =
    CATEGORY_STYLES[book.category || "其他"] || CATEGORY_STYLES["其他"];

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
        <Text style={styles.topBarTitle}>图书详情</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.coverSection}
        >
          <View style={styles.coverBlock}>
            <Text style={styles.coverChar}>{book.title.charAt(0)}</Text>
          </View>
          <Text style={styles.coverTitle}>{book.title}</Text>
          {book.author && <Text style={styles.coverAuthor}>{book.author}</Text>}
          <View style={styles.coverArc}>
            <ArcCurve />
          </View>
        </LinearGradient>

        <View style={styles.infoCard}>
          {book.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>索书号</Text>
              <Text style={styles.infoValueMono}>{book.location}</Text>
            </View>
          )}
          {book.publisher && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>出版信息</Text>
              <Text style={styles.infoValue}>{book.publisher}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>分类</Text>
            <View style={[styles.categoryTag, { backgroundColor: cs.bg }]}>
              <Text style={[styles.categoryText, { color: cs.primary }]}>
                {book.category || "未分类"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>状态</Text>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: book.available > 0 ? "#E8F0F8" : "#FEF3E4" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: book.available > 0 ? "#2D5A87" : "#B8780A" },
                ]}
              >
                {book.available > 0
                  ? `可借 ${book.available}/${book.total}`
                  : "已借出"}
              </Text>
            </View>
          </View>
          {book.isbn && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ISBN</Text>
              <Text style={styles.infoValueMono}>{book.isbn}</Text>
            </View>
          )}
        </View>

        {book.description && (
          <View style={styles.descCard}>
            <View style={styles.descHeader}>
              <View style={styles.descBar} />
              <Text style={styles.descTitle}>内容简介</Text>
            </View>
            <Text style={styles.descText}>{book.description}</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.borrowBtn,
            book.available <= 0 && styles.borrowBtnDisabled,
          ]}
          onPress={handleBorrow}
          disabled={borrowing || book.available <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.borrowBtnText}>
            {borrowing
              ? "借阅中..."
              : book.available > 0
                ? "借 阅"
                : "暂无余量"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.8}>
          <Text style={styles.reserveBtnText}>预 约</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    backgroundColor: "#1E3A5F",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 4 },
  topBarTitle: { color: "#FFF", fontSize: 17, fontWeight: "600" },
  scroll: { paddingBottom: 40 },
  coverSection: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  coverBlock: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  coverChar: {
    fontSize: 36,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  coverTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
  },
  coverAuthor: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
  },
  coverArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    margin: 16,
    marginTop: -8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F4F8",
  },
  infoLabel: { width: 70, fontSize: 12, color: "#6B7B8D" },
  infoValue: { fontSize: 13, color: "#1A2A3A", flex: 1 },
  infoValueMono: {
    fontSize: 12,
    color: "#1E3A5F",
    fontFamily: "monospace",
    fontWeight: "600",
    flex: 1,
  },
  categoryTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  categoryText: { fontSize: 11, fontWeight: "500" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "500" },
  descCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  descHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  descBar: {
    width: 4,
    height: 18,
    backgroundColor: "#3D7AB5",
    borderRadius: 2,
    marginRight: 10,
  },
  descTitle: { fontSize: 16, fontWeight: "700", color: "#1A2A3A" },
  descText: { fontSize: 13, color: "#6B7B8D", lineHeight: 22 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#FFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  borrowBtn: {
    flex: 2,
    backgroundColor: "#1E3A5F",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  borrowBtnDisabled: { backgroundColor: "#9CAAB8" },
  borrowBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
  },
  reserveBtn: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3D7AB5",
    paddingVertical: 14,
    alignItems: "center",
  },
  reserveBtnText: {
    color: "#3D7AB5",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
