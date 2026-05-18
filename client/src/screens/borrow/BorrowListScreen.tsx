import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentBorrows, renewBook, returnBook, BorrowRecord } from '../../api/borrow';
import EmptyState from '../../components/EmptyState';
import { COLORS } from '../../utils/constants';

export default function BorrowListScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchBorrows();
    }, [])
  );

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res: any = await getCurrentBorrows();
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
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

  const getBookTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || '';

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        当前借阅
      </Text>
      <FlatList
        data={records}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{getBookTitle(item)}</Text>
              <Text variant="bodySmall">
                借阅：{item.borrowDate?.substring(0, 10)}
              </Text>
              <Text variant="bodySmall">
                应还：{item.dueDate?.substring(0, 10)}
              </Text>
              <View style={styles.chipRow}>
                {item.renewed && <Chip style={styles.chip}>已续借</Chip>}
              </View>
            </Card.Content>
            <Card.Actions>
              {!item.renewed && (
                <Button onPress={() => handleRenew(item.id)}>续借</Button>
              )}
              <Button onPress={() => handleReturn(item.id)}>归还</Button>
            </Card.Actions>
          </Card>
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<EmptyState message="暂无借阅记录" />}
      />
      <Button
        mode="text"
        onPress={() => navigation.navigate('BorrowHistory')}
        style={styles.historyBtn}
      >
        查看借阅历史
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, paddingBottom: 8 },
  card: { margin: 12, marginBottom: 0 },
  chipRow: { flexDirection: 'row', marginTop: 8 },
  chip: { alignSelf: 'flex-start' },
  historyBtn: { margin: 16 },
});
