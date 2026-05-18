import React from 'react';
import { TouchableRipple, Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    available: number;
    total: number;
  };
  onPress: (id: number) => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableRipple onPress={() => onPress(book.id)}>
      <Card style={styles.card}>
        <Card.Cover
          source={{ uri: book.cover || 'https://via.placeholder.com/200x300?text=Book' }}
          style={styles.cover}
        />
        <Card.Content style={styles.content}>
          <Text variant="titleSmall" numberOfLines={2}>
            {book.title}
          </Text>
          <Text variant="bodySmall" style={styles.author}>
            {book.author}
          </Text>
          <Text
            variant="bodySmall"
            style={book.available > 0 ? styles.available : styles.unavailable}
          >
            {book.available > 0 ? `可借 ${book.available}/${book.total}` : '已借出'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  card: { margin: 8, width: 160 },
  cover: { height: 200 },
  content: { paddingVertical: 8 },
  author: { color: '#757575', marginTop: 4 },
  available: { color: '#388E3C', marginTop: 4 },
  unavailable: { color: '#D32F2F', marginTop: 4 },
});
