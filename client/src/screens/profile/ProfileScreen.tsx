import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Divider, ActivityIndicator } from 'react-native-paper';
import { getProfile } from '../../api/user';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res: any = await getProfile();
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyMedium" style={styles.studentId}>
          {profile?.studentId}
        </Text>
      </View>

      <List.Section>
        <List.Item
          title="借阅证状态"
          left={(props) => <List.Icon {...props} icon="card-account-details" />}
          onPress={() => navigation.navigate('CardStatus')}
        />
        <Divider />
        <List.Item
          title="退出登录"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={logout}
          titleStyle={{ color: COLORS.error }}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.primary,
  },
  name: { color: '#FFFFFF', fontWeight: 'bold' as const },
  studentId: { color: '#FFFFFFCC', marginTop: 4 },
});
