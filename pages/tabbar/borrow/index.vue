<template>
  <view class="borrow-page">
    <!-- 顶部欢迎条 -->
    <view class="welcome-bar">
      <view class="welcome-text">
        <text class="welcome-greeting">欢迎回来</text>
        <text class="welcome-sub"
          >您当前有
          <text class="welcome-count">{{ stats.active }}</text> 本书在借</text
        >
      </view>
      <view class="welcome-avatar">
        <text class="welcome-avatar-text">{{ stats.active }}</text>
      </view>
    </view>

    <!-- 统计卡片行 -->
    <view class="stats-row">
      <view class="stat-card">
        <view class="stat-icon-wrap stat-icon-borrow">
          <view class="stat-icon icon-book"></view>
        </view>
        <text class="stat-number">{{ stats.active }}</text>
        <text class="stat-label">在借数量</text>
      </view>
      <view class="stat-card">
        <view class="stat-icon-wrap stat-icon-expire">
          <view class="stat-icon icon-clock"></view>
        </view>
        <text class="stat-number">{{ stats.expiring }}</text>
        <text class="stat-label">即将到期</text>
      </view>
      <view class="stat-card">
        <view class="stat-icon-wrap stat-icon-history">
          <view class="stat-icon icon-history"></view>
        </view>
        <text class="stat-number">{{ stats.history }}</text>
        <text class="stat-label">历史借阅</text>
      </view>
    </view>

    <!-- 当前借阅区块 -->
    <view class="section-header">
      <view class="section-bar"></view>
      <text class="section-title">当前借阅</text>
    </view>

    <!-- 借阅列表 -->
    <view class="borrow-list" v-if="activeBorrows.length > 0">
      <view
        class="borrow-card"
        v-for="item in activeBorrows"
        :key="item.borrowId || item.bookId"
      >
        <view class="card-top">
          <view
            class="book-cover"
            :style="{ background: item.cover || defaultCover }"
          >
            <text class="cover-letter">{{ (item.title || "?")[0] }}</text>
          </view>
          <view class="book-meta">
            <text class="book-title">{{ item.title || "未知图书" }}</text>
            <text class="book-author">{{ item.author || "未知作者" }}</text>
            <view class="book-tags" v-if="item.category">
              <text class="book-tag">{{ item.category }}</text>
            </view>
          </view>
        </view>

        <view class="card-dates">
          <view class="date-item">
            <text class="date-label">借阅日期</text>
            <text class="date-value">{{ item.borrowDate }}</text>
          </view>
          <view class="date-item">
            <text class="date-label">应还日期</text>
            <text class="date-value">{{ item.dueDate }}</text>
          </view>
          <view class="date-item">
            <text class="date-label">剩余天数</text>
            <text
              class="date-value"
              :class="{
                'days-safe': item.daysLeft > 7,
                'days-warn': item.daysLeft <= 7 && item.daysLeft > 0,
                'days-overdue': item.overdue,
              }"
            >
              {{ item.overdue ? "已逾期" : item.daysLeft + " 天" }}
            </text>
          </view>
        </view>

        <view class="card-action">
          <view class="renew-btn" @click="renewBook(item)">
            <text>续借</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-icon-wrap">
        <view class="empty-icon"></view>
      </view>
      <text class="empty-text">暂无在借图书</text>
      <text class="empty-desc">去发现一本感兴趣的书吧</text>
      <view class="empty-btn" @click="goToSearch">
        <text>浏览图书</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { bookCovers, bookInfoMap } from "@/utils/mock-data.js";
import { formatDate, getDaysRemaining, isOverdue } from "@/utils/format.js";
import { getStorage, setStorage } from "@/utils/storage.js";

const defaultCover = "linear-gradient(160deg, #1E3A5F 0%, #3D7AB5 100%)";

const activeBorrows = ref([]);
const stats = ref({ active: 0, expiring: 0, history: 0 });

const loadData = () => {
  const raw = getStorage("borrows") || [];
  const now = new Date();

  const active = raw.filter((b) => b.status !== "returned");
  const history = raw.filter((b) => b.status === "returned");

  activeBorrows.value = active.map((b) => {
    const info = bookInfoMap[b.bookId] || {};
    const daysLeft = getDaysRemaining(b.dueDate);
    return {
      ...b,
      ...info,
      cover: bookCovers[b.bookId] || defaultCover,
      borrowDate: formatDate(b.borrowDate),
      dueDate: formatDate(b.dueDate),
      daysLeft,
      overdue: daysLeft < 0,
    };
  });

  stats.value = {
    active: active.length,
    expiring: active.filter((b) => {
      const d = getDaysRemaining(b.dueDate);
      return d >= 0 && d <= 3;
    }).length,
    history: history.length,
  };
};

const renewBook = (item) => {
  uni.showModal({
    title: "续借确认",
    content: `确定要续借《${item.title}》吗？续借后借阅期限将延长30天。`,
    success: (res) => {
      if (res.confirm) {
        const borrows = getStorage("borrows") || [];
        const idx = borrows.findIndex(
          (b) =>
            String(b.bookId) === String(item.bookId) && b.status !== "returned",
        );
        if (idx === -1) return;

        const newDue = new Date();
        newDue.setDate(newDue.getDate() + 30);
        borrows[idx].dueDate = newDue.toISOString();
        borrows[idx].renewCount = (borrows[idx].renewCount || 0) + 1;

        setStorage("borrows", borrows);
        loadData();
        uni.showToast({ title: "续借成功", icon: "success" });
      }
    },
  });
};

const goToSearch = () => {
  uni.switchTab({ url: "/pages/tabbar/home/index" });
};

onMounted(() => {
  loadData();
});
onShow(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.borrow-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 32rpx;
  padding-bottom: 120rpx;
}

/* ---------- 欢迎条 ---------- */
.welcome-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 28rpx;
  background: #ffffff;
  border-radius: 14rpx;
  margin-bottom: 24rpx;
}

.welcome-text {
  display: flex;
  flex-direction: column;
}

.welcome-greeting {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a2a3a;
}

.welcome-sub {
  font-size: 26rpx;
  color: #6b7b8d;
  margin-top: 6rpx;
}

.welcome-count {
  color: #1e3a5f;
  font-weight: 700;
}

.welcome-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #e8f0f8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-avatar-text {
  font-size: 36rpx;
  font-weight: 700;
  color: #1e3a5f;
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

.stat-icon-borrow {
  background: #e8f0f8;
}
.stat-icon-expire {
  background: #fef3e4;
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

.stat-icon-borrow .stat-icon {
  background: #1e3a5f;
}
.stat-icon-expire .stat-icon {
  background: #b8780a;
}
.stat-icon-history .stat-icon {
  background: #3d7ab5;
}

.icon-book {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
}

.icon-clock {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E");
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

/* ---------- 借阅卡片 ---------- */
.borrow-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.borrow-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 28rpx;
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

.book-tags {
  display: flex;
  flex-direction: row;
}

.book-tag {
  font-size: 20rpx;
  font-weight: 500;
  color: #2d5a87;
  background: #e8f0f8;
  padding: 4rpx 14rpx;
  border-radius: 12rpx;
}

/* ---------- 日期行 ---------- */
.card-dates {
  display: flex;
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f4f8;
  border-bottom: 1rpx solid #f0f4f8;
  margin-bottom: 20rpx;
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

.days-safe {
  color: #2e7d32;
}

.days-warn {
  color: #b8780a;
}

.days-overdue {
  color: #d32f2f;
}

/* ---------- 操作按钮 ---------- */
.card-action {
  display: flex;
  justify-content: flex-end;
}

.renew-btn {
  border: 2rpx solid #3d7ab5;
  border-radius: 12rpx;
  padding: 12rpx 40rpx;
  font-size: 26rpx;
  font-weight: 500;
  color: #3d7ab5;
  transition: all 0.2s;

  &:active {
    background: #e8f0f8;
  }
}

/* ---------- 空状态 ---------- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
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
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zM6 4h12v16H6V4zm2 2v2h2V6H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z'/%3E%3C/svg%3E");
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
  margin-bottom: 40rpx;
}

.empty-btn {
  background: #1e3a5f;
  border-radius: 12rpx;
  padding: 20rpx 56rpx;
}

.empty-btn text {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>
