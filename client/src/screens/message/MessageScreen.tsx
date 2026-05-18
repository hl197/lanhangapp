import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

const MOCK_MESSAGES = [
  {
    id: 1,
    title: "图书到期提醒",
    content: "您借阅的《飞行器结构设计》将于 3 天后到期，请及时归还。",
    time: "2026-05-16 10:30",
    read: false,
  },
  {
    id: 2,
    title: "预约到馆通知",
    content: "您预约的《空气动力学基础》已到馆，请于 2026-05-25 前到馆借阅。",
    time: "2026-05-15 14:20",
    read: false,
  },
  {
    id: 3,
    title: "系统维护通知",
    content: "图书馆系统将于 2026-05-20 凌晨 2:00-5:00 进行维护升级。",
    time: "2026-05-14 09:00",
    read: true,
  },
  {
    id: 4,
    title: "借阅成功通知",
    content: "您已成功借阅《Python编程从入门到实践》，应还日期为 2026-06-10。",
    time: "2026-05-11 16:45",
    read: true,
  },
  {
    id: 5,
    title: "图书逾期提醒",
    content: "您借阅的《算法导论》已逾期 3 天，请尽快归还。",
    time: "2026-05-10 08:00",
    read: true,
  },
];

export default function MessageScreen({ navigation }: any) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const handleMarkRead = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  };

  const handleMarkAllRead = async () => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

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
        <Text style={styles.topBarTitle}>消息通知</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>全部已读</Text>
          </TouchableOpacity>
        )}
        {unreadCount === 0 && <View style={{ width: 60 }} />}
      </View>

      <FlatList
        data={messages}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, !item.read && styles.cardUnread]}
            onPress={() => handleMarkRead(item.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, !item.read && styles.dotActive]} />
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.cardTitle,
                    !item.read && styles.cardTitleUnread,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
              <Text style={styles.cardContent} numberOfLines={2}>
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState message="暂无消息" />}
      />
    </View>
  );
}

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
  markAllText: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardUnread: { backgroundColor: "#F8FAFD" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
    backgroundColor: "transparent",
  },
  dotActive: { backgroundColor: "#3D7AB5" },
  cardBody: { flex: 1, minWidth: 0 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 14, fontWeight: "500", color: "#1A2A3A" },
  cardTitleUnread: { fontWeight: "700" },
  cardTime: { fontSize: 10, color: "#9CAAB8" },
  cardContent: { fontSize: 12, color: "#6B7B8D", lineHeight: 18 },
});
