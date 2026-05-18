<template>
  <view class="page">
    <!-- 分类主题色渐变横幅 -->
    <view
      class="banner"
      :style="{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.light})`,
      }"
    >
      <view class="banner-inner">
        <text class="banner-icon">{{ categoryIcon }}</text>
        <text class="banner-name">{{ categoryName }}</text>
        <text class="banner-count">共 {{ books.length }} 本图书</text>
      </view>
      <view class="banner-arc" />
    </view>

    <!-- 书籍列表 -->
    <view class="list">
      <view v-if="books.length === 0" class="empty">
        <text class="empty-icon">📚</text>
        <text class="empty-text">该分类暂无图书</text>
      </view>

      <view
        v-for="book in books"
        :key="book.id"
        class="card"
        @click="goDetail(book.id)"
      >
        <view class="card-cover" :style="{ background: book.cover }" />
        <view class="card-body">
          <text class="card-title">{{ book.title }}</text>
          <text class="card-author">{{ book.author }}</text>
          <view class="card-footer">
            <text
              class="card-status"
              :class="
                book.status === 'available' ? 'tag-available' : 'tag-borrowed'
              "
              >{{ book.statusLabel }}</text
            >
            <text class="card-isbn">{{ book.isbn }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { allBooks, bookCovers } from "@/utils/mock-data.js";
import { getCategoryTheme } from "@/utils/theme.js";
import { formatBookStatus } from "@/utils/format.js";

const emojiMap = {
  aviation: "✈️",
  history: "📜",
  science: "🔬",
  literature: "📖",
};

const categoryName = ref("");
const categoryIcon = ref("📚");
const theme = ref({ primary: "#1E3A5F", light: "#3D7AB5" });
const books = ref([]);

onMounted(() => {
  const pages = getCurrentPages();
  const name = pages[pages.length - 1].options.name || "航空宇航";
  categoryName.value = decodeURIComponent(name);

  const t = getCategoryTheme(categoryName.value);
  theme.value = t;
  categoryIcon.value = emojiMap[t.decoration] || "📚";

  books.value = allBooks
    .filter((b) => b.category === categoryName.value)
    .map((b) => ({
      ...b,
      cover: bookCovers[b.id] || "",
      statusLabel: formatBookStatus(b.status),
    }));
});

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/book/detail?id=${id}` });
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
}

/* ========== 横幅 ========== */
.banner {
  position: relative;
  padding: 36rpx 32rpx 60rpx;
  overflow: hidden;
}

.banner-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.banner-icon {
  font-size: 56rpx;
  margin-bottom: 12rpx;
}

.banner-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
  margin-bottom: 8rpx;
}

.banner-count {
  font-size: 24rpx;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
}

.banner-arc {
  position: absolute;
  bottom: -2rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 130%;
  height: 48rpx;
  background: #f0f4f8;
  border-radius: 50%;
}

/* ========== 列表 ========== */
.list {
  padding: 8rpx 32rpx 32rpx;
}

/* ========== 卡片 ========== */
.card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 14rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.card-cover {
  width: 96rpx;
  height: 128rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a2a3a;
  margin-bottom: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-author {
  font-size: 22rpx;
  font-weight: 300;
  color: #6b7b8d;
  margin-bottom: 12rpx;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.card-status {
  font-size: 20rpx;
  font-weight: 500;
  padding: 4rpx 14rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.tag-available {
  background: #e8f0f8;
  color: #2d5a87;
}

.tag-borrowed {
  background: #fef3e4;
  color: #b8780a;
}

.card-isbn {
  font-size: 20rpx;
  font-weight: 400;
  color: #9caab8;
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 1rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ========== 空状态 ========== */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 96rpx;
  margin-bottom: 24rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 28rpx;
  color: #9caab8;
}
</style>
