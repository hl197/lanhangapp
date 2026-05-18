import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../utils/constants';

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    studentId: '',
    password: '',
    name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const { register, loading } = useAuthStore();

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (!form.studentId || !form.password || !form.name) {
      setError('请填写必要信息');
      return;
    }
    try {
      setError('');
      await register(form);
    } catch (e: any) {
      setError(e.message || '注册失败');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>注册新账号</Text>

          <TextInput
            label="学号 *"
            value={form.studentId}
            onChangeText={(v) => update('studentId', v)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="密码 *"
            value={form.password}
            onChangeText={(v) => update('password', v)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="姓名 *"
            value={form.name}
            onChangeText={(v) => update('name', v)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="手机号"
            value={form.phone}
            onChangeText={(v) => update('phone', v)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            注册
          </Button>

          <Button mode="text" onPress={() => navigation.goBack()}>
            已有账号？返回登录
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
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
