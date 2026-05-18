import React, { useState, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getBorrowHistory, BorrowRecord } from '../../api/borrow';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

const statusMap: Record<string, { label: string; color: string }> = {
  returned: { label: '已归还', color: COLORS.success },
  overdue: { label: '逾期', color: COLORS.error },
  borrowed: { label: '借阅中', color: COLORS.warning },
};

export default function BorrowHistoryScreen() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
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

  const getBookTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || '';

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;

  return (
    <FlatList
      data={records}
      renderItem={({ item }) => {
        const st = statusMap[item.status] || { label: item.status, color: COLORS.textSecondary };
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{getBookTitle(item)}</Text>
              <Text variant="bodySmall">
                借阅：{item.borrowDate?.substring(0, 10)}
              </Text>
              <Text variant="bodySmall">
                归还：{item.returnDate?.substring(0, 10) || '-'}
              </Text>
              <Chip style={[styles.chip, { backgroundColor: st.color + '20' }]}>
                {st.label}
              </Chip>
            </Card.Content>
          </Card>
        );
      }}
      keyExtractor={(item) => String(item.id)}
      ListEmptyComponent={<EmptyState message="暂无借阅历史" />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  card: { margin: 12, marginBottom: 0 },
  chip: { alignSelf: 'flex-start', marginTop: 8 },
  list: { paddingBottom: 20 },
});
