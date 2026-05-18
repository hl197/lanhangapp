<template>
  <view class="detail-page" v-if="book">
    <!-- 封面渐变区域 -->
    <view class="cover-section" :style="{ background: bookCover }">
      <view class="cover-content">
        <text class="cover-title">{{ book.title }}</text>
        <text class="cover-author">{{ book.author }}</text>
      </view>
    </view>

    <!-- 弧形过渡 -->
    <view class="cover-arc"></view>

    <!-- 书籍信息卡片 -->
    <view class="info-card">
      <view class="info-row">
        <text class="info-label">索书号</text>
        <text class="info-value call-number">{{ book.isbn }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">出版信息</text>
        <text class="info-value">{{ book.publisher }} · {{ book.year }}</text>
      </view>
      <view class="info-tags">
        <view class="category-badge">{{ book.category }}</view>
        <view
          class="status-badge"
          :class="book.status === 'available' ? 'available' : 'borrowed'"
        >
          {{ statusLabel }}
        </view>
      </view>
    </view>

    <!-- 内容简介卡片 -->
    <view class="desc-card">
      <view class="desc-header">
        <view class="desc-line"></view>
        <text class="desc-title">内容简介</text>
      </view>
      <text class="desc-text">{{
        book.description ||
        "本书是" +
          book.publisher +
          "于" +
          book.year +
          "年出版的" +
          book.category +
          "类书籍，作者" +
          book.author +
          "。"
      }}</text>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view
        class="action-btn borrow-btn"
        :class="{ disabled: book.status !== 'available' }"
        @click="handleBorrow"
      >
        <text>{{ book.status === "available" ? "借阅" : "已借出" }}</text>
      </view>
      <view class="action-btn reserve-btn" @click="handleReserve">
        <text>预约</text>
      </view>
    </view>
  </view>

  <!-- 未找到书籍 -->
  <view class="not-found" v-else>
    <view class="nf-icon"></view>
    <text class="nf-text">书籍不存在</text>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { allBooks, bookCovers } from "@/utils/mock-data.js";
import { formatBookStatus } from "@/utils/format.js";

const book = ref(null);
const bookCover = ref("");

const statusLabel = computed(() => {
  if (!book.value) return "";
  return formatBookStatus(book.value.status);
});

onMounted(() => {
  const pages = getCurrentPages();
  const id = pages[pages.length - 1].options.id;
  book.value = allBooks.find((b) => b.id === id) || null;
  if (book.value) {
    bookCover.value =
      bookCovers[id] || "linear-gradient(160deg, #1E3A5F 0%, #3D7AB5 100%)";
  }
});

const handleBorrow = () => {
  if (book.value.status !== "available") {
    uni.showToast({ title: "该书已被借出", icon: "none" });
    return;
  }
  uni.showToast({ title: "借阅成功", icon: "success" });
};

const handleReserve = () => {
  uni.showToast({ title: "预约成功", icon: "success" });
};
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding-bottom: 140rpx;
}

/* 封面渐变区域 */
.cover-section {
  width: 100%;
  min-height: 360rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx 60rpx;
}

.cover-content {
  text-align: center;
}

.cover-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
  margin-bottom: 16rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.cover-author {
  font-size: 26rpx;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
}

/* 弧形过渡 */
.cover-arc {
  width: 100%;
  height: 40rpx;
  background: #f0f4f8;
  border-radius: 100% 100% 0 0;
  margin-top: -1rpx;
  position: relative;
  z-index: 1;
}

/* 书籍信息卡片 */
.info-card {
  background: #ffffff;
  border-radius: 14rpx;
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;

  &:first-child {
    padding-top: 0;
  }
}

.info-label {
  font-size: 24rpx;
  color: #9caab8;
  width: 120rpx;
  flex-shrink: 0;
}

.info-value {
  font-size: 26rpx;
  color: #1a2a3a;
  flex: 1;
}

.call-number {
  font-family: "Courier New", Courier, monospace;
  font-size: 24rpx;
  color: #3d7ab5;
  letter-spacing: 1rpx;
}

.info-tags {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f4f8;
}

.category-badge {
  font-size: 20rpx;
  font-weight: 500;
  color: #6b7b8d;
  background: #f0f4f8;
  padding: 6rpx 20rpx;
  border-radius: 12rpx;
}

.status-badge {
  font-size: 20rpx;
  font-weight: 500;
  padding: 6rpx 20rpx;
  border-radius: 12rpx;

  &.available {
    background: #e8f0f8;
    color: #2d5a87;
  }

  &.borrowed {
    background: #fef3e4;
    color: #b8780a;
  }
}

/* 内容简介卡片 */
.desc-card {
  background: #ffffff;
  border-radius: 14rpx;
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
}

.desc-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.desc-line {
  width: 6rpx;
  height: 32rpx;
  background: #3d7ab5;
  border-radius: 3rpx;
  margin-right: 16rpx;
}

.desc-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a2a3a;
}

.desc-text {
  font-size: 26rpx;
  color: #6b7b8d;
  line-height: 1.8;
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  border-top: 1rpx solid #f0f4f8;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 24rpx;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:active {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

.borrow-btn {
  background: #1e3a5f;
  color: #ffffff;

  &.disabled {
    background: #c0c8d2;
    color: #ffffff;
  }
}

.reserve-btn {
  background: #ffffff;
  color: #1e3a5f;
  border: 2rpx solid #3d7ab5;
}

/* 未找到 */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f4f8;
}

.nf-icon {
  width: 120rpx;
  height: 120rpx;
  background: #e8f0f8;
  border-radius: 50%;
  margin-bottom: 24rpx;
}

.nf-text {
  font-size: 28rpx;
  color: #9caab8;
}
</style>
