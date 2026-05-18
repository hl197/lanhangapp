import React from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../utils/constants";

export default function AboutScreen({ navigation }: any) {
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
        <Text style={styles.topBarTitle}>关于</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="paper-plane" size={40} color="#FFF" />
          </View>
          <Text style={styles.appName}>蓝航图书馆</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="学校名称" value="南昌航空大学" />
          <View style={styles.divider} />
          <InfoRow label="图书馆" value="蓝航图书馆" />
          <View style={styles.divider} />
          <InfoRow label="开发团队" value="蓝航技术部" />
          <View style={styles.divider} />
          <InfoRow label="联系方式" value="library@nchu.edu.cn" />
        </View>

        <Text style={styles.copyright}>
          © 2026 南昌航空大学 蓝航图书馆{"\n"}All Rights Reserved
        </Text>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  label: { fontSize: 13, color: "#6B7B8D" },
  value: { fontSize: 13, fontWeight: "500", color: "#1A2A3A" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
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
  content: { alignItems: "center", paddingTop: 40 },
  logoSection: { alignItems: "center", marginBottom: 32 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1E3A5F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  version: { fontSize: 13, color: "#9CAAB8" },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    marginHorizontal: 24,
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: "#F0F4F8", marginHorizontal: 16 },
  copyright: {
    textAlign: "center",
    color: "#9CAAB8",
    fontSize: 11,
    marginTop: 32,
    lineHeight: 18,
  },
});
