<template>
  <view class="search-page">
    <!-- 搜索输入条 -->
    <view class="search-bar">
      <view class="search-icon"></view>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="搜索书名、作者或索书号..."
        placeholder-style="color: #9CAAB8"
      />
      <view class="clear-btn" v-if="keyword" @click="keyword = ''">
        <view class="clear-icon"></view>
      </view>
    </view>

    <!-- 分类筛选标签 -->
    <scroll-view scroll-x class="category-filter" :show-scrollbar="false">
      <view class="filter-scroll">
        <view
          class="category-tag"
          :class="{ active: selectedCategory === '' }"
          @click="selectedCategory = ''"
          >全部</view
        >
        <view
          v-for="cat in categories"
          :key="cat"
          class="category-tag"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
          >{{ cat }}</view
        >
      </view>
    </scroll-view>

    <!-- 热门搜索（未输入关键词时） -->
    <view class="hot-section" v-if="!keyword">
      <text class="section-title">热门搜索</text>
      <view class="hot-tags">
        <view
          v-for="tag in hotTags"
          :key="tag"
          class="hot-tag"
          @click="keyword = tag"
          >{{ tag }}</view
        >
      </view>
    </view>

    <!-- 搜索结果（输入关键词后） -->
    <view class="result-section" v-if="keyword">
      <view class="result-header">
        <text class="result-count">找到 {{ filteredBooks.length }} 本书</text>
        <view class="sort-btn" @click="toggleSort">
          <view class="sort-icon"></view>
          <text class="sort-text">{{ sortLabel }}</text>
        </view>
      </view>

      <!-- 结果列表 -->
      <view class="book-list" v-if="filteredBooks.length > 0">
        <view
          v-for="book in filteredBooks"
          :key="book.id"
          class="book-card"
          @click="goDetail(book.id)"
        >
          <view class="book-cover" :style="{ background: book.cover }"></view>
          <view class="book-info">
            <text class="book-title">{{ book.title }}</text>
            <text class="book-author">{{ book.author }}</text>
            <view class="book-meta">
              <view
                class="status-tag"
                :class="book.status === 'available' ? 'available' : 'borrowed'"
                >{{ book.statusLabel }}</view
              >
              <text class="call-number">{{ book.isbn }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <view class="empty-icon"></view>
        <text class="empty-text">未找到相关图书</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  allBooks,
  bookCovers,
  categories as categoryList,
} from "@/utils/mock-data.js";
import { formatBookStatus } from "@/utils/format.js";

const keyword = ref("");
const selectedCategory = ref("");
const sortType = ref("default");

const hotTags = ["活着", "三体", "航空", "Python", "历史", "数学"];
const categories = categoryList.map((c) => c.name);

const sortLabel = computed(() => {
  const map = { default: "默认", newest: "最新", hottest: "最热" };
  return map[sortType.value] || "默认";
});

const filteredBooks = computed(() => {
  let result = allBooks;

  if (keyword.value) {
    const kw = keyword.value;
    result = result.filter(
      (b) =>
        b.title.includes(kw) || b.author.includes(kw) || b.isbn.includes(kw),
    );
  }

  if (selectedCategory.value) {
    result = result.filter((b) => b.category === selectedCategory.value);
  }

  if (sortType.value === "newest") {
    result = [...result].sort(
      (a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0),
    );
  } else if (sortType.value === "hottest") {
    result = [...result].sort(
      (a, b) =>
        (a.status === "available" ? -1 : 1) -
        (b.status === "available" ? -1 : 1),
    );
  }

  return result.map((b) => ({
    ...b,
    cover:
      bookCovers[b.id] || "linear-gradient(160deg, #1E3A5F 0%, #3D7AB5 100%)",
    statusLabel: formatBookStatus(b.status),
  }));
});

const sortOrders = ["default", "newest", "hottest"];
const toggleSort = () => {
  const idx = sortOrders.indexOf(sortType.value);
  sortType.value = sortOrders[(idx + 1) % sortOrders.length];
};

const goDetail = (id) => {
  uni.navigateTo({ url: `/pages/book/detail?id=${id}` });
};
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20rpx 24rpx;
}

/* 搜索条 */
.search-bar {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 0 24rpx;
  height: 80rpx;
  margin-bottom: 20rpx;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
  margin-right: 16rpx;
  border: 3rpx solid #9caab8;
  border-radius: 50%;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    width: 16rpx;
    height: 3rpx;
    background: #9caab8;
    transform: rotate(45deg);
    bottom: -8rpx;
    right: -8rpx;
    border-radius: 2rpx;
  }
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #1a2a3a;
}

.clear-btn {
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8rpx;
}

.clear-icon {
  width: 28rpx;
  height: 28rpx;
  background: #9caab8;
  border-radius: 50%;
  position: relative;
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 16rpx;
    height: 2rpx;
    background: #ffffff;
    top: 50%;
    left: 50%;
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

/* 分类筛选 */
.category-filter {
  white-space: nowrap;
  margin-bottom: 20rpx;
}

.filter-scroll {
  display: inline-flex;
  gap: 16rpx;
}

.category-tag {
  display: inline-block;
  font-size: 24rpx;
  font-weight: 500;
  color: #6b7b8d;
  background: #ffffff;
  padding: 12rpx 28rpx;
  border-radius: 24rpx;
  white-space: nowrap;
  transition: all 0.2s;

  &.active {
    background: #1e3a5f;
    color: #ffffff;
  }
}

/* 热门搜索 */
.hot-section {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1a2a3a;
  display: block;
  margin-bottom: 20rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  font-size: 24rpx;
  color: #2d5a87;
  background: #e8f0f8;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
}

/* 搜索结果 */
.result-section {
  padding-top: 4rpx;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.result-count {
  font-size: 26rpx;
  color: #6b7b8d;
}

.sort-btn {
  display: flex;
  align-items: center;
  padding: 8rpx 16rpx;
}

.sort-icon {
  width: 28rpx;
  height: 28rpx;
  background: #6b7b8d;
  margin-right: 8rpx;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z'/%3E%3C/svg%3E");
  mask-size: 100%;
  -webkit-mask-size: 100%;
}

.sort-text {
  font-size: 26rpx;
  color: #6b7b8d;
}

/* 书籍卡片 */
.book-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.book-card {
  display: flex;
  background: #ffffff;
  border-radius: 14rpx;
  padding: 24rpx;
  align-items: center;
}

.book-cover {
  width: 100rpx;
  height: 130rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.book-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a2a3a;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 22rpx;
  font-weight: 300;
  color: #6b7b8d;
  margin-bottom: 12rpx;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.status-tag {
  font-size: 20rpx;
  font-weight: 500;
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
  flex-shrink: 0;

  &.available {
    background: #e8f0f8;
    color: #2d5a87;
  }

  &.borrowed {
    background: #fef3e4;
    color: #b8780a;
  }
}

.call-number {
  font-size: 20rpx;
  color: #c0c8d2;
  font-family: "Courier New", Courier, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  background: #e8f0f8;
  border-radius: 50%;
  margin-bottom: 24rpx;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E");
  mask-size: 100%;
  -webkit-mask-size: 100%;
}

.empty-text {
  font-size: 28rpx;
  color: #9caab8;
}
</style>
