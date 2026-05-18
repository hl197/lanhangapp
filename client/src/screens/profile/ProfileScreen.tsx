import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/authStore";
import { getProfile } from "../../api/user";
import StatCard from "../../components/StatCard";
import MenuList from "../../components/MenuList";
import ArcCurve from "../../components/ArcCurve";
import { COLORS } from "../../utils/constants";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res: any) => setProfile(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  const name = user?.name || "用户";
  const initial = name.charAt(0);

  const stats = [
    {
      icon: "📖",
      value: profile?.currentBorrows ?? 0,
      label: "在借",
      iconBg: "#E8F0F8",
    },
    {
      icon: "📅",
      value: profile?.reservations ?? 0,
      label: "预约",
      iconBg: "#FEF3E4",
    },
    {
      icon: "💬",
      value: profile?.messages ?? 0,
      label: "消息",
      iconBg: "#EEF2FF",
    },
  ];

  const menuItems = [
    {
      icon: "time-outline" as const,
      iconBg: "#3D7AB5",
      title: "借阅历史",
      onPress: () => navigation.navigate("BorrowHistory"),
    },
    {
      icon: "card-outline" as const,
      iconBg: "#1E3A5F",
      title: "借阅证",
      onPress: () => navigation.navigate("CardStatus"),
    },
    {
      icon: "lock-closed-outline" as const,
      iconBg: "#6B7B8D",
      title: "修改密码",
      onPress: () => navigation.navigate("ChangePassword"),
    },
    {
      icon: "notifications-outline" as const,
      iconBg: "#D97706",
      title: "消息通知",
      badge: profile?.unreadMessages ?? 0,
      onPress: () => navigation.navigate("Message"),
    },
    {
      icon: "calendar-outline" as const,
      iconBg: "#059669",
      title: "我的预约",
      onPress: () => navigation.navigate("Reserve"),
    },
    {
      icon: "information-circle-outline" as const,
      iconBg: "#9CAAB8",
      title: "关于",
      onPress: () => navigation.navigate("About"),
    },
    {
      icon: "log-out-outline" as const,
      iconBg: "#DC2626",
      title: "退出登录",
      onPress: logout,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />

      {/* 渐变头部 */}
      <LinearGradient
        colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.studentId}>
            {profile?.studentId || (user?.userId ? String(user.userId) : "")}
          </Text>
          <Text style={styles.motto}>日新自强 · 知行合一</Text>
        </View>

        <View style={styles.headerArc}>
          <ArcCurve />
        </View>
      </LinearGradient>

      {/* 统计行 */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <StatCard
            key={i}
            icon={s.icon}
            value={s.value}
            label={s.label}
            iconBg={s.iconBg}
          />
        ))}
      </View>

      {/* 菜单列表 */}
      <View style={styles.menuSection}>
        <MenuList items={menuItems} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  header: {
    paddingTop: 56,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
  },
  profileInfo: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  name: { fontSize: 20, fontWeight: "700", color: "#FFF", marginBottom: 4 },
  studentId: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 6 },
  motto: { fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 2 },
  headerArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -12,
    position: "relative",
    zIndex: 2,
    gap: 10,
  },
  menuSection: { marginTop: 24, paddingBottom: 32 },
});
