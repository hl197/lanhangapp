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
import { Text, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useAuthStore } from "../../store/authStore";
import ArcCurve from "../../components/ArcCurve";

export default function LoginScreen({ navigation }: any) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      setError("");
      await login({ studentId, password });
    } catch (e: any) {
      setError(e.message || "登录失败");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 渐变英雄区 */}
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
          style={styles.hero}
        >
          {/* 纸飞机 SVG 装饰 */}
          <View style={styles.planeContainer}>
            <Svg
              width="60"
              height="60"
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
            <Text style={styles.chineseTitle}>蓝航图书馆</Text>
            <Text style={styles.motto}>日新自强 · 知行合一</Text>
          </View>

          {/* 弧线过渡 */}
          <View style={styles.heroArc}>
            <ArcCurve height={32} />
          </View>
        </LinearGradient>

        {/* 白色卡片表单 */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>学号</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🎓</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入学号"
                  placeholderTextColor="#9CAAB8"
                  value={studentId}
                  onChangeText={setStudentId}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>密码</Text>
              <View style={styles.inputWrap}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="请输入密码"
                  placeholderTextColor="#9CAAB8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1e3a5f", "#2d5a87"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtnGradient}
              >
                <Text style={styles.loginBtnText}>
                  {loading ? "登录中..." : "登 录"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>没有账号？立即注册</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  scroll: { flexGrow: 1 },
  hero: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
    minHeight: 320,
  },
  planeContainer: { position: "absolute", top: 40, right: 30, opacity: 0.6 },
  heroContent: {
    position: "relative",
    zIndex: 1,
    paddingBottom: 50,
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
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 3,
    marginBottom: 8,
  },
  motto: { fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: 4 },
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
  inputGroup: { marginBottom: 18 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#F0F4F8",
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#1A2A3A", paddingVertical: 0 },
  error: {
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 13,
  },
  loginBtn: { borderRadius: 24, overflow: "hidden", marginTop: 4 },
  loginBtnGradient: { paddingVertical: 14, alignItems: "center" },
  loginBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 4,
  },
  registerLink: { alignItems: "center", marginTop: 24, paddingBottom: 40 },
  registerText: { color: "#3D7AB5", fontSize: 13 },
});
