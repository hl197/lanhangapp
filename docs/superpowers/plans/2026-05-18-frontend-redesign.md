# 蓝航图书馆前端重设计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 uni-app 图书馆 App 的 16 个页面统一为航空蓝图主题，消除代码重复，接入 API 层。

**Architecture:** 新增 3 个共享模块（mock-data.js、theme.js、icons.js）消除跨页面重复；更新 uni.scss 设计系统；各页面引用统一模块并重写样式；API 层接入页面数据加载，失败时 fallback 到 mock 数据。

**Tech Stack:** uni-app (Vue 3 Composition API, `<script setup>`), SCSS, HBuilderX

---

### Task 1: 更新设计系统 （uni.scss）

**Files:**

- Modify: `uni.scss` — 完整替换

- [ ] **Step 1: 替换 uni.scss 全部内容**

```scss
/* ==================== 航空蓝图 · 设计系统 ==================== */

/* 主色调 */
$primary-color: #1e3a5f;
$primary-light: #3d7ab5;
$primary-bg: #e8f0f8;

/* 语义色 */
$success-color: #059669;
$success-light: #d1fae5;
$warning-color: #d97706;
$warning-light: #fef3e4;
$error-color: #dc2626;
$error-light: #fee2e2;

/* 文字颜色 */
$text-color: #1a2a3a;
$text-color-secondary: #6b7b8d;
$text-color-hint: #9caab8;

/* 背景和边框 */
$border-color: #e5e7eb;
$bg-color: #f0f4f8;
$card-bg: #ffffff;

/* 间距系统 */
$spacing-xs: 8rpx;
$spacing-sm: 16rpx;
$spacing-base: 24rpx;
$spacing-lg: 32rpx;
$spacing-xl: 48rpx;

/* 圆角 */
$radius-sm: 4rpx;
$radius-base: 10rpx;
$radius-lg: 14rpx;
$radius-xl: 24rpx;

/* 阴影 */
$shadow-card: 0 2rpx 12rpx rgba(26, 51, 80, 0.04);
$shadow-lg: 0 4rpx 20rpx rgba(26, 51, 80, 0.08);
```

- [ ] **Step 2: 验证** — 打开项目确认 uni.scss 已更新，变量可被其他页面引用

---

### Task 2: 新增主题常量模块

**Files:**

- Create: `utils/theme.js`

- [ ] **Step 1: 创建 utils/theme.js**

```js
export const BASE_THEME = {
  primary: "#1E3A5F",
  primaryLight: "#3D7AB5",
  primaryBg: "#E8F0F8",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  text: "#1A2A3A",
  textSecondary: "#6B7B8D",
  textHint: "#9CAAB8",
  navBg: "#1A3350",
  availableBg: "#E8F0F8",
  availableText: "#2D5A87",
  borrowedBg: "#FEF3E4",
  borrowedText: "#B8780A",
};

export const CATEGORY_THEMES = {
  航空宇航: {
    primary: "#1E3A5F",
    light: "#3D7AB5",
    bg: "#F0F4F8",
    cardGradient: "linear-gradient(150deg, #E8F0F8, #DCE8F4)",
    decoration: "aviation",
  },
  人文历史: {
    primary: "#5C3D2E",
    light: "#C9A96E",
    bg: "#FAF7F0",
    cardGradient: "linear-gradient(150deg, #FAF7F0, #F5EDD8)",
    decoration: "history",
  },
  自然科学: {
    primary: "#2C5F7C",
    light: "#5AA3BF",
    bg: "#FAFBFC",
    cardGradient: "linear-gradient(150deg, #FFFFFF, #F4F8FA)",
    decoration: "science",
  },
  文学艺术: {
    primary: "#6B2D3B",
    light: "#C06070",
    bg: "#FDF8F5",
    cardGradient: "linear-gradient(150deg, #FDF5F6, #FAE8EC)",
    decoration: "literature",
  },
};

export function getCategoryTheme(categoryName) {
  return CATEGORY_THEMES[categoryName] || CATEGORY_THEMES["航空宇航"];
}
```

- [ ] **Step 2: 验证** — 文件语法正确，导出可被其他模块导入

---

### Task 3: 新增 SVG 图标模块

**Files:**

- Create: `utils/icons.js`

- [ ] **Step 1: 创建 utils/icons.js**

```js
// SVG 图标 data URI —— 航空主题
// 所有图标颜色通过 CSS mask-image + background-color 控制

export const ICONS = {
  // 指南针 —— 馆藏检索
  compass: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='21' stroke='currentColor' stroke-width='1.5'/%3E%3Ccircle cx='24' cy='24' r='18' stroke='currentColor' stroke-width='1' opacity='0.3'/%3E%3Cpath d='M24 6L28 24L24 42L20 24Z' fill='currentColor' opacity='0.15'/%3E%3Cpath d='M24 10L26.5 24L24 38L21.5 24Z' fill='currentColor'/%3E%3Ccircle cx='24' cy='24' r='2' fill='white'/%3E%3C/svg%3E`,

  // 纸飞机 —— 航空特藏 / 借阅
  plane: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'%3E%3Cpath d='M6 28L24 14L42 28L30 26L24 34L18 26Z' fill='currentColor' opacity='0.2' stroke='currentColor' stroke-width='0.8'/%3E%3Cpath d='M24 14L20 38L24 34L28 38Z' fill='currentColor' opacity='0.15'/%3E%3C/svg%3E`,

  // 书本 —— 我的借阅
  book: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none'%3E%3Crect x='10' y='8' width='28' height='34' rx='3' stroke='currentColor' stroke-width='1.2'/%3E%3Cline x1='14' y1='14' x2='34' y2='14' stroke='currentColor' stroke-width='1' opacity='0.5'/%3E%3Cline x1='14' y1='20' x2='30' y2='20' stroke='currentColor' stroke-width='1' opacity='0.3'/%3E%3Cline x1='14' y1='26' x2='32' y2='26' stroke='currentColor' stroke-width='1' opacity='0.3'/%3E%3C/svg%3E`,

  // 搜索
  search: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E`,

  // 用户
  user: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E`,

  // 首页
  home: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/%3E%3C/svg%3E`,
};

// 分类装饰 SVG（用于分类卡片背景）
export const CATEGORY_DECORATIONS = {
  aviation: `data:image/svg+xml,...`, // 飞机轮廓
  history: `data:image/svg+xml,...`, // 卷轴
  science: `data:image/svg+xml,...`, // 同心圆
  literature: `data:image/svg+xml,...`, // 菱形花瓣
};
```

- [ ] **Step 2: 验证** — 文件语法正确

---

### Task 4: 提取统一 Mock 数据模块

**Files:**

- Create: `utils/mock-data.js`

- [ ] **Step 1: 从 search.vue 提取 allBooks 数组到 mock-data.js**

```js
// 统一的 Mock 数据 —— 项目中 mock 数据的唯一来源

export const allBooks = [
  {
    id: "1",
    title: "活着",
    author: "余华",
    category: "文学艺术",
    isbn: "9787530215313",
    publisher: "北京十月文艺出版社",
    year: "2017",
    status: "available",
  },
  {
    id: "2",
    title: "三体",
    author: "刘慈欣",
    category: "文学艺术",
    isbn: "9787536692930",
    publisher: "重庆出版社",
    year: "2008",
    status: "borrowed",
  },
  {
    id: "3",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    category: "文学艺术",
    isbn: "9787544253994",
    publisher: "南海出版公司",
    year: "2011",
    status: "available",
  },
  {
    id: "4",
    title: "Python编程：从入门到实践",
    author: "Eric Matthes",
    category: "自然科学",
    isbn: "9787115546081",
    publisher: "人民邮电出版社",
    year: "2020",
    status: "available",
  },
  {
    id: "5",
    title: "空气动力学基础",
    author: "J.D. Anderson",
    category: "航空宇航",
    isbn: "9787516501236",
    publisher: "航空工业出版社",
    year: "2019",
    status: "available",
  },
  {
    id: "6",
    title: "航空发动机原理",
    author: "彭泽琰",
    category: "航空宇航",
    isbn: "9787561223451",
    publisher: "西北工业大学出版社",
    year: "2015",
    status: "borrowed",
  },
  {
    id: "7",
    title: "飞行器结构设计",
    author: "王志刚",
    category: "航空宇航",
    isbn: "9787516504567",
    publisher: "航空工业出版社",
    year: "2018",
    status: "available",
  },
  {
    id: "8",
    title: "中国航空工业史",
    author: "《中国航空工业史》编修办公室",
    category: "航空宇航",
    isbn: "9787516507896",
    publisher: "航空工业出版社",
    year: "2016",
    status: "available",
  },
  {
    id: "9",
    title: "史记",
    author: "司马迁",
    category: "人文历史",
    isbn: "9787101051397",
    publisher: "中华书局",
    year: "2013",
    status: "available",
  },
  {
    id: "10",
    title: "全球通史",
    author: "斯塔夫里阿诺斯",
    category: "人文历史",
    isbn: "9787301127452",
    publisher: "北京大学出版社",
    year: "2006",
    status: "borrowed",
  },
  {
    id: "11",
    title: "万历十五年",
    author: "黄仁宇",
    category: "人文历史",
    isbn: "9787108009821",
    publisher: "三联书店",
    year: "2014",
    status: "available",
  },
  {
    id: "12",
    title: "高等数学",
    author: "同济大学数学系",
    category: "自然科学",
    isbn: "9787040523546",
    publisher: "高等教育出版社",
    year: "2019",
    status: "available",
  },
  {
    id: "13",
    title: "大学物理",
    author: "马文蔚",
    category: "自然科学",
    isbn: "9787040239010",
    publisher: "高等教育出版社",
    year: "2018",
    status: "available",
  },
  {
    id: "14",
    title: "普通化学原理",
    author: "华彦",
    category: "自然科学",
    isbn: "9787301201228",
    publisher: "北京大学出版社",
    year: "2017",
    status: "available",
  },
  {
    id: "15",
    title: "围城",
    author: "钱钟书",
    category: "文学艺术",
    isbn: "9787020055388",
    publisher: "人民文学出版社",
    year: "2015",
    status: "available",
  },
  {
    id: "16",
    title: "平凡的世界",
    author: "路遥",
    category: "文学艺术",
    isbn: "9787530212008",
    publisher: "北京十月文艺出版社",
    year: "2013",
    status: "borrowed",
  },
];

// 书籍封面渐变色映射
export const bookCovers = {
  1: "linear-gradient(160deg, #6B2D3B 0%, #A0455A 100%)",
  2: "linear-gradient(160deg, #1E3A5F 0%, #3D7AB5 100%)",
  3: "linear-gradient(160deg, #8B3A4A 0%, #C06070 100%)",
  4: "linear-gradient(160deg, #2C5F7C 0%, #5AA3BF 100%)",
  5: "linear-gradient(160deg, #1A3350 0%, #2D5A87 60%, #3D7AB5 100%)",
  6: "linear-gradient(160deg, #2D5A87 0%, #3D7AB5 60%, #6AADE0 100%)",
  7: "linear-gradient(160deg, #1E3A5F 0%, #4A8ABF 100%)",
  8: "linear-gradient(160deg, #3D7AB5 0%, #7AB8E8 100%)",
  9: "linear-gradient(160deg, #5C3D2E 0%, #8B6914 100%)",
  10: "linear-gradient(160deg, #6B4C3B 0%, #A0825A 100%)",
  11: "linear-gradient(160deg, #8B6914 0%, #C9A96E 100%)",
  12: "linear-gradient(160deg, #1A3A2A 0%, #2D6B4F 100%)",
  13: "linear-gradient(160deg, #2D6B4F 0%, #4A9E6E 100%)",
  14: "linear-gradient(160deg, #3A7D5A 0%, #6DBA8A 100%)",
  15: "linear-gradient(160deg, #6B2D3B 0%, #A0455A 100%)",
  16: "linear-gradient(160deg, #8B3A4A 0%, #C06070 100%)",
};

// 快捷查询：id → {title, author, category}
export const bookInfoMap = Object.fromEntries(
  allBooks.map((b) => [
    b.id,
    { title: b.title, author: b.author, category: b.category },
  ]),
);

// 分类列表（含主题信息）
export const categories = [
  { name: "航空宇航", icon: "plane", count: 2430 },
  { name: "人文历史", icon: "history", count: 8120 },
  { name: "自然科学", icon: "science", count: 5600 },
  { name: "文学艺术", icon: "literature", count: 10500 },
];
```

- [ ] **Step 2: 验证** — 确认 allBooks 包含 search.vue 中原有的全部 16 本书数据

---

### Task 5: 更新 format.js 补充函数

**Files:**

- Modify: `utils/format.js`

- [ ] **Step 1: 追加 isOverdue 函数**

在 `utils/format.js` 末尾追加:

```js
export const isOverdue = (dueDate) => {
  return getDaysRemaining(dueDate) < 0;
};
```

- [ ] **Step 2: 验证** — 文件语法正确

---

### Task 6: 接入 API 层到页面数据加载

**Files:**

- Modify: `api/index.js` — 添加 mock fallback

- [ ] **Step 1: 更新 api/index.js，为每个 API 方法添加 mock fallback**

在 `api/index.js` 末尾追加带 fallback 的导出:

```js
import {
  allBooks,
  bookInfoMap,
  categories as mockCategories,
} from "../utils/mock-data.js";

// API 调用包装器：失败时 fallback 到 mock 数据
const apiWithFallback = (apiCall, fallbackData) => {
  return apiCall().catch(() => {
    console.warn("API 不可用，使用本地数据");
    return typeof fallbackData === "function" ? fallbackData() : fallbackData;
  });
};

// 为所有 API 方法添加 fallback
export const safeApi = {
  // 书籍
  search: (params) =>
    apiWithFallback(
      () => bookApi.search(params),
      () => {
        const { keyword, category } = params || {};
        let result = allBooks;
        if (keyword)
          result = result.filter(
            (b) => b.title.includes(keyword) || b.author.includes(keyword),
          );
        if (category) result = result.filter((b) => b.category === category);
        return { data: result };
      },
    ),
  getBookById: (id) =>
    apiWithFallback(
      () => bookApi.getById(id),
      () => ({ data: allBooks.find((b) => b.id === id) }),
    ),
  getCategories: () =>
    apiWithFallback(
      () => bookApi.getCategories(),
      () => ({ data: mockCategories }),
    ),
  getByCategory: (categoryName) =>
    apiWithFallback(
      () => bookApi.getByCategory(categoryName),
      () => ({ data: allBooks.filter((b) => b.category === categoryName) }),
    ),
};
```

- [ ] **Step 2: 验证** — 文件语法正确，导入路径有效

---

### Task 7: 清理无用页面

**Files:**

- Delete: `pages/index/index.vue`
- Delete: `pages/user/personal.vue`
- Modify: `pages.json` — 移除对应路由

- [ ] **Step 1: 删除 pages/index/index.vue**
- [ ] **Step 2: 删除 pages/user/personal.vue**
- [ ] **Step 3: 从 pages.json 移除 pages/user/personal 路由条目**

删除 pages.json 中以下内容:

```json
{
  "path": "pages/user/personal",
  "style": {
    "navigationBarTitleText": "个人中心"
  }
},
```

- [ ] **Step 4: 更新 pages.json 全局导航栏配置**

将 `globalStyle` 改为:

```json
"globalStyle": {
  "navigationBarTextStyle": "white",
  "navigationBarTitleText": "蓝航图书馆",
  "navigationBarBackgroundColor": "#1E3A5F",
  "backgroundColor": "#F0F4F8"
}
```

将 tabBar 颜色改为:

```json
"tabBar": {
  "color": "#9CAAB8",
  "selectedColor": "#3D7AB5",
  "borderStyle": "white",
  "backgroundColor": "#FFFFFF",
  ...
}
```

- [ ] **Step 5: 验证** — 确认 pages.json 语法正确，无引用已删除页面的路由

---

### Task 8: 重做首页 （tabbar/home/index.vue）

**Files:**

- Modify: `pages/tabbar/home/index.vue` — 完整重写

- [ ] **Step 1: 重写 template**

```html
<template>
  <view class="home">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-arc"></view>
      <view class="nav-content">
        <text class="nav-eng">NANCHANG HANGKONG UNIVERSITY</text>
        <text class="nav-title">蓝航图书馆</text>
        <text class="nav-sub">日新自强 · 知行合一</text>
      </view>
    </view>

    <!-- 搜索条 -->
    <view class="search-wrap" @click="goSearch">
      <view class="search-bar">
        <view class="search-icon"></view>
        <text class="search-placeholder">搜索书名、作者或索书号...</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="quick-item" @click="goSearch">
        <view class="quick-icon"><view class="icon-compass"></view></view>
        <text class="quick-label">馆藏检索</text>
        <text class="quick-desc">探索知识</text>
      </view>
      <view class="quick-item" @click="goCategory('航空宇航')">
        <view class="quick-icon"><view class="icon-plane"></view></view>
        <text class="quick-label">航空特藏</text>
        <text class="quick-desc">飞行史料</text>
      </view>
      <view class="quick-item" @click="goBorrow">
        <view class="quick-icon"><view class="icon-book"></view></view>
        <text class="quick-label">我的借阅</text>
        <text class="quick-desc">{{ activeBorrowCount }}本在借</text>
      </view>
    </view>

    <!-- 热门图书 -->
    <view class="section">
      <view class="section-header">
        <view class="section-bar"></view>
        <text class="section-title">热门借阅</text>
        <text class="section-more" @click="goBookList">查看全部 →</text>
      </view>
      <view class="book-list">
        <view
          class="book-card"
          v-for="book in hotBooks"
          :key="book.id"
          @click="goDetail(book.id)"
        >
          <view class="book-cover" :style="{ background: book.cover }">
            <text class="cover-label">{{ book.shortLabel }}</text>
          </view>
          <view class="book-info">
            <text class="book-title">{{ book.title }}</text>
            <text class="book-author">{{ book.author }}</text>
            <view class="book-meta">
              <text class="book-status" :class="book.status"
                >{{ book.statusLabel }}</text
              >
              <text class="book-isbn">{{ book.isbn }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分类浏览 -->
    <view class="section">
      <view class="section-header">
        <view class="section-bar"></view>
        <text class="section-title">分类浏览</text>
      </view>
      <view class="category-grid">
        <view
          class="category-card"
          v-for="cat in categories"
          :key="cat.name"
          :style="{ background: cat.bg, borderColor: cat.borderColor }"
          @click="goCategory(cat.name)"
        >
          <view class="cat-icon">{{ cat.emoji }}</view>
          <text class="cat-name">{{ cat.name }}</text>
          <text class="cat-count">{{ cat.count }}册</text>
        </view>
      </view>
    </view>
  </view>
</template>
```

- [ ] **Step 2: 重写 script setup**

```js
<script setup>
import { ref, onMounted } from 'vue';
import { allBooks, bookCovers, categories as catData } from '@/utils/mock-data.js';
import { getCategoryTheme } from '@/utils/theme.js';
import { formatBookStatus } from '@/utils/format.js';

const activeBorrowCount = ref(3);

const hotBooks = ref([]);

const categories = ref([]);

onMounted(() => {
  hotBooks.value = allBooks.filter(b => b.status === 'available').slice(0, 4).map(b => ({
    ...b,
    cover: bookCovers[b.id] || 'linear-gradient(160deg, #1E3A5F, #3D7AB5)',
    shortLabel: b.title.slice(0, 4),
    statusLabel: formatBookStatus(b.status),
  }));

  categories.value = catData.map(cat => {
    const theme = getCategoryTheme(cat.name);
    return {
      ...cat,
      emoji: { '航空宇航': '✈', '人文历史': '📜', '自然科学': '🔬', '文学艺术': '🖋' }[cat.name] || '📚',
      bg: theme.cardGradient,
      borderColor: theme.light + '20',
    };
  });
});

const goSearch = () => uni.navigateTo({ url: '/pages/book/search' });
const goCategory = (name) => uni.navigateTo({ url: `/pages/book/category?name=${encodeURIComponent(name)}` });
const goDetail = (id) => uni.navigateTo({ url: `/pages/book/detail?id=${id}` });
const goBookList = () => uni.navigateTo({ url: '/pages/book/list' });
const goBorrow = () => uni.switchTab({ url: '/pages/tabbar/borrow/index' });
</script>
```

- [ ] **Step 3: 重写 style（使用新的设计系统变量）**

样式遵循设计规范：`$primary-color`、`$primary-light`、`$bg-color` 等变量来自 uni.scss，卡片圆角 14rpx，间距 24rpx，阴影 `$shadow-card`。

- [ ] **Step 4: 验证** — 在 HBuilderX 中预览首页，确认视觉与 mockup 一致

---

### Task 9-14: 第一梯队核心页面

由于篇幅限制，每个页面遵循统一的改造模式，以下给出模式说明和关键差异：

**统一模式（每个页面）：**

1. 引入 `import { allBooks, bookCovers, bookInfoMap } from '@/utils/mock-data.js'`
2. 引入 `import { BASE_THEME } from '@/utils/theme.js'` 用于页面级常量
3. 引入 `import { formatDate, formatBookStatus, formatBorrowStatus, getDaysRemaining } from '@/utils/format.js'`
4. 移除所有内联的 mock 数据数组、状态映射函数、日期格式化函数
5. 背景统一为 `#F0F4F8`，卡片统一为白色 + 14px 圆角 + `$shadow-card` 阴影
6. 列表卡片左侧 3px `#3D7AB5` 竖线装饰

**各页面特殊处理：**

| Task | 页面     | 文件                              | 特殊处理                                     |
| ---- | -------- | --------------------------------- | -------------------------------------------- |
| 9    | 借阅 tab | `pages/tabbar/borrow/index.vue`   | 统计卡片（在借/逾期/历史），续借/归还按钮    |
| 10   | 个人 tab | `pages/tabbar/personal/index.vue` | 用户信息卡 + 菜单列表，航拍主题装饰弧线      |
| 11   | 登录     | `pages/user/login.vue`            | LOGO 区 + 校训，渐变背景 (#1A3350 → #1E3A5F) |
| 12   | 搜索     | `pages/book/search.vue`           | 搜索栏新样式，筛选标签，结果列表卡片         |
| 13   | 详情     | `pages/book/detail.vue`           | 书籍信息 + 借阅/预约按钮，底部固定操作栏     |
| 14   | 注册     | `pages/user/register.vue`         | 统一表单样式，与登录页配色一致               |

- [ ] **每个任务的验证** — 在 HBuilderX 中预览对应页面，确认视觉正确

---

### Task 15-20: 第二梯队功能页面

| Task | 页面     | 文件                            | 关键点                                                |
| ---- | -------- | ------------------------------- | ----------------------------------------------------- |
| 15   | 借阅证   | `pages/user/cardStatus.vue`     | 卡片式借阅证 UI，蓝色边框，航空主题装饰               |
| 16   | 改密     | `pages/user/changePassword.vue` | 表单统一样式                                          |
| 17   | 分类     | `pages/book/category.vue`       | 根据 `categoryName` 参数动态切换 `getCategoryTheme()` |
| 18   | 热门     | `pages/book/list.vue`           | 列表卡片统一新样式                                    |
| 19   | 消息     | `pages/message/list.vue`        | 已读/未读状态标记，蓝色圆点未读指示器                 |
| 20   | 借阅列表 | `pages/borrow/list.vue`         | 与借阅 tab 样式一致，增加统计卡片                     |

- [ ] **每个任务的验证** — 预览确认视觉正确

---

### Task 21-24: 第三梯队次要页面

| Task | 页面     | 文件                       | 关键点                                                                              |
| ---- | -------- | -------------------------- | ----------------------------------------------------------------------------------- |
| 21   | 借阅历史 | `pages/borrow/history.vue` | 已归还列表，借阅时长展示                                                            |
| 22   | 预约列表 | `pages/reserve/list.vue`   | 预约状态标签，取消操作                                                              |
| 23   | 关于     | `pages/user/about.vue`     | 大学信息、校训、功能特性列表                                                        |
| 24   | 导航统一 | `pages.json`               | 所有子页面 `navigationBarBackgroundColor: #1E3A5F`、`navigationBarTextStyle: white` |

- [ ] **每个任务的验证** — 预览确认视觉正确

---

### Task 25: 最终验证

- [ ] **全页面检查** — 遍历所有 16 个页面，确认：
  - 配色统一为航空蓝图主题
  - 无内联 mock 数据（全部来自 mock-data.js）
  - 无重复的工具函数（全部来自 format.js）
  - 导航栏统一为深蓝背景白色文字
  - 无残留的旧样式颜色（#374151、#1F2937、#F9FAFB 等）

---

## 执行顺序依赖

```
Task 1 (uni.scss) → Task 2,3,4,5 (utils) → Task 6 (API fallback)
                                              ↓
Task 7 (清理) → Task 8-14 (核心页面) → Task 15-20 (功能页面) → Task 21-24 (次要页面)
                                                                      ↓
                                                               Task 25 (最终验证)
```

Task 1-6 是基础设施，必须最先完成。Task 7（清理）完成后才能开始页面改造。核心页面优先于次要页面。
