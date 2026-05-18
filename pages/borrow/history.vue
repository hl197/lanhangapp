<template>
  <view class="page">
    <!-- 统计卡片 -->
    <view class="stats-row" v-if="historyList.length > 0">
      <view class="stat-card">
        <view class="stat-icon-wrap stat-icon-history">
          <view class="stat-icon icon-history"></view>
        </view>
        <text class="stat-number">{{ historyList.length }}</text>
        <text class="stat-label">历史总数</text>
      </view>
    </view>

    <!-- 区块标题 -->
    <view class="section-header" v-if="historyList.length > 0">
      <view class="section-bar"></view>
      <text class="section-title">借阅历史</text>
    </view>

    <!-- 历史列表 -->
    <view class="history-list" v-if="historyList.length > 0">
      <view
        class="history-card"
        v-for="item in historyList"
        :key="item.borrowId || item.bookId"
      >
        <view class="card-top">
          <view
            class="book-cover"
            :style="{ background: getCover(item.bookId) }"
          >
            <text class="cover-letter">{{ (item.title || "?")[0] }}</text>
          </view>
          <view class="book-meta">
            <text class="book-title">{{ item.title || "未知图书" }}</text>
            <text class="book-author">{{ item.author || "未知作者" }}</text>
            <view class="status-tag returned">已归还</view>
          </view>
        </view>

        <view class="card-dates">
          <view class="date-item">
            <text class="date-label">借阅日期</text>
            <text class="date-value">{{ item.borrowDateStr }}</text>
          </view>
          <view class="date-item">
            <text class="date-label">归还日期</text>
            <text class="date-value">{{ item.returnDateStr }}</text>
          </view>
          <view class="date-item">
            <text class="date-label">借阅时长</text>
            <text class="date-value days-count">{{ item.duration }} 天</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-icon-wrap">
        <view class="empty-icon"></view>
      </view>
      <text class="empty-text">暂无借阅历史</text>
      <text class="empty-desc">借阅归还后的记录将显示在这里</text>
    </view>

    <!-- 清除历史 -->
    <view class="clear-section" v-if="historyList.length > 0">
      <view class="clear-btn" @click="handleClear">
        <text>清除历史</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { bookCovers, bookInfoMap } from "@/utils/mock-data.js";
import { formatDate } from "@/utils/format.js";
import { getStorage, setStorage } from "@/utils/storage.js";

const defaultCover = "linear-gradient(160deg, #1E3A5F 0%, #3D7AB5 100%)";

const historyList = ref([]);

const getCover = (bookId) => {
  return bookCovers[String(bookId)] || defaultCover;
};

const loadData = () => {
  const raw = getStorage("borrows") || [];

  historyList.value = raw
    .filter((b) => b.status === "returned")
    .map((b) => {
      const info = bookInfoMap[b.bookId] || {};
      const borrowDate = new Date(b.borrowDate);
      const returnDate = new Date(b.returnDate || new Date());
      const duration = Math.ceil(
        (returnDate - borrowDate) / (1000 * 60 * 60 * 24),
      );
      return {
        ...b,
        ...info,
        borrowDateStr: formatDate(b.borrowDate),
        returnDateStr: formatDate(b.returnDate),
        duration,
      };
    })
    .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
};

const handleClear = () => {
  uni.showModal({
    title: "清除确认",
    content: "确定要清除所有借阅历史记录吗？此操作不可恢复。",
    success: (res) => {
      if (res.confirm) {
        const borrows = getStorage("borrows") || [];
        const remaining = borrows.filter((b) => b.status !== "returned");
        setStorage("borrows", remaining);
        loadData();
        uni.showToast({ title: "已清除历史记录", icon: "success" });
      }
    },
  });
};

onMounted(() => {
  loadData();
});
onShow(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 32rpx;
}

/* ---------- 统计卡片行 ---------- */
.stats-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 48rpx;
}

.stat-card {
  flex: 1;
  background: #ffffff;
  border-radius: 14rpx;
  padding: 28rpx 16rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.stat-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.stat-icon-history {
  background: #eef2ff;
}

.stat-icon {
  width: 36rpx;
  height: 36rpx;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.stat-icon-history .stat-icon {
  background: #3d7ab5;
}

.icon-history {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #1a2a3a;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: #9caab8;
}

/* ---------- 区块标题 ---------- */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-bar {
  width: 6rpx;
  height: 32rpx;
  background: #3d7ab5;
  border-radius: 3rpx;
  margin-right: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a2a3a;
}

/* ---------- 历史卡片 ---------- */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.history-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.card-top {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.book-cover {
  width: 100rpx;
  height: 134rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.cover-letter {
  font-size: 36rpx;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.book-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 10rpx;
}

.status-tag {
  display: inline-block;
  font-size: 20rpx;
  font-weight: 500;
  padding: 4rpx 14rpx;
  border-radius: 12rpx;
  align-self: flex-start;

  &.returned {
    background: #d1fae5;
    color: #059669;
  }
}

/* ---------- 日期行 ---------- */
.card-dates {
  display: flex;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f4f8;
}

.date-item {
  flex: 1;
}

.date-label {
  font-size: 22rpx;
  color: #9caab8;
  display: block;
  margin-bottom: 6rpx;
}

.date-value {
  font-size: 26rpx;
  color: #1a2a3a;
  font-weight: 500;
}

.days-count {
  color: #3d7ab5;
}

/* ---------- 空状态 ---------- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #e8f0f8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-icon {
  width: 64rpx;
  height: 64rpx;
  background: #3d7ab5;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

.empty-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a2a3a;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #9caab8;
}

/* ---------- 清除历史 ---------- */
.clear-section {
  margin-top: 48rpx;
  display: flex;
  justify-content: center;
}

.clear-btn {
  padding: 20rpx 60rpx;

  text {
    font-size: 28rpx;
    font-weight: 500;
    color: #d32f2f;
  }

  &:active {
    opacity: 0.7;
  }
}
</style>
