import React, { useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return Promise.resolve();
};

export default function ChangePasswordScreen({ navigation }: any) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError("");
    if (!form.oldPassword || !form.newPassword) {
      setError("请填写完整信息");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("两次密码不一致");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("新密码至少 6 位");
      return;
    }
    try {
      await changePassword(form);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "修改失败");
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1a3350" />
        <Ionicons name="checkmark-circle" size={64} color="#059669" />
        <Text style={styles.successText}>密码修改成功</Text>
        <TouchableOpacity
          style={styles.successBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.successBtnText}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.topBarTitle}>修改密码</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.formCard}>
        <InputField
          icon="🔒"
          label="当前密码"
          value={form.oldPassword}
          onChange={(v) => update("oldPassword", v)}
          secure
        />
        <InputField
          icon="🔑"
          label="新密码"
          value={form.newPassword}
          onChange={(v) => update("newPassword", v)}
          secure
        />
        <InputField
          icon="✓"
          label="确认新密码"
          value={form.confirmPassword}
          onChange={(v) => update("confirmPassword", v)}
          secure
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1e3a5f", "#2d5a87"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtnGradient}
          >
            <Text style={styles.submitBtnText}>确 定</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InputField({
  icon,
  label,
  value,
  onChange,
  secure,
}: {
  icon: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  secure?: boolean;
}) {
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={fieldStyles.wrap}>
        <Text style={fieldStyles.icon}>{icon}</Text>
        <TextInput
          style={fieldStyles.input}
          placeholder={`请输入${label}`}
          placeholderTextColor="#9CAAB8"
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure}
        />
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#1A2A3A", marginBottom: 8 },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#F0F4F8",
  },
  icon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#1A2A3A", paddingVertical: 0 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  successContainer: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A2A3A",
    marginTop: 16,
  },
  successBtn: {
    marginTop: 24,
    backgroundColor: "#1E3A5F",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
  },
  successBtnText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A5F",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 4 },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    margin: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
  },
  submitBtn: { borderRadius: 24, overflow: "hidden", marginTop: 8 },
  submitBtnGradient: { paddingVertical: 14, alignItems: "center" },
  submitBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 4,
  },
});
