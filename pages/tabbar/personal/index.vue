<template>
  <view class="personal-page">
    <!-- 顶部深蓝渐变区域 -->
    <view class="header-gradient">
      <view class="header-content">
        <!-- 头像 -->
        <view class="avatar-circle" @click="goToProfile">
          <text class="avatar-letter">{{ userNameFirst }}</text>
        </view>
        <!-- 用户名 + 学号 -->
        <view class="user-text">
          <text class="user-name">{{ user.name || "未登录" }}</text>
          <text class="user-student-id">{{
            user.studentId || "未绑定学号"
          }}</text>
        </view>
        <!-- 右侧箭头 -->
        <view class="header-arrow" @click="goToProfile">
          <view class="arrow-icon-white"></view>
        </view>
      </view>
      <!-- 校训 -->
      <text class="motto-text">日新自强 知行合一</text>

      <!-- 统计行 -->
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">{{ borrowCount }}</text>
          <text class="stat-label">在借</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ reserveCount }}</text>
          <text class="stat-label">预约</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ messageCount }}</text>
          <text class="stat-label">消息</text>
          <view class="stat-badge" v-if="unreadCount > 0">{{
            unreadCount > 99 ? "99+" : unreadCount
          }}</view>
        </view>
      </view>

      <!-- 底部弧线装饰 -->
      <view class="header-arc"></view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-card">
      <view class="menu-item" @click="goToPage('/pages/user/cardStatus')">
        <view class="menu-icon-wrap menu-icon-cyan">
          <view class="menu-icon icon-card"></view>
        </view>
        <text class="menu-text">借阅证状态</text>
        <view class="menu-arrow"></view>
      </view>
      <view class="menu-item" @click="goToPage('/pages/borrow/history')">
        <view class="menu-icon-wrap menu-icon-blue">
          <view class="menu-icon icon-history"></view>
        </view>
        <text class="menu-text">借阅历史</text>
        <view class="menu-arrow"></view>
      </view>
      <view class="menu-item" @click="goToPage('/pages/reserve/list')">
        <view class="menu-icon-wrap menu-icon-amber">
          <view class="menu-icon icon-reserve"></view>
        </view>
        <text class="menu-text">我的预约</text>
        <view class="menu-arrow"></view>
      </view>
      <view class="menu-item" @click="goToPage('/pages/message/list')">
        <view class="menu-icon-wrap menu-icon-green">
          <view class="menu-icon icon-message"></view>
        </view>
        <text class="menu-text">消息通知</text>
        <view class="menu-badge" v-if="unreadCount > 0">{{
          unreadCount > 99 ? "99+" : unreadCount
        }}</view>
        <view class="menu-arrow"></view>
      </view>
      <view class="menu-item" @click="goToPage('/pages/user/changePassword')">
        <view class="menu-icon-wrap menu-icon-purple">
          <view class="menu-icon icon-lock"></view>
        </view>
        <text class="menu-text">修改密码</text>
        <view class="menu-arrow"></view>
      </view>
      <view
        class="menu-item menu-item-last"
        @click="goToPage('/pages/user/about')"
      >
        <view class="menu-icon-wrap menu-icon-indigo">
          <view class="menu-icon icon-info"></view>
        </view>
        <text class="menu-text">关于 APP</text>
        <view class="menu-arrow"></view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-btn" @click="handleLogout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getStorage, clearStorage } from "@/utils/storage.js";

const user = ref({ name: "", studentId: "" });
const borrowCount = ref(0);
const reserveCount = ref(0);
const messageCount = ref(0);
const unreadCount = ref(0);

const userNameFirst = computed(() => {
  const name = user.value.name || "";
  return name ? name.charAt(0) : "?";
});

const loadData = () => {
  const storedUser = getStorage("user");
  if (storedUser) {
    user.value = storedUser;
  }

  const borrows = getStorage("borrows") || [];
  const reserves = getStorage("reserves") || [];
  const messages = getStorage("messages") || [];

  borrowCount.value = borrows.filter((b) => b.status !== "returned").length;
  reserveCount.value = reserves.length;
  messageCount.value = messages.length;
  unreadCount.value = messages.filter((m) => !m.read).length;
};

const goToProfile = () => {
  uni.navigateTo({ url: "/pages/user/personal" });
};

const goToPage = (url) => {
  uni.navigateTo({ url });
};

const handleLogout = () => {
  uni.showModal({
    title: "确认退出",
    content: "确定要退出登录吗？",
    success: (res) => {
      if (res.confirm) {
        clearStorage();
        uni.redirectTo({ url: "/pages/user/login" });
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
.personal-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding-bottom: 120rpx;
}

/* ========== 顶部深蓝渐变 ========== */
.header-gradient {
  background: linear-gradient(180deg, #1a3350 0%, #1e3a5f 100%);
  padding: 60rpx 32rpx 0;
  position: relative;
  overflow: hidden;
}

.header-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

.avatar-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.avatar-letter {
  font-size: 52rpx;
  font-weight: 700;
  color: #ffffff;
}

.user-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 40rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.user-student-id {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.65);
}

.header-arrow {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.arrow-icon-white {
  width: 16rpx;
  height: 16rpx;
  border-top: 3rpx solid rgba(255, 255, 255, 0.8);
  border-right: 3rpx solid rgba(255, 255, 255, 0.8);
  transform: rotate(45deg);
}

/* 校训 */
.motto-text {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 8rpx;
  margin-top: 32rpx;
  position: relative;
  z-index: 1;
}

/* ========== 统计行 ========== */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 36rpx;
  padding-bottom: 52rpx;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.65);
}

.stat-badge {
  position: absolute;
  top: -6rpx;
  right: -28rpx;
  background: #ef4444;
  color: #ffffff;
  font-size: 18rpx;
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.15);
}

/* ========== 底部弧线 ========== */
.header-arc {
  position: absolute;
  bottom: -2rpx;
  left: 0;
  right: 0;
  height: 40rpx;
  background: #f0f4f8;
  border-radius: 40rpx 40rpx 0 0;
}

/* ========== 菜单卡片 ========== */
.menu-card {
  background: #ffffff;
  border-radius: 14rpx;
  margin: 0 32rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 28rpx;
  border-bottom: 1rpx solid #f0f4f8;
  position: relative;

  &:active {
    background: #f8fafc;
  }
}

.menu-item-last {
  border-bottom: none;
}

.menu-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.menu-icon-cyan {
  background: #e0f2f7;
}
.menu-icon-blue {
  background: #e8f0f8;
}
.menu-icon-amber {
  background: #fef3e4;
}
.menu-icon-green {
  background: #e8f5e9;
}
.menu-icon-purple {
  background: #f3e5f5;
}
.menu-icon-indigo {
  background: #e8eaf6;
}

.menu-icon {
  width: 30rpx;
  height: 30rpx;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.menu-icon-cyan .menu-icon {
  background: #00838f;
}
.menu-icon-blue .menu-icon {
  background: #1e3a5f;
}
.menu-icon-amber .menu-icon {
  background: #b8780a;
}
.menu-icon-green .menu-icon {
  background: #2e7d32;
}
.menu-icon-purple .menu-icon {
  background: #6a1b9a;
}
.menu-icon-indigo .menu-icon {
  background: #283593;
}

/* --- 图标 SVG --- */
.icon-card {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z'/%3E%3C/svg%3E");
}

.icon-history {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'/%3E%3C/svg%3E");
}

.icon-reserve {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cpath d='M16 2v4M8 2v4M3 10h18'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cpath d='M16 2v4M8 2v4M3 10h18'/%3E%3C/svg%3E");
}

.icon-message {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'/%3E%3C/svg%3E");
}

.icon-lock {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E");
}

.icon-info {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E");
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #1a2a3a;
}

.menu-badge {
  position: absolute;
  right: 72rpx;
  background: #ef4444;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
}

.menu-arrow {
  width: 14rpx;
  height: 14rpx;
  border-top: 2rpx solid #cbd5e0;
  border-right: 2rpx solid #cbd5e0;
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* ========== 退出登录 ========== */
.logout-btn {
  margin: 48rpx 32rpx 0;
  text-align: center;
  padding: 28rpx;
  font-size: 30rpx;
  color: #e53935;

  &:active {
    opacity: 0.7;
  }
}
</style>
