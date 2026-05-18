import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { searchBooks, Book } from "../../api/books";
import BookCoverBlock from "../../components/BookCoverBlock";
import { COLORS, BOOK_CATEGORIES } from "../../utils/constants";
import { MOCK_BOOKS, MOCK_BOOKS_AVIATION } from "../../utils/mock-data";

export default function SearchScreen({ navigation, route }: any) {
  const [keyword, setKeyword] = useState(route?.params?.keyword || "");
  const [category, setCategory] = useState<string | undefined>(
    route?.params?.category || undefined,
  );
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!route?.params?.keyword);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    // Always search mock data as fallback
    let mockResults = [...MOCK_BOOKS, ...MOCK_BOOKS_AVIATION];
    if (keyword) {
      const kw = keyword;
      mockResults = mockResults.filter(
        (b) =>
          b.title.includes(kw) ||
          b.author.includes(kw) ||
          b.category.includes(kw),
      );
    }
    if (category)
      mockResults = mockResults.filter((b) => b.category === category);

    try {
      const res: any = await searchBooks({
        keyword,
        category,
        page: 0,
        size: 50,
      });
      const apiResults = res.data?.content || [];
      setResults(apiResults.length > 0 ? apiResults : mockResults);
    } catch {
      setResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route?.params?.keyword || route?.params?.category) {
      handleSearch();
    }
  }, []);

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
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={16} color="#9CAAB8" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索书名、作者"
            placeholderTextColor="#9CAAB8"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {keyword ? (
            <TouchableOpacity onPress={() => setKeyword("")}>
              <Ionicons name="close-circle" size={16} color="#9CAAB8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["全部", ...BOOK_CATEGORIES]}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const active = item === "全部" ? !category : category === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setCategory(item === "全部" ? undefined : item);
                }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={results}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() =>
              navigation.navigate("BookDetail", { bookId: item.id })
            }
          >
            <BookCoverBlock title={item.title} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.resultAuthor}>{item.author}</Text>
              <View style={styles.resultBottom}>
                <Text style={styles.resultIsbn}>{item.isbn}</Text>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor:
                        item.available > 0 ? "#E8F0F8" : "#FEF3E4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.available > 0 ? "#2D5A87" : "#B8780A" },
                    ]}
                  >
                    {item.available > 0 ? "可借阅" : "已借出"}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searched && !loading ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color="#9CAAB8" />
              <Text style={styles.emptyText}>未找到相关图书</Text>
            </View>
          ) : !searched ? (
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={48} color="#9CAAB8" />
              <Text style={styles.emptyText}>输入关键词搜索图书</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              style={{ margin: 24 }}
              color={COLORS.primaryLight}
            />
          ) : null
        }
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
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 0,
  },
  categoryRow: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  categoryList: { paddingHorizontal: 16 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#F0F4F8",
  },
  categoryChipActive: { backgroundColor: "#1E3A5F" },
  categoryChipText: { fontSize: 13, color: "#6B7B8D" },
  categoryChipTextActive: { color: "#FFF", fontWeight: "500" },
  list: { padding: 16 },
  resultCard: {
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
  resultInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  resultAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  resultBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultIsbn: { fontSize: 10, color: "#9CAAB8", fontFamily: "monospace" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "500" },
  empty: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#9CAAB8", fontSize: 14, marginTop: 12 },
});
