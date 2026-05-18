import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { getBookDetail, Book } from '../../api/books';
import { borrowBook } from '../../api/borrow';
import { COLORS } from '../../utils/constants';

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    getBookDetail(bookId).then((res: any) => {
      setBook(res.data);
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

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;
  if (!book) return <Text style={styles.errorText}>图书不存在</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {book.title}
      </Text>
      <Text variant="bodyLarge" style={styles.author}>
        {book.author}
      </Text>
      {book.publisher && (
        <Text variant="bodyMedium" style={styles.meta}>
          {book.publisher}
        </Text>
      )}
      {book.isbn && (
        <Text variant="bodySmall" style={styles.meta}>
          ISBN: {book.isbn}
        </Text>
      )}

      <Divider style={{ marginVertical: 16 }} />

      <View style={styles.infoRow}>
        <Chip icon="book" style={styles.chip}>
          {book.category}
        </Chip>
        <Text style={book.available > 0 ? styles.available : styles.unavailable}>
          可借 {book.available}/{book.total}
        </Text>
      </View>

      {book.location && (
        <Text variant="bodySmall" style={styles.meta}>
          馆藏位置：{book.location}
        </Text>
      )}

      {book.description && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>简介</Text>
          <Text variant="bodyMedium" style={styles.desc}>
            {book.description}
          </Text>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleBorrow}
        loading={borrowing}
        disabled={book.available <= 0}
        style={styles.borrowBtn}
        contentStyle={{ paddingVertical: 8 }}
      >
        {book.available > 0 ? '借阅此书' : '暂无余量'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { color: COLORS.text, fontWeight: 'bold' as const },
  author: { color: COLORS.textSecondary, marginTop: 8 },
  meta: { color: COLORS.textSecondary, marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  chip: { marginRight: 12 },
  available: { color: COLORS.success, fontWeight: 'bold' as const },
  unavailable: { color: COLORS.error, fontWeight: 'bold' as const },
  sectionTitle: { color: COLORS.text, marginTop: 16, marginBottom: 8 },
  desc: { color: COLORS.textSecondary, lineHeight: 22 },
  borrowBtn: { marginTop: 24, borderRadius: 8 },
  errorText: { textAlign: 'center', marginTop: 40, color: COLORS.error },
});
