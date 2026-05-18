<template>
  <view class="home-page">
    <!-- ==================== 导航栏 ==================== -->
    <view class="nav-section">
      <!-- 右上角航线虚线装饰 -->
      <view class="nav-dashed-ring"></view>
      <view class="nav-dashed-ring-inner"></view>
      <view class="nav-content">
        <text class="nav-eng">NANCHANG HANGKONG UNIVERSITY</text>
        <text class="nav-title">蓝航图书馆</text>
        <text class="nav-subtitle">日新自强 · 知行合一</text>
      </view>
      <!-- 底部流线型弧线装饰 -->
      <view class="nav-arc"></view>
    </view>

    <!-- ==================== 搜索条 ==================== -->
    <view class="search-section" @click="goSearch">
      <view class="search-bar">
        <view class="search-icon"></view>
        <text class="search-placeholder">搜索书名、作者或关键词</text>
      </view>
    </view>

    <!-- ==================== 快捷入口 ==================== -->
    <view class="quick-section">
      <view class="quick-card" @click="goSearch">
        <view class="quick-icon-wrap">
          <view class="quick-icon compass-icon"></view>
        </view>
        <view class="quick-text-wrap">
          <text class="quick-title">馆藏检索</text>
          <text class="quick-desc">搜索全部馆藏资源</text>
        </view>
      </view>
      <view class="quick-card" @click="goCategory('航空宇航')">
        <view class="quick-icon-wrap">
          <view class="quick-icon plane-icon"></view>
        </view>
        <view class="quick-text-wrap">
          <text class="quick-title">航空特藏</text>
          <text class="quick-desc">航空宇航专业文献</text>
        </view>
      </view>
      <view class="quick-card" @click="goBorrow">
        <view class="quick-icon-wrap">
          <view class="quick-icon book-icon"></view>
        </view>
        <view class="quick-text-wrap">
          <text class="quick-title">我的借阅</text>
          <text class="quick-desc">{{ activeBorrowCount }} 本借阅中</text>
        </view>
      </view>
    </view>

    <!-- ==================== 热门借阅 ==================== -->
    <view class="section">
      <view class="section-header">
        <view class="section-bar"></view>
        <text class="section-title">热门借阅</text>
        <text class="section-more" @click="goBookList">查看全部 →</text>
      </view>
      <view class="hot-book-list">
        <view
          class="book-card"
          v-for="book in hotBooks"
          :key="book.id"
          @click="goDetail(book.id)"
        >
          <view class="book-cover" :style="{ background: book.cover }">
            <text class="book-cover-label">{{ book.shortLabel }}</text>
          </view>
          <view class="book-info">
            <text class="book-title">{{ book.title }}</text>
            <text class="book-author">{{ book.author }}</text>
            <view class="book-meta">
              <text class="book-callno">{{ book.isbn }}</text>
              <text class="book-status" :class="book.status">{{
                book.statusLabel
              }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ==================== 分类浏览 ==================== -->
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
          :style="{ background: cat.bg }"
          @click="goCategory(cat.name)"
        >
          <view class="category-card-inner">
            <text class="category-emoji">{{ cat.emoji }}</text>
            <view class="category-text">
              <text class="category-name">{{ cat.name }}</text>
              <text class="category-count">{{ cat.count }} 册馆藏</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全距离占位 -->
    <view class="bottom-safe"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  allBooks,
  bookCovers,
  categories as catData,
} from "@/utils/mock-data.js";
import { getCategoryTheme } from "@/utils/theme.js";
import { formatBookStatus } from "@/utils/format.js";

const activeBorrowCount = ref(3);
const hotBooks = ref([]);
const categories = ref([]);
const categoryEmojis = {
  航空宇航: "✈",
  人文历史: "📜",
  自然科学: "🔬",
  文学艺术: "🖋",
};

onMounted(() => {
  hotBooks.value = allBooks
    .filter((b) => b.status === "available")
    .slice(0, 4)
    .map((b) => ({
      ...b,
      cover: bookCovers[b.id],
      shortLabel: b.title.slice(0, 4),
      statusLabel: formatBookStatus(b.status),
    }));

  categories.value = catData.map((cat) => {
    const theme = getCategoryTheme(cat.name);
    return {
      ...cat,
      emoji: categoryEmojis[cat.name] || "📚",
      bg: theme.cardGradient,
      borderColor: theme.light + "20",
    };
  });
});

const goSearch = () => uni.navigateTo({ url: "/pages/book/search" });
const goCategory = (name) =>
  uni.navigateTo({
    url: `/pages/book/category?name=${encodeURIComponent(name)}`,
  });
const goDetail = (id) => uni.navigateTo({ url: `/pages/book/detail?id=${id}` });
const goBookList = () => uni.navigateTo({ url: "/pages/book/list" });
const goBorrow = () => uni.switchTab({ url: "/pages/tabbar/borrow/index" });
</script>

<style lang="scss" scoped>
/* ==================== 变量引用 ==================== */
$primary-color: #1e3a5f;
$primary-light: #3d7ab5;
$bg-color: #f0f4f8;
$card-bg: #ffffff;
$text-color: #1a2a3a;
$text-color-secondary: #6b7b8d;
$text-color-hint: #9caab8;
$nav-bg: #1a3350;
$available-bg: #e8f0f8;
$available-text: #2d5a87;
$borrowed-bg: #fef3e4;
$borrowed-text: #b8780a;

/* ==================== 页面基础 ==================== */
.home-page {
  min-height: 100vh;
  background: $bg-color;
}

/* ==================== 导航栏 ==================== */
.nav-section {
  position: relative;
  background: linear-gradient(165deg, $nav-bg 0%, #1e3a5f 60%, #2d5a87 100%);
  padding: 40rpx 32rpx 100rpx;
  overflow: hidden;
}

/* 右上角航线虚线装饰 - 外层大圆 */
.nav-dashed-ring {
  position: absolute;
  top: -120rpx;
  right: -80rpx;
  width: 240rpx;
  height: 240rpx;
  border: 2rpx dashed rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

/* 右上角航线虚线装饰 - 内层小圆 */
.nav-dashed-ring-inner {
  position: absolute;
  top: -60rpx;
  right: -20rpx;
  width: 160rpx;
  height: 160rpx;
  border: 1.5rpx dashed rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.nav-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20rpx;
}

.nav-eng {
  font-size: 20rpx;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 4rpx;
  margin-bottom: 16rpx;
}

.nav-title {
  font-size: 52rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 4rpx;
  margin-bottom: 12rpx;
}

.nav-subtitle {
  font-size: 24rpx;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 6rpx;
}

/* 底部弧线装饰 */
.nav-arc {
  position: absolute;
  bottom: 0;
  left: -5%;
  width: 110%;
  height: 50rpx;
  background: $bg-color;
  border-radius: 60% 60% 0 0;
}

/* ==================== 搜索条 ==================== */
.search-section {
  padding: 0 32rpx;
  margin-top: -36rpx;
  position: relative;
  z-index: 2;
}

.search-bar {
  display: flex;
  align-items: center;
  background: $card-bg;
  border-radius: 48rpx;
  padding: 22rpx 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(26, 51, 80, 0.08);
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  background: $text-color-hint;
  margin-right: 16rpx;
  flex-shrink: 0;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

.search-placeholder {
  font-size: 26rpx;
  color: $text-color-hint;
}

/* ==================== 快捷入口 ==================== */
.quick-section {
  display: flex;
  padding: 24rpx 32rpx;
  gap: 20rpx;
}

.quick-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $card-bg;
  border-radius: 16rpx;
  padding: 24rpx 12rpx 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(26, 51, 80, 0.04);
}

.quick-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.quick-card:nth-child(1) .quick-icon-wrap {
  background: linear-gradient(135deg, #e8f0f8, #dce4f0);
}
.quick-card:nth-child(2) .quick-icon-wrap {
  background: linear-gradient(135deg, #dce8f4, #cdddf0);
}
.quick-card:nth-child(3) .quick-icon-wrap {
  background: linear-gradient(135deg, #e8f0f8, #dce4f0);
}

.quick-icon {
  width: 30rpx;
  height: 30rpx;
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

/* 指南针图标 */
.compass-icon {
  background: $primary-color;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z'/%3E%3C/svg%3E");
}

/* 纸飞机图标 */
.plane-icon {
  background: $primary-color;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L11 13'/%3E%3Cpath d='M22 2l-7 20-4-9-9-4z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 2L11 13'/%3E%3Cpath d='M22 2l-7 20-4-9-9-4z'/%3E%3C/svg%3E");
}

/* 书本图标 */
.book-icon {
  background: $primary-color;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
}

.quick-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: 6rpx;
}

.quick-desc {
  font-size: 20rpx;
  color: $text-color-hint;
}

/* ==================== 通用区块 ==================== */
.section {
  padding: 0 32rpx;
  margin-bottom: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-bar {
  width: 6rpx;
  height: 28rpx;
  background: $primary-color;
  border-radius: 3rpx;
  margin-right: 14rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-color;
  flex: 1;
}

.section-more {
  font-size: 24rpx;
  color: $primary-light;
  font-weight: 400;
}

/* ==================== 热门借阅 书籍卡片 ==================== */
.hot-book-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.book-card {
  display: flex;
  background: $card-bg;
  border-radius: 14rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(26, 51, 80, 0.04);
}

.book-cover {
  width: 110rpx;
  height: 150rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
  overflow: hidden;
}

.book-cover-label {
  font-size: 24rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  writing-mode: vertical-rl;
  letter-spacing: 4rpx;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.book-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $text-color;
  margin-bottom: 8rpx;
  /* 单行省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 22rpx;
  font-weight: 300;
  color: $text-color-secondary;
  margin-bottom: 14rpx;
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.book-callno {
  font-size: 20rpx;
  font-weight: 400;
  color: $text-color-hint;
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 1rpx;
}

.book-status {
  font-size: 20rpx;
  font-weight: 500;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;

  &.available {
    background: $available-bg;
    color: $available-text;
  }

  &.borrowed {
    background: $borrowed-bg;
    color: $borrowed-text;
  }
}

/* ==================== 分类浏览 ==================== */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.category-card {
  border-radius: 14rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(26, 51, 80, 0.04);
}

.category-card-inner {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
}

.category-emoji {
  font-size: 48rpx;
  margin-right: 16rpx;
  line-height: 1;
}

.category-text {
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 28rpx;
  font-weight: 700;
  color: $text-color;
  margin-bottom: 6rpx;
}

.category-count {
  font-size: 20rpx;
  font-weight: 300;
  color: $text-color-secondary;
}

/* ==================== 底部安全距离 ==================== */
.bottom-safe {
  height: 24rpx;
}
</style>
