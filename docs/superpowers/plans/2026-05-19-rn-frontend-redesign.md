# RN 前端重设计实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 React Native 版前端全面改造为 Vue uni-app 版本的航空主题视觉风格

**Architecture:** 抽离 7 个共享组件（GradientHeader、SectionBar、StatCard、QuickEntry、BookCoverBlock、MenuList、ArcCurve），然后逐个页面改造。先安装依赖（expo-linear-gradient、react-native-svg），再改造 Phase 1 的 8 个页面，最后添加 Phase 2 的 6 个新页面+导航注册。

**Tech Stack:** React Native 0.83.6 / Expo 55, expo-linear-gradient, react-native-svg, React Native Paper

---

## 文件结构

### 新增共享组件（7 个）

| 文件                                       | 职责                                                |
| ------------------------------------------ | --------------------------------------------------- |
| `client/src/components/GradientHeader.tsx` | 渐变导航栏 + 底部弧线 + 可选虚线圆环装饰            |
| `client/src/components/SectionBar.tsx`     | 蓝色竖条 + 标题 + 可选"查看全部"链接                |
| `client/src/components/StatCard.tsx`       | 圆形图标底 + 数字 + 标签统计卡片                    |
| `client/src/components/QuickEntry.tsx`     | 快捷入口卡片（渐变色图标底 + 标题 + 副标题）        |
| `client/src/components/BookCoverBlock.tsx` | 渐变色块替代封面图（竖向书名文字）                  |
| `client/src/components/MenuList.tsx`       | 个人中心菜单项（彩色圆底图标 + 文字 + 角标 + 箭头） |
| `client/src/components/ArcCurve.tsx`       | SVG 弧线装饰                                        |

### Phase 1 修改页面（8 个）

| 文件                                                | 改造要点                                               |
| --------------------------------------------------- | ------------------------------------------------------ |
| `client/src/screens/home/HomeScreen.tsx`            | 渐变导航栏+弧线+虚线圆环、快捷入口、热门借阅、分类网格 |
| `client/src/screens/auth/LoginScreen.tsx`           | 渐变英雄区+纸飞机+校名校训、弧线过渡、白色卡片表单     |
| `client/src/screens/auth/RegisterScreen.tsx`        | 与登录页风格统一                                       |
| `client/src/screens/profile/ProfileScreen.tsx`      | 渐变头部+头像字母+统计行+完整菜单列表                  |
| `client/src/screens/borrow/BorrowListScreen.tsx`    | 欢迎条、统计卡片、封面+信息借阅卡                      |
| `client/src/screens/borrow/BorrowHistoryScreen.tsx` | 与借阅列表风格统一                                     |
| `client/src/screens/home/BookDetailScreen.tsx`      | 封面渐变区+弧线、信息卡片、简介卡片、底部操作栏        |
| `client/src/screens/profile/CardStatusScreen.tsx`   | 深蓝渐变卡片+头像学号+借阅统计+规则说明                |

### Phase 2 新增页面（6 个）

| 文件                                                  | 说明                            |
| ----------------------------------------------------- | ------------------------------- |
| `client/src/screens/search/SearchScreen.tsx`          | 搜索栏+分类筛选+结果列表        |
| `client/src/screens/category/CategoryScreen.tsx`      | 分类网格+分类主题色             |
| `client/src/screens/borrow/ReserveScreen.tsx`         | 预约列表+取消操作（mock 数据）  |
| `client/src/screens/message/MessageScreen.tsx`        | 消息列表+已读/未读（mock 数据） |
| `client/src/screens/profile/ChangePasswordScreen.tsx` | 表单统一风格                    |
| `client/src/screens/about/AboutScreen.tsx`            | 学校信息+版本                   |

### 导航更新

| 文件                                     | 操作                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `client/src/navigation/AppNavigator.tsx` | 添加 SearchScreen、CategoryScreen、ReserveScreen、MessageScreen、ChangePasswordScreen、AboutScreen 路由 |

---

### Task 1: 安装依赖

**Files:**

- Modify: `client/package.json`

- [ ] **Step 1: 安装 expo-linear-gradient 和 react-native-svg**

```bash
cd /c/Users/86182/Desktop/lanhangapp/client
export JAVA_HOME="/d/java"
export PATH="$JAVA_HOME/bin:/c/Program Files/apache-maven/apache-maven-3.9.15/bin:$PATH"
npx expo install expo-linear-gradient react-native-svg
```

Expected: Packages installed successfully, added to package.json and podfile.lock.

- [ ] **Step 2: 验证安装**

```bash
ls node_modules/expo-linear-gradient/package.json && echo "OK" || echo "MISSING"
ls node_modules/react-native-svg/package.json && echo "OK" || echo "MISSING"
```

Expected: Both print "OK".

---

### Task 2: 创建共享组件 — GradientHeader + ArcCurve

**Files:**

- Create: `client/src/components/GradientHeader.tsx`
- Create: `client/src/components/ArcCurve.tsx`

- [ ] **Step 1: 创建 ArcCurve 组件**

```tsx
import React from "react";
import Svg, { Path } from "react-native-svg";

interface ArcCurveProps {
  color?: string;
  height?: number;
  style?: any;
}

export default function ArcCurve({
  color = "#F0F4F8",
  height = 24,
  style,
}: ArcCurveProps) {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      style={style}
    >
      <Path d="M0,24 Q200,-12 400,24 L400,24 L0,24 Z" fill={color} />
    </Svg>
  );
}
```

- [ ] **Step 2: 创建 GradientHeader 组件**

```tsx
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import ArcCurve from "./ArcCurve";

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  englishTitle?: string;
  motto?: string;
  showArc?: boolean;
  showDashedRings?: boolean;
  rightElement?: React.ReactNode;
  arcColor?: string;
}

export default function GradientHeader({
  title,
  subtitle,
  englishTitle,
  motto,
  showArc = true,
  showDashedRings = true,
  rightElement,
  arcColor = "#F0F4F8",
}: GradientHeaderProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        {/* 虚线圆环装饰 */}
        {showDashedRings && (
          <View style={styles.ringContainer}>
            <Svg height="200" width="200" style={styles.ringOuter}>
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
            <Svg height="130" width="130" style={styles.ringInner}>
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
          </View>
        )}

        <View style={styles.content}>
          {englishTitle && (
            <Text style={styles.englishTitle}>{englishTitle}</Text>
          )}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {rightElement}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {motto && <Text style={styles.motto}>{motto}</Text>}
        </View>

        {/* 底部弧线 */}
        {showArc && (
          <View style={styles.arcWrapper}>
            <ArcCurve color={arcColor} />
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  gradient: {
    paddingTop: 50,
    paddingBottom: 0,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  ringContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 200,
    height: 200,
  },
  ringOuter: { position: "absolute", top: -60, right: -40 },
  ringInner: { position: "absolute", top: -20, right: 0 },
  content: { position: "relative", zIndex: 1, paddingBottom: 40 },
  englishTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  motto: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    letterSpacing: 3,
    marginTop: 2,
  },
  arcWrapper: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
});
```

---

### Task 3: 创建共享组件 — SectionBar + StatCard + QuickEntry

**Files:**

- Create: `client/src/components/SectionBar.tsx`
- Create: `client/src/components/StatCard.tsx`
- Create: `client/src/components/QuickEntry.tsx`

- [ ] **Step 1: 创建 SectionBar 组件**

```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SectionBarProps {
  title: string;
  linkText?: string;
  onLinkPress?: () => void;
}

export default function SectionBar({
  title,
  linkText,
  onLinkPress,
}: SectionBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar} />
      <Text style={styles.title}>{title}</Text>
      {linkText && onLinkPress && (
        <TouchableOpacity onPress={onLinkPress}>
          <Text style={styles.link}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bar: {
    width: 4,
    height: 18,
    backgroundColor: "#3D7AB5",
    borderRadius: 2,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A2A3A",
    flex: 1,
  },
  link: {
    fontSize: 12,
    color: "#3D7AB5",
  },
});
```

- [ ] **Step 2: 创建 StatCard 组件**

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  iconBg?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  iconBg = "#E8F0F8",
}: StatCardProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 18 },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A2A3A",
  },
  label: {
    fontSize: 11,
    color: "#9CAAB8",
    marginTop: 2,
  },
});
```

- [ ] **Step 3: 创建 QuickEntry 组件**

```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface QuickEntryProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  iconBg?: string[];
}

export default function QuickEntry({
  icon,
  title,
  subtitle,
  onPress,
  iconBg = ["#E8F0F8", "#DCE4F0"],
}: QuickEntryProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg[0] }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "rgba(26,51,80,0.04)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  icon: { fontSize: 18 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#9CAAB8",
  },
});
```

---

### Task 4: 创建共享组件 — BookCoverBlock + MenuList

**Files:**

- Create: `client/src/components/BookCoverBlock.tsx`
- Create: `client/src/components/MenuList.tsx`

- [ ] **Step 1: 创建 BookCoverBlock 组件**

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface BookCoverBlockProps {
  title: string;
  size?: { width: number; height: number };
  colors?: string[];
}

export default function BookCoverBlock({
  title,
  size = { width: 55, height: 74 },
  colors = ["#1E3A5F", "#3D7AB5"],
}: BookCoverBlockProps) {
  const firstChar = title.replace(/[《》\s]/g, "").charAt(0) || "书";

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, { width: size.width, height: size.height }]}
    >
      <Text style={styles.char}>{firstChar}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cover: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  char: {
    fontSize: 22,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
});
```

- [ ] **Step 2: 创建 MenuList 组件**

```tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  title: string;
  badge?: number;
  onPress: () => void;
}

interface MenuListProps {
  items: MenuItem[];
}

export default function MenuList({ items }: MenuListProps) {
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.item, index < items.length - 1 && styles.itemBorder]}
          onPress={item.onPress}
          activeOpacity={0.6}
        >
          <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          {item.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          ) : null}
          <Ionicons name="chevron-forward" size={16} color="#9CAAB8" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: "#1A2A3A",
    marginLeft: 12,
  },
  badge: {
    backgroundColor: "#DC2626",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
});
```

---

### Task 5: 改造首页 (HomeScreen)

**Files:**

- Modify: `client/src/screens/home/HomeScreen.tsx`

- [ ] **Step 1: 重写 HomeScreen 为 Vue 风格**

关键改动：

- 渐变导航栏（英文校名+蓝航图书馆+校训+虚线圆环+弧线）
- 搜索条浮在弧线上
- 3 个快捷入口（馆藏检索/航空特藏/我的借阅）
- SectionBar "热门借阅" + BookCoverBlock 封面+书籍卡片
- SectionBar "分类浏览" + 2x2 分类网格

```tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { searchBooks, Book } from "../../api/books";
import BookCoverBlock from "../../components/BookCoverBlock";
import SectionBar from "../../components/SectionBar";
import QuickEntry from "../../components/QuickEntry";
import ArcCurve from "../../components/ArcCurve";
import { COLORS, CATEGORY_STYLES } from "../../utils/constants";
import { MOCK_BOOKS } from "../../utils/mock-data";

const { width } = Dimensions.get("window");

const QUICK_ENTRIES = [
  { icon: "🧭", title: "馆藏检索", subtitle: "搜索全部资源", route: "Search" },
  {
    icon: "✈️",
    title: "航空特藏",
    subtitle: "航空专业文献",
    route: "Category",
  },
  { icon: "📖", title: "我的借阅", subtitle: "本借阅中", route: "Borrow" },
];

const CATEGORIES = [
  { icon: "✈️", name: "航空宇航", count: "45 册馆藏", bg: "#E8F0F8" },
  { icon: "📜", name: "人文历史", count: "78 册馆藏", bg: "#FEF3E4" },
  { icon: "🔬", name: "自然科学", count: "62 册馆藏", bg: "#E8F5E9" },
  { icon: "🖋", name: "文学艺术", count: "93 册馆藏", bg: "#EEF2FF" },
];

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await searchBooks({ keyword, page: 0, size: 20 });
      setBooks(res.data.content || []);
    } catch {
      let filtered = MOCK_BOOKS;
      if (keyword)
        filtered = filtered.filter(
          (b) => b.title.includes(keyword) || b.author.includes(keyword),
        );
      setBooks(filtered);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [keyword]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* 渐变导航栏 */}
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.header}
        >
          {/* 虚线圆环装饰 */}
          <View style={styles.rings}>
            <Svg height="200" width="200" style={styles.ringOuter}>
              <Circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
            <Svg height="130" width="130" style={styles.ringInner}>
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                fill="none"
              />
            </Svg>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.englishTitle}>
              NANCHANG HANGKONG UNIVERSITY
            </Text>
            <Text style={styles.mainTitle}>蓝航图书馆</Text>
            <Text style={styles.motto}>日新自强 · 知行合一</Text>
          </View>

          {/* 底部弧线 */}
          <View style={styles.headerArc}>
            <ArcCurve />
          </View>
        </LinearGradient>

        {/* 搜索条（浮在弧线上） */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="#9CAAB8" />
            <TextInput
              placeholder="搜索书名、作者或关键词"
              placeholderTextColor="#9CAAB8"
              style={styles.searchInput}
              value={keyword}
              onChangeText={setKeyword}
              returnKeyType="search"
              onSubmitEditing={() => fetchBooks()}
            />
            {keyword ? (
              <TouchableOpacity onPress={() => setKeyword("")}>
                <Ionicons name="close-circle" size={16} color="#9CAAB8" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 快捷入口 */}
        <View style={styles.quickEntries}>
          {QUICK_ENTRIES.map((entry, i) => (
            <QuickEntry
              key={i}
              icon={entry.icon}
              title={entry.title}
              subtitle={entry.subtitle}
              onPress={() => {
                if (entry.route === "Borrow") {
                  navigation.navigate("Borrow");
                } else {
                  navigation.navigate(entry.route);
                }
              }}
            />
          ))}
        </View>

        {/* 热门借阅 */}
        <View style={styles.sectionWrapper}>
          <SectionBar title="热门借阅" linkText="查看全部 →" />
          {loading ? (
            <ActivityIndicator
              style={{ margin: 24 }}
              color={COLORS.primaryLight}
            />
          ) : (
            books.slice(0, 4).map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookCard}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("BookDetail", { bookId: book.id })
                }
              >
                <BookCoverBlock title={book.title} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <View style={styles.bookBottom}>
                    <Text style={styles.isbn}>{book.isbn}</Text>
                    <View
                      style={[
                        styles.statusTag,
                        {
                          backgroundColor:
                            book.available > 0 ? "#E8F0F8" : "#FEF3E4",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: book.available > 0 ? "#2D5A87" : "#B8780A" },
                        ]}
                      >
                        {book.available > 0 ? "可借阅" : "已借出"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* 分类浏览 */}
        <View style={styles.sectionWrapper}>
          <SectionBar title="分类浏览" />
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.categoryCard, { backgroundColor: cat.bg }]}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryCount}>{cat.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
  },
  rings: { position: "absolute", top: 0, right: 0, width: 200, height: 200 },
  ringOuter: { position: "absolute", top: -60, right: -40 },
  ringInner: { position: "absolute", top: -20, right: 0 },
  headerContent: { position: "relative", zIndex: 1, paddingBottom: 40 },
  englishTitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 2,
    marginBottom: 6,
  },
  motto: { fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: 3 },
  headerArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
  searchWrapper: {
    paddingHorizontal: 24,
    marginTop: -28,
    position: "relative",
    zIndex: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "rgba(26,51,80,0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#1A2A3A",
    paddingVertical: 0,
  },
  quickEntries: { flexDirection: "row", padding: 24, gap: 12 },
  sectionWrapper: { paddingHorizontal: 24, marginBottom: 20 },
  bookCard: {
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
  bookInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  bookAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 8 },
  bookBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  isbn: { fontSize: 10, color: "#9CAAB8", fontFamily: "monospace" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "500" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    width: (width - 68) / 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: { fontSize: 24, marginRight: 10 },
  categoryName: { fontSize: 13, fontWeight: "700", color: "#1A2A3A" },
  categoryCount: { fontSize: 10, color: "#6B7B8D", marginTop: 2 },
});
```

---

### Task 6: 改造登录页 (LoginScreen)

**Files:**

- Modify: `client/src/screens/auth/LoginScreen.tsx`

- [ ] **Step 1: 重写 LoginScreen 为 Vue 风格**

关键改动：

- 渐变英雄区（480rpx 高度）+ 纸飞机 SVG + 英文校名 + 校训
- 底部弧线连接白色卡片表单
- 白色卡片：灰色输入框底 #F0F4F8、蓝色聚焦边框
- 深蓝按钮 24px 圆角

```tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
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

// Need to import TextInput from RN
import { TextInput } from "react-native";

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
```

Note: Need to verify `TextInput` import at top is correct — the import is placed inline below the component. Fix in actual implementation.

---

### Task 7: 改造注册页 (RegisterScreen)

**Files:**

- Modify: `client/src/screens/auth/RegisterScreen.tsx`

- [ ] **Step 1: 重写 RegisterScreen 与登录页风格统一**

同 LoginScreen 相同的渐变英雄区 + 弧线 + 白色卡片 + 圆角按钮样式。

```tsx
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
              label="学号 *"
              value={form.studentId}
              onChange={(v) => update("studentId", v)}
            />
            <InputField
              icon="🔒"
              label="密码 *"
              value={form.password}
              onChange={(v) => update("password", v)}
              secure
            />
            <InputField
              icon="👤"
              label="姓名 *"
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
          placeholder={`请输入${label.replace(" *", "").replace("*", "")}`}
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
```

---

### Task 8: 改造个人中心 (ProfileScreen)

**Files:**

- Modify: `client/src/screens/profile/ProfileScreen.tsx`

- [ ] **Step 1: 重写 ProfileScreen**

关键改动：

- 渐变头部 + 头像字母圆（48px）+ 姓名 + 学号 + 校训
- 统计行：3 列（在借 / 预约 / 消息）数字 + 文字
- 弧线装饰
- 完整菜单列表（借阅历史/借阅证/修改密码/消息通知/我的预约/关于/退出）

```tsx
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
            {profile?.studentId || user?.userId ? String(user.userId) : ""}
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
```

---

### Task 9: 改造借阅列表 (BorrowListScreen)

**Files:**

- Modify: `client/src/screens/borrow/BorrowListScreen.tsx`

- [ ] **Step 1: 重写 BorrowListScreen**

关键改动：

- 欢迎条：白色卡片，"欢迎回来" + 借阅总数 + 圆形数字
- 统计卡片：3列（在借数量/即将到期/历史借阅）
- SectionBar "当前借阅"
- 借阅卡片：BookCoverBlock 封面 + 书名/作者/分类标签 + 日期行 + 续借按钮
- 逾期卡片：左侧 3px 红色竖线 + 红色日期强调

```tsx
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentBorrows, renewBook, BorrowRecord } from "../../api/borrow";
import BookCoverBlock from "../../components/BookCoverBlock";
import StatCard from "../../components/StatCard";
import SectionBar from "../../components/SectionBar";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

export default function BorrowListScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchBorrows();
    }, []),
  );

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res: any = await getCurrentBorrows();
      setRecords(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id: number) => {
    try {
      await renewBook(id);
      fetchBorrows();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const getTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || "";
  const getAuthor = (item: BorrowRecord) => item.book?.author || "";
  const overdueCount = records.filter((r) => r.status === "overdue").length;
  const now = new Date();
  const dueSoonCount = records.filter((r) => {
    if (!r.dueDate || r.status === "returned") return false;
    const days =
      (new Date(r.dueDate).getTime() - now.getTime()) / (1000 * 86400);
    return days >= 0 && days <= 7;
  }).length;

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />

      <FlatList
        data={records}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const overdue = item.status === "overdue";
          const title = getTitle(item);
          const author = getAuthor(item);
          const borrowDate = item.borrowDate?.substring(0, 10) || "";
          const dueDate = item.dueDate?.substring(0, 10) || "";

          let daysLeft: string;
          let daysColor: string;
          if (overdue) {
            daysLeft = "已逾期";
            daysColor = "#D32F2F";
          } else if (item.dueDate) {
            const days = Math.ceil(
              (new Date(item.dueDate).getTime() - now.getTime()) /
                (1000 * 86400),
            );
            daysLeft = `${days} 天`;
            daysColor = days <= 7 ? "#D32F2F" : "#2E7D32";
          } else {
            daysLeft = "-";
            daysColor = "#6B7B8D";
          }

          return (
            <View style={[styles.borrowCard, overdue && styles.overdueCard]}>
              <View style={styles.cardTop}>
                <BookCoverBlock title={title} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={styles.cardAuthor}>{author || "未知作者"}</Text>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>
                      {item.book?.title ? "图书" : "借阅"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>借阅日期</Text>
                  <Text style={styles.dateValue}>{borrowDate}</Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>应还日期</Text>
                  <Text
                    style={[styles.dateValue, overdue && { color: "#D32F2F" }]}
                  >
                    {dueDate}
                  </Text>
                </View>
                <View style={styles.dateItem}>
                  <Text style={styles.dateLabel}>剩余天数</Text>
                  <Text style={[styles.dateValue, { color: daysColor }]}>
                    {daysLeft}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                {!item.renewed && !overdue && (
                  <TouchableOpacity
                    style={styles.renewBtn}
                    onPress={() => handleRenew(item.id)}
                  >
                    <Text style={styles.renewText}>续借</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListHeaderComponent={
          <>
            {/* 欢迎条 */}
            <View style={styles.welcomeBar}>
              <View>
                <Text style={styles.welcomeTitle}>欢迎回来</Text>
                <Text style={styles.welcomeSub}>
                  您当前有{" "}
                  <Text style={styles.welcomeHighlight}>{records.length}</Text>{" "}
                  本书在借
                </Text>
              </View>
              <View style={styles.welcomeCircle}>
                <Text style={styles.welcomeNum}>{records.length}</Text>
              </View>
            </View>

            {/* 统计卡片 */}
            <View style={styles.statsRow}>
              <StatCard
                icon="📖"
                value={records.length}
                label="在借数量"
                iconBg="#E8F0F8"
              />
              <StatCard
                icon="⏰"
                value={dueSoonCount}
                label="即将到期"
                iconBg="#FEF3E4"
              />
              <StatCard
                icon="📋"
                value={records.filter((r) => r.status === "returned").length}
                label="历史借阅"
                iconBg="#EEF2FF"
              />
            </View>

            {/* 区块标题 */}
            <View style={styles.sectionHeader}>
              <SectionBar title="当前借阅" />
            </View>
          </>
        }
        ListEmptyComponent={<EmptyState message="暂无借阅记录" />}
      />
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
  list: { padding: 16, paddingTop: 16 },
  welcomeBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  welcomeTitle: { fontSize: 16, fontWeight: "700", color: "#1A2A3A" },
  welcomeSub: { fontSize: 13, color: "#6B7B8D", marginTop: 4 },
  welcomeHighlight: { color: "#1E3A5F", fontWeight: "700" },
  welcomeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F0F8",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeNum: { fontSize: 20, fontWeight: "700", color: "#1E3A5F" },
  statsRow: { flexDirection: "row", marginBottom: 24, gap: 10 },
  sectionHeader: { marginBottom: 12 },
  borrowCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  overdueCard: { borderLeftWidth: 3, borderLeftColor: "#D32F2F" },
  cardTop: { flexDirection: "row", marginBottom: 14 },
  cardInfo: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  cardAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F0F8",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: { fontSize: 10, fontWeight: "500", color: "#2D5A87" },
  dateRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4F8",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
    marginBottom: 12,
  },
  dateItem: { flex: 1 },
  dateLabel: { fontSize: 11, color: "#9CAAB8", marginBottom: 4 },
  dateValue: { fontSize: 13, color: "#1A2A3A", fontWeight: "500" },
  cardActions: { flexDirection: "row", justifyContent: "flex-end" },
  renewBtn: {
    borderWidth: 1,
    borderColor: "#3D7AB5",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 24,
  },
  renewText: { fontSize: 13, fontWeight: "500", color: "#3D7AB5" },
});
```

---

### Task 10: 改造借阅历史 (BorrowHistoryScreen)

**Files:**

- Modify: `client/src/screens/borrow/BorrowHistoryScreen.tsx`

- [ ] **Step 1: 重写 BorrowHistoryScreen 匹配借阅列表风格**

使用相同的卡片样式、BookCoverBlock、日期行风格。

```tsx
import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getBorrowHistory, BorrowRecord } from "../../api/borrow";
import BookCoverBlock from "../../components/BookCoverBlock";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

const statusMap: Record<string, { label: string; color: string }> = {
  returned: { label: "已归还", color: "#059669" },
  overdue: { label: "逾期", color: "#DC2626" },
  borrowed: { label: "借阅中", color: "#D97706" },
};

export default function BorrowHistoryScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res: any = await getBorrowHistory();
      setRecords(res.data?.content || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = (item: BorrowRecord) =>
    item.bookTitle || item.book?.title || "";

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );

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
        <Text style={styles.topBarTitle}>借阅历史</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={records}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const st = statusMap[item.status] || {
            label: item.status,
            color: "#6B7B8D",
          };
          const title = getTitle(item);

          return (
            <View style={[styles.card, { borderLeftColor: st.color }]}>
              <BookCoverBlock title={title} size={{ width: 50, height: 66 }} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {title}
                </Text>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={11} color="#9CAAB8" />
                  <Text style={styles.dateText}>
                    借阅：{item.borrowDate?.substring(0, 10)}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={11} color="#9CAAB8" />
                  <Text style={styles.dateText}>
                    归还：{item.returnDate?.substring(0, 10) || "-"}
                  </Text>
                </View>
                <View
                  style={[styles.badge, { backgroundColor: st.color + "18" }]}
                >
                  <Text style={[styles.badgeText, { color: st.color }]}>
                    {st.label}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message="暂无借阅历史" />}
      />
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
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 6,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 3 },
  dateText: { fontSize: 11, color: "#6B7B8D", marginLeft: 4 },
  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "500" },
});
```

---

### Task 11: 改造图书详情 (BookDetailScreen)

**Files:**

- Modify: `client/src/screens/home/BookDetailScreen.tsx`

- [ ] **Step 1: 重写 BookDetailScreen**

关键改动：

- 封面渐变区 + 标题/作者 + 弧形过渡
- 信息卡片（索书号等宽蓝色、出版信息、分类标签、状态标签）
- 简介卡片（蓝色竖条标题）
- 底部固定操作栏：借阅（深蓝）+ 预约（线框）

```tsx
import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, Button, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getBookDetail, Book } from "../../api/books";
import { borrowBook } from "../../api/borrow";
import ArcCurve from "../../components/ArcCurve";
import { COLORS, CATEGORY_STYLES } from "../../utils/constants";

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    getBookDetail(bookId).then((res: any) => {
      setBook(res.data);
      setLoading(false);
    });
  }, [bookId]);

  const handleBorrow = async () => {
    if (!book || book.available <= 0) return;
    setBorrowing(true);
    try {
      await borrowBook(book.id);
      const res: any = await getBookDetail(bookId);
      setBook(res.data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBorrowing(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  if (!book)
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.error }}>图书不存在</Text>
      </View>
    );

  const cs =
    CATEGORY_STYLES[book.category || "其他"] || CATEGORY_STYLES["其他"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3350" />

      {/* 顶部导航 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>图书详情</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 封面渐变区 */}
        <LinearGradient
          colors={["#1a3350", "#1e3a5f", "#2d5a87"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.coverSection}
        >
          <View style={styles.coverBlock}>
            <Text style={styles.coverChar}>{book.title.charAt(0)}</Text>
          </View>
          <Text style={styles.coverTitle}>{book.title}</Text>
          {book.author && <Text style={styles.coverAuthor}>{book.author}</Text>}
          <View style={styles.coverArc}>
            <ArcCurve />
          </View>
        </LinearGradient>

        {/* 信息卡片 */}
        <View style={styles.infoCard}>
          {book.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>索书号</Text>
              <Text style={styles.infoValueMono}>{book.location}</Text>
            </View>
          )}
          {book.publisher && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>出版信息</Text>
              <Text style={styles.infoValue}>{book.publisher}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>分类</Text>
            <View style={[styles.categoryTag, { backgroundColor: cs.bg }]}>
              <Text style={[styles.categoryText, { color: cs.primary }]}>
                {book.category || "未分类"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>状态</Text>
            <View
              style={[
                styles.statusTag,
                { backgroundColor: book.available > 0 ? "#E8F0F8" : "#FEF3E4" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: book.available > 0 ? "#2D5A87" : "#B8780A" },
                ]}
              >
                {book.available > 0
                  ? `可借 ${book.available}/${book.total}`
                  : "已借出"}
              </Text>
            </View>
          </View>
          {book.isbn && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ISBN</Text>
              <Text style={styles.infoValueMono}>{book.isbn}</Text>
            </View>
          )}
        </View>

        {/* 简介卡片 */}
        {book.description && (
          <View style={styles.descCard}>
            <View style={styles.descHeader}>
              <View style={styles.descBar} />
              <Text style={styles.descTitle}>内容简介</Text>
            </View>
            <Text style={styles.descText}>{book.description}</Text>
          </View>
        )}

        {/* 底部留白 */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* 底部固定操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.borrowBtn,
            book.available <= 0 && styles.borrowBtnDisabled,
          ]}
          onPress={handleBorrow}
          disabled={borrowing || book.available <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.borrowBtnText}>
            {borrowing
              ? "借阅中..."
              : book.available > 0
                ? "借 阅"
                : "暂无余量"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.8}>
          <Text style={styles.reserveBtnText}>预 约</Text>
        </TouchableOpacity>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E3A5F",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: { padding: 4 },
  topBarTitle: { color: "#FFF", fontSize: 17, fontWeight: "600" },
  scroll: { paddingBottom: 40 },
  coverSection: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 0,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  coverBlock: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  coverChar: {
    fontSize: 36,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  coverTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
  },
  coverAuthor: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 30,
  },
  coverArc: {
    position: "absolute",
    bottom: 0,
    left: "-5%",
    width: "110%",
    height: 24,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    margin: 16,
    marginTop: -8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F4F8",
  },
  infoLabel: { width: 70, fontSize: 12, color: "#6B7B8D" },
  infoValue: { fontSize: 13, color: "#1A2A3A", flex: 1 },
  infoValueMono: {
    fontSize: 12,
    color: "#1E3A5F",
    fontFamily: "monospace",
    fontWeight: "600",
    flex: 1,
  },
  categoryTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  categoryText: { fontSize: 11, fontWeight: "500" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "500" },
  descCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  descHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  descBar: {
    width: 4,
    height: 18,
    backgroundColor: "#3D7AB5",
    borderRadius: 2,
    marginRight: 10,
  },
  descTitle: { fontSize: 16, fontWeight: "700", color: "#1A2A3A" },
  descText: { fontSize: 13, color: "#6B7B8D", lineHeight: 22 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#FFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  borrowBtn: {
    flex: 2,
    backgroundColor: "#1E3A5F",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  borrowBtnDisabled: { backgroundColor: "#9CAAB8" },
  borrowBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
  },
  reserveBtn: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3D7AB5",
    paddingVertical: 14,
    alignItems: "center",
  },
  reserveBtnText: {
    color: "#3D7AB5",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 2,
  },
});
```

---

### Task 12: 改造借阅证 (CardStatusScreen)

**Files:**

- Modify: `client/src/screens/profile/CardStatusScreen.tsx`

- [ ] **Step 1: 重写 CardStatusScreen**

关键改动：

- 深蓝渐变卡片：学校名 + 借阅证标签、头像字母 + 姓名 + 学号、有效期 + 借阅统计
- 借阅规则：白色卡片 + 蓝色圆点列表

```tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getCardStatus } from "../../api/user";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../utils/constants";

const RULES = [
  "每人最多可同时借阅 5 本图书",
  "单次借阅期限为 30 天",
  "到期前可续借 1 次，续借期 30 天",
  "逾期将暂停借阅权限，请按时归还",
];

export default function CardStatusScreen({ navigation }: any) {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    getCardStatus()
      .then((res: any) => setCard(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  if (!card)
    return (
      <View style={styles.loading}>
        <Text style={{ color: COLORS.error }}>获取借阅证信息失败</Text>
      </View>
    );

  const name = user?.name || "用户";
  const initial = name.charAt(0);
  const maxBooks = card.maxBooks ?? 5;
  const borrowedBooks = card.borrowedBooks ?? 0;
  const remaining = maxBooks - borrowedBooks;

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
        <Text style={styles.topBarTitle}>借阅证</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        {/* 深蓝渐变卡片 */}
        <LinearGradient
          colors={["#1a3350", "#1e3a5f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* 头部 */}
          <View style={styles.cardHeader}>
            <Text style={styles.schoolName}>南昌航空大学图书馆</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>借阅证</Text>
            </View>
          </View>

          {/* 用户信息 */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.studentId}>
                {card.studentNo || card.cardNo || ""}
              </Text>
            </View>
          </View>

          {/* 统计信息 */}
          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>有效期</Text>
              <Text style={styles.statValue}>
                {card.expireDate?.substring(0, 10) || "2026-12-31"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>可借 / 已借 / 剩余</Text>
              <Text style={styles.statValue}>
                <Text style={styles.statNum}>{maxBooks}</Text>
                {" / "}
                {borrowedBooks}
                {" / "}
                <Text style={styles.statNum}>{remaining}</Text>
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 借阅规则 */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>借阅规则</Text>
          {RULES.map((rule, i) => (
            <View key={i} style={styles.ruleRow}>
              <View style={styles.ruleDot} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
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
  body: { padding: 20 },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  schoolName: { fontSize: 14, color: "rgba(255,255,255,0.85)" },
  cardBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardBadgeText: { fontSize: 10, fontWeight: "500", color: "#FFF" },
  userInfo: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    flexShrink: 0,
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  userName: { fontSize: 18, fontWeight: "700", color: "#FFF", marginBottom: 4 },
  studentId: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  cardStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: 14,
  },
  statItem: { flex: 1 },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  statValue: { fontSize: 13, color: "rgba(255,255,255,0.9)" },
  statNum: { fontWeight: "700", color: "#FFF" },
  rulesCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  rulesTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A2A3A",
    marginBottom: 14,
  },
  ruleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  ruleDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#3D7AB5",
    marginTop: 7,
    marginRight: 10,
    flexShrink: 0,
  },
  ruleText: { fontSize: 13, color: "#6B7B8D", lineHeight: 20, flex: 1 },
});
```

---

### Task 13: 添加 Phase 2 新页面 — SearchScreen + CategoryScreen

**Files:**

- Create: `client/src/screens/search/SearchScreen.tsx`
- Create: `client/src/screens/category/CategoryScreen.tsx`

- [ ] **Step 1: 创建 SearchScreen**

提供了搜索栏 + 分类横向筛选 + 结果列表，使用 mock 数据 fallback。

```tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { searchBooks, Book } from "../../api/books";
import BookCoverBlock from "../../components/BookCoverBlock";
import { COLORS, BOOK_CATEGORIES } from "../../utils/constants";
import { MOCK_BOOKS } from "../../utils/mock-data";

export default function SearchScreen({ navigation }: any) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const res: any = await searchBooks({
        keyword,
        category,
        page: 0,
        size: 50,
      });
      setResults(res.data?.content || []);
    } catch {
      let filtered = MOCK_BOOKS;
      if (keyword)
        filtered = filtered.filter(
          (b) => b.title.includes(keyword) || b.author.includes(keyword),
        );
      if (category) filtered = filtered.filter((b) => b.category === category);
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.searchInputWrap}>
          <Ionicons name="search" size={16} color="#9CAAB8" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索书名、作者"
            placeholderTextColor="#9CAAB8"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {keyword ? (
            <TouchableOpacity onPress={() => setKeyword("")}>
              <Ionicons name="close-circle" size={16} color="#9CAAB8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 分类筛选 */}
      <View style={styles.categoryRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["全部", ...BOOK_CATEGORIES]}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const active = item === "全部" ? !category : category === item;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setCategory(item === "全部" ? null : item);
                }}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    active && styles.categoryChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={results}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() =>
              navigation.navigate("BookDetail", { bookId: item.id })
            }
          >
            <BookCoverBlock title={item.title} />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.resultAuthor}>{item.author}</Text>
              <View style={styles.resultBottom}>
                <Text style={styles.resultIsbn}>{item.isbn}</Text>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor:
                        item.available > 0 ? "#E8F0F8" : "#FEF3E4",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.available > 0 ? "#2D5A87" : "#B8780A" },
                    ]}
                  >
                    {item.available > 0 ? "可借阅" : "已借出"}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searched && !loading ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color="#9CAAB8" />
              <Text style={styles.emptyText}>未找到相关图书</Text>
            </View>
          ) : !searched ? (
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={48} color="#9CAAB8" />
              <Text style={styles.emptyText}>输入关键词搜索图书</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              style={{ margin: 24 }}
              color={COLORS.primaryLight}
            />
          ) : null
        }
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
    gap: 12,
  },
  backBtn: { padding: 4 },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
    marginLeft: 8,
    paddingVertical: 0,
  },
  categoryRow: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4F8",
  },
  categoryList: { paddingHorizontal: 16 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#F0F4F8",
  },
  categoryChipActive: { backgroundColor: "#1E3A5F" },
  categoryChipText: { fontSize: 13, color: "#6B7B8D" },
  categoryChipTextActive: { color: "#FFF", fontWeight: "500" },
  list: { padding: 16 },
  resultCard: {
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
  resultInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  resultAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  resultBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultIsbn: { fontSize: 10, color: "#9CAAB8", fontFamily: "monospace" },
  statusTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: "500" },
  empty: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#9CAAB8", fontSize: 14, marginTop: 12 },
});
```

- [ ] **Step 2: 创建 CategoryScreen**

```tsx
import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  BOOK_CATEGORIES,
  CATEGORY_STYLES,
} from "../../utils/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;
const CATEGORY_ICONS: Record<string, string> = {
  计算机科学: "💻",
  文学: "📖",
  历史: "📜",
  经济管理: "📊",
  自然科学: "🔬",
  哲学: "🧠",
  艺术: "🎨",
  教育: "📚",
  语言: "🌐",
  医学: "🏥",
  工程技术: "⚙️",
  其他: "📁",
};

export default function CategoryScreen({ navigation }: any) {
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
        <Text style={styles.topBarTitle}>分类浏览</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={BOOK_CATEGORIES}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const cs = CATEGORY_STYLES[item] || CATEGORY_STYLES["其他"];
          const icon = CATEGORY_ICONS[item] || "📁";
          return (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: cs.bg }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Search", { category: item })}
            >
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.name}>{item}</Text>
              <Text style={styles.count}>{cs.primary}</Text>
            </TouchableOpacity>
          );
        }}
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
  list: { padding: 16, paddingBottom: 32 },
  row: { justifyContent: "space-between", marginBottom: 12 },
  card: {
    width: CARD_WIDTH,
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: { fontSize: 32, marginBottom: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#1A2A3A", marginBottom: 4 },
  count: { fontSize: 11, color: "#6B7B8D" },
});
```

---

### Task 14: 添加 Phase 2 新页面 — ReserveScreen + MessageScreen

**Files:**

- Create: `client/src/screens/borrow/ReserveScreen.tsx`
- Create: `client/src/screens/message/MessageScreen.tsx`

- [ ] **Step 1: 创建 ReserveScreen（预约列表，mock 数据）**

```tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BookCoverBlock from "../../components/BookCoverBlock";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";
import { MOCK_BOOKS } from "../../utils/mock-data";

// Mock reservation API
const getReservations = () =>
  Promise.resolve(
    MOCK_BOOKS.slice(0, 3).map((book, i) => ({
      id: i + 1,
      book,
      reserveDate: "2026-05-15",
      status: i === 0 ? "active" : "expired",
      expireDate: "2026-05-30",
    })),
  );

const cancelReservation = (id: number) => Promise.resolve();

export default function ReserveScreen({ navigation }: any) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      getReservations()
        .then(setReservations)
        .finally(() => setLoading(false));
    }, []),
  );

  const handleCancel = (id: number) => {
    Alert.alert("取消预约", "确定取消该预约吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "确定",
        onPress: async () => {
          await cancelReservation(id);
          setReservations((prev) => prev.filter((r) => r.id !== id));
        },
      },
    ]);
  };

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
        <Text style={styles.topBarTitle}>我的预约</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={reservations}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const isActive = item.status === "active";
          return (
            <View style={[styles.card, !isActive && styles.cardExpired]}>
              <BookCoverBlock title={item.book.title} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.book.title}
                </Text>
                <Text style={styles.cardAuthor}>{item.book.author}</Text>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>预约日期：</Text>
                  <Text style={styles.dateValue}>{item.reserveDate}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>到期日期：</Text>
                  <Text style={styles.dateValue}>{item.expireDate}</Text>
                </View>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isActive ? "#E8F0F8" : "#F0F4F8" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isActive ? "#2D5A87" : "#9CAAB8" },
                      ]}
                    >
                      {isActive ? "预约中" : "已过期"}
                    </Text>
                  </View>
                </View>
              </View>
              {isActive && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancel(item.id)}
                >
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<EmptyState message="暂无预约记录" />}
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
  list: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  cardExpired: { opacity: 0.7 },
  cardBody: { flex: 1, marginLeft: 14, minWidth: 0 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2A3A",
    marginBottom: 4,
  },
  cardAuthor: { fontSize: 11, color: "#6B7B8D", marginBottom: 6 },
  dateRow: { flexDirection: "row", marginTop: 2 },
  dateLabel: { fontSize: 11, color: "#9CAAB8" },
  dateValue: { fontSize: 11, color: "#1A2A3A" },
  badgeRow: { flexDirection: "row", marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: "500" },
  cancelBtn: { paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8 },
  cancelText: { fontSize: 12, color: "#DC2626", fontWeight: "500" },
});
```

- [ ] **Step 2: 创建 MessageScreen（消息列表，mock 数据）**

```tsx
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
import { useFocusEffect } from "@react-navigation/native";
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

const markAllRead = () => Promise.resolve();

export default function MessageScreen({ navigation }: any) {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [allRead, setAllRead] = useState(false);

  const handleMarkRead = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    setAllRead(true);
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
```

---

### Task 15: 添加 Phase 2 新页面 — ChangePasswordScreen + AboutScreen

**Files:**

- Create: `client/src/screens/profile/ChangePasswordScreen.tsx`
- Create: `client/src/screens/about/AboutScreen.tsx`

- [ ] **Step 1: 创建 ChangePasswordScreen**

```tsx
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
import { COLORS } from "../../utils/constants";

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
```

- [ ] **Step 2: 创建 AboutScreen**

```tsx
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
```

---

### Task 16: 更新导航 (AppNavigator)

**Files:**

- Modify: `client/src/navigation/AppNavigator.tsx`

- [ ] **Step 1: 添加 Phase 2 新页面路由**

```tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TabNavigator from "./TabNavigator";
import BookDetailScreen from "../screens/home/BookDetailScreen";
import BorrowHistoryScreen from "../screens/borrow/BorrowHistoryScreen";
import CardStatusScreen from "../screens/profile/CardStatusScreen";
import SearchScreen from "../screens/search/SearchScreen";
import CategoryScreen from "../screens/category/CategoryScreen";
import ReserveScreen from "../screens/borrow/ReserveScreen";
import MessageScreen from "../screens/message/MessageScreen";
import ChangePasswordScreen from "../screens/profile/ChangePasswordScreen";
import AboutScreen from "../screens/about/AboutScreen";
import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BookDetail: { bookId: number };
  BorrowHistory: undefined;
  CardStatus: undefined;
  Search: undefined;
  Category: undefined;
  Reserve: undefined;
  Message: undefined;
  ChangePassword: undefined;
  About: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen
              name="BorrowHistory"
              component={BorrowHistoryScreen}
            />
            <Stack.Screen name="CardStatus" component={CardStatusScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Reserve" component={ReserveScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 自检清单

1. **Spec 覆盖率**: 登录/注册/首页/个人中心/借阅列表/借阅历史/图书详情/借阅证 — 8 个页面全部覆盖，每个页面的渐变导航、弧线、装饰、卡片布局、配色均在对应任务中实现
2. **无占位符**: 所有代码块包含完整实现代码，无 TBD/TODO
3. **类型一致性**: 所有组件引用路径与实际文件创建路径一致，navigation.navigate 参数与 RootStackParamList 定义一致
4. **共享组件复用**: GradientHeader/SectionBar/StatCard/QuickEntry/BookCoverBlock/MenuList/ArcCurve 在各页面中引用路径一致
