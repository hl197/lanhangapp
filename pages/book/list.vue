<template>
  <view class="page">
    <!-- 搜索入口条 -->
    <view class="search-bar" @click="goSearch">
      <text class="search-icon">🔍</text>
      <text class="search-placeholder">搜索图书...</text>
    </view>

    <!-- 热门图书区块标题 -->
    <view class="section-header">
      <view class="section-accent" />
      <text class="section-title">热门图书</text>
    </view>

    <!-- 图书列表 -->
    <view class="list">
      <view
        v-for="book in books"
        :key="book.id"
        class="card"
        @click="goDetail(book.id)"
      >
        <view class="card-cover" :style="{ background: book.cover }" />
        <view class="card-body">
          <text class="card-title">{{ book.title }}</text>
          <view class="card-meta">
            <text class="card-author">{{ book.author }}</text>
            <text class="card-category">{{ book.category }}</text>
          </view>
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
import { formatBookStatus } from "@/utils/format.js";

const books = ref([]);

onMounted(() => {
  books.value = allBooks.map((b) => ({
    ...b,
    cover: bookCovers[b.id] || "",
    statusLabel: formatBookStatus(b.status),
  }));
});

const goSearch = () => {
  uni.navigateTo({ url: "/pages/book/search" });
};

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/book/detail?id=${id}` });
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 0 32rpx;
}

/* ========== 搜索入口 ========== */
.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 22rpx 28rpx;
  margin-top: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.search-icon {
  font-size: 28rpx;
  margin-right: 16rpx;
  opacity: 0.5;
}

.search-placeholder {
  font-size: 26rpx;
  color: #9caab8;
}

/* ========== 区块标题 ========== */
.section-header {
  display: flex;
  align-items: center;
  margin-top: 40rpx;
  margin-bottom: 24rpx;
}

.section-accent {
  width: 6rpx;
  height: 32rpx;
  background: #3d7ab5;
  border-radius: 3rpx;
  margin-right: 14rpx;
  flex-shrink: 0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a2a3a;
  letter-spacing: 1rpx;
}

/* ========== 列表 ========== */
.list {
  padding-bottom: 32rpx;
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

.card-meta {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-bottom: 12rpx;
}

.card-author {
  font-size: 22rpx;
  font-weight: 300;
  color: #6b7b8d;
}

.card-category {
  font-size: 20rpx;
  font-weight: 400;
  color: #9caab8;
  background: #e8f0f8;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
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
</style>
