import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { searchBooks, Book } from '../../api/books';
import BookCard from '../../components/BookCard';
import { BOOK_CATEGORIES, COLORS } from '../../utils/constants';

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const p = reset ? 0 : page;
      const res: any = await searchBooks({ keyword, category, page: p, size: 20 });
      const data = res.data;
      const content = data.content;
      if (reset) {
        setBooks(content);
        setPage(1);
      } else {
        setBooks((prev) => [...prev, ...content]);
        setPage(p + 1);
      }
      setHasMore(!data.last);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, page, loading]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    const timer = setTimeout(() => fetchBooks(true), 300);
    return () => clearTimeout(timer);
  }, [keyword, category]);

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetail', { bookId });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="搜索图书..."
        onChangeText={setKeyword}
        value={keyword}
        style={styles.searchBar}
      />
      <FlatList
        horizontal
        data={BOOK_CATEGORIES}
        renderItem={({ item }) => (
          <Chip
            selected={category === item}
            onPress={() => setCategory(category === item ? null : item)}
            style={styles.chip}
          >
            {item}
          </Chip>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
      />
      <FlatList
        data={books}
        renderItem={({ item }) => <BookCard book={item} onPress={handleBookPress} />}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.bookList}
        onEndReached={() => {
          if (hasMore && !loading) fetchBooks(false);
        }}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>暂无图书数据</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: { margin: 12, elevation: 2 },
  chipList: { maxHeight: 48, marginLeft: 12, marginBottom: 4 },
  chip: { marginRight: 8 },
  bookList: { paddingHorizontal: 4, paddingBottom: 20 },
  emptyText: {
    textAlign: 'center',
    color: '#9E9E9E',
    marginTop: 40,
    fontSize: 16,
  },
});
