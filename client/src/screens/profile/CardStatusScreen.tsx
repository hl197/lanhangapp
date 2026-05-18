import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { getCardStatus } from '../../api/user';
import { COLORS } from '../../utils/constants';

const statusMap: Record<string, { label: string; color: string }> = {
  active: { label: '正常', color: COLORS.success },
  frozen: { label: '冻结', color: COLORS.warning },
  lost: { label: '挂失', color: COLORS.error },
};

export default function CardStatusScreen() {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const res: any = await getCardStatus();
      setCard(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;
  if (!card) return <Text style={styles.error}>获取借阅证信息失败</Text>;

  const st = statusMap[card.status] || { label: card.status, color: COLORS.textSecondary };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.label}>借阅证号</Text>
          <Text variant="headlineSmall" style={styles.cardNo}>
            {card.cardNo}
          </Text>
          <Chip style={[styles.chip, { backgroundColor: st.color + '20' }]}>
            {st.label}
          </Chip>
          <Text variant="bodySmall" style={styles.date}>
            办证时间：{card.createdAt?.substring(0, 10)}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  card: { padding: 16, borderRadius: 12 },
  label: { color: COLORS.textSecondary, marginBottom: 8 },
  cardNo: {
    color: COLORS.primary,
    fontWeight: 'bold' as const,
    marginBottom: 12,
  },
  chip: { alignSelf: 'flex-start', marginBottom: 12 },
  date: { color: COLORS.textSecondary },
  error: { textAlign: 'center', marginTop: 40, color: COLORS.error },
});
