import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';

export default function LoginScreen({ navigation }: any) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      setError('');
      await login({ studentId, password });
    } catch (e: any) {
      setError(e.message || '登录失败');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Surface style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>南昌航空大学</Text>
        <Text variant="titleMedium" style={styles.subtitle}>图书借阅系统</Text>

        <TextInput
          label="学号"
          value={studentId}
          onChangeText={setStudentId}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="密码"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          登录
        </Button>

        <Button mode="text" onPress={() => navigation.navigate('Register')}>
          没有账号？立即注册
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    marginBottom: 8,
    borderRadius: 8,
  },
});
