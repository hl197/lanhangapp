import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { searchBooks, Book } from "../../api/books";
import BookCoverBlock from "../../components/BookCoverBlock";
import SectionBar from "../../components/SectionBar";
import QuickEntry from "../../components/QuickEntry";
import ArcCurve from "../../components/ArcCurve";
import { COLORS, CATEGORY_STYLES } from "../../utils/constants";
import { MOCK_BOOKS, MOCK_BOOKS_AVIATION } from "../../utils/mock-data";

const { width } = Dimensions.get("window");

const QUICK_ENTRIES = [
  { icon: "🧭", title: "馆藏检索", subtitle: "搜索全部资源", route: "Search" },
  {
    icon: "✈️",
    title: "航空特藏",
    subtitle: "航空专业文献",
    route: "Search",
    routeParams: { keyword: "航空" },
  },
  { icon: "📖", title: "我的借阅", subtitle: "本借阅中", route: "借阅" },
];

const CATEGORIES = [
  {
    icon: "✈️",
    name: "航空宇航",
    count: "45 册馆藏",
    bg: "#E8F0F8",
    searchKeyword: "航空",
  },
  {
    icon: "📜",
    name: "人文历史",
    count: "78 册馆藏",
    bg: "#FEF3E4",
    searchKeyword: "历史",
  },
  {
    icon: "🔬",
    name: "自然科学",
    count: "62 册馆藏",
    bg: "#E8F5E9",
    searchKeyword: "自然科学",
  },
  {
    icon: "🖋",
    name: "文学艺术",
    count: "93 册馆藏",
    bg: "#EEF2FF",
    searchKeyword: "文学",
  },
];

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);

    let mockFiltered = [...MOCK_BOOKS, ...MOCK_BOOKS_AVIATION];
    if (keyword)
      mockFiltered = mockFiltered.filter(
        (b) =>
          b.title.includes(keyword) ||
          b.author.includes(keyword) ||
          b.category.includes(keyword),
      );

    try {
      const res: any = await searchBooks({ keyword, page: 0, size: 20 });
      const apiResults = res.data.content || [];
      setBooks(apiResults.length > 0 ? apiResults : mockFiltered);
    } catch {
      setBooks(mockFiltered);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* 渐变导航栏 */}
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.header}
        >
          {/* 虚线圆环装饰 */}
          <View style={styles.rings}>
            <Svg height="200" width="200" style={styles.ringOuter}>
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
            <Svg height="130" width="130" style={styles.ringInner}>
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.englishTitle}>
              NANCHANG HANGKONG UNIVERSITY
            </Text>
            <Text style={styles.mainTitle}>蓝航图书馆</Text>
            <Text style={styles.motto}>日新自强 · 知行合一</Text>
          </View>

          {/* 底部弧线 */}
          <View style={styles.headerArc}>
            <ArcCurve />
          </View>
        </LinearGradient>

        {/* 搜索条（浮在弧线上） */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#9CAAB8" />
            <TextInput
              placeholder="搜索书名、作者或关键词"
              placeholderTextColor="#9CAAB8"
              style={styles.searchInput}
              value={keyword}
              onChangeText={setKeyword}
              returnKeyType="search"
              onSubmitEditing={() => navigation.navigate("Search", { keyword })}
            />
            {keyword ? (
              <TouchableOpacity onPress={() => setKeyword("")}>
                <Ionicons name="close-circle" size={16} color="#9CAAB8" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 快捷入口 */}
        <View style={styles.quickEntries}>
          {QUICK_ENTRIES.map((entry, i) => (
            <QuickEntry
              key={i}
              icon={entry.icon}
              title={entry.title}
              subtitle={entry.subtitle}
              onPress={() =>
                navigation.navigate(entry.route, entry.routeParams)
              }
            />
          ))}
        </View>

        {/* 热门借阅 */}
        <View style={styles.sectionWrapper}>
          <SectionBar title="热门借阅" linkText="查看全部 →" />
          {loading ? (
            <ActivityIndicator
              style={{ margin: 24 }}
              color={COLORS.primaryLight}
            />
          ) : (
            books.slice(0, 4).map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("BookDetail", { bookId: book.id })
                }
              >
                <BookCoverBlock title={book.title} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <View style={styles.bookBottom}>
                    <Text style={styles.isbn}>{book.isbn}</Text>
                    <View
                      style={[
                        styles.statusTag,
                        {
                          backgroundColor:
                            book.available > 0 ? "#E8F0F8" : "#FEF3E4",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: book.available > 0 ? "#2D5A87" : "#B8780A" },
                        ]}
                      >
                        {book.available > 0 ? "可借阅" : "已借出"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* 分类浏览 */}
        <View style={styles.sectionWrapper}>
          <SectionBar title="分类浏览" />
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.categoryCard, { backgroundColor: cat.bg }]}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("Search", {
                    keyword: cat.searchKeyword || cat.name,
                  })
                }
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
  },
  rings: { position: "absolute", top: 0, right: 0, width: 200, height: 200 },
  ringOuter: { position: "absolute", top: -60, right: -40 },
  ringInner: { position: "absolute", top: -20, right: 0 },
  headerContent: { position: "relative", zIndex: 1, paddingBottom: 40 },
  englishTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 2,
    marginBottom: 6,
  },
  motto: { fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: 3 },
  headerArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
  searchWrapper: {
    paddingHorizontal: 24,
    marginTop: -28,
    position: "relative",
    zIndex: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "rgba(26,51,80,0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#1A2A3A",
    paddingVertical: 0,
  },
  quickEntries: { flexDirection: "row", padding: 24, gap: 12 },
  sectionWrapper: { paddingHorizontal: 24, marginBottom: 20 },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bookInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 8 },
  bookBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  isbn: { fontSize: 10, color: "#9CAAB8", fontFamily: "monospace" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "500" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    width: (width - 68) / 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: { fontSize: 24, marginRight: 10 },
  categoryName: { fontSize: 13, fontWeight: "700", color: "#1A2A3A" },
  categoryCount: { fontSize: 10, color: "#6B7B8D", marginTop: 2 },
});
