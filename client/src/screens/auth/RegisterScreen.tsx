import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useAuthStore } from "../../store/authStore";
import ArcCurve from "../../components/ArcCurve";
import { COLORS } from "../../utils/constants";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    studentId: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuthStore();
  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleRegister = async () => {
    if (!form.studentId || !form.password || !form.name) {
      setError("请填写必要信息");
      return;
    }
    try {
      setError("");
      await register(form);
    } catch (e: any) {
      setError(e.message || "注册失败");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={styles.hero}
        >
          <View style={styles.planeContainer}>
            <Svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="rgba(255,255,255,0.08)"
            >
              <Path d="M2.4 21.6L21.6 12 2.4 2.4v7.2l13.2 2.4-13.2 2.4z" />
            </Svg>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.englishTitle}>
              NANCHANG HANGKONG UNIVERSITY
            </Text>
            <Text style={styles.chineseTitle}>注册新账号</Text>
          </View>
          <View style={styles.heroArc}>
            <ArcCurve height={32} />
          </View>
        </LinearGradient>

        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <InputField
              icon="🎓"
              label="学号"
              value={form.studentId}
              onChange={(v) => update("studentId", v)}
            />
            <InputField
              icon="🔒"
              label="密码"
              value={form.password}
              onChange={(v) => update("password", v)}
              secure
            />
            <InputField
              icon="👤"
              label="姓名"
              value={form.name}
              onChange={(v) => update("name", v)}
            />
            <InputField
              icon="📞"
              label="手机号"
              value={form.phone}
              onChange={(v) => update("phone", v)}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1e3a5f", "#2d5a87"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerBtnGradient}
              >
                <Text style={styles.registerBtnText}>
                  {loading ? "注册中..." : "注 册"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>已有账号？返回登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  group: { marginBottom: 16 },
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
  scroll: { flexGrow: 1 },
  hero: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
    minHeight: 260,
  },
  planeContainer: { position: "absolute", top: 30, right: 30, opacity: 0.6 },
  heroContent: {
    position: "relative",
    zIndex: 1,
    paddingBottom: 40,
    alignItems: "center",
  },
  englishTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: "center",
  },
  chineseTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 3,
  },
  heroArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 32,
  },
  formSection: {
    paddingHorizontal: 24,
    marginTop: -16,
    position: "relative",
    zIndex: 2,
  },
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
  },
  registerBtn: { borderRadius: 24, overflow: "hidden", marginTop: 4 },
  registerBtnGradient: { paddingVertical: 14, alignItems: "center" },
  registerBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 4,
  },
  loginLink: { alignItems: "center", marginTop: 24, paddingBottom: 40 },
  loginText: { color: "#3D7AB5", fontSize: 13 },
});
