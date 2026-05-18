<template>
  <view class="page">
    <!-- 借阅证卡片 -->
    <view class="card-wrapper">
      <view class="library-card">
        <!-- 卡片头部：校名 + 借阅证标签 -->
        <view class="card-top">
          <text class="school-name">南昌航空大学图书馆</text>
          <view class="badge">借阅证</view>
        </view>

        <!-- 用户信息区：头像 + 姓名 + 学号 -->
        <view class="card-body">
          <view class="avatar">{{ nameFirstChar }}</view>
          <view class="user-meta">
            <text class="user-name">{{ userName }}</text>
            <text class="user-id">{{ studentId }}</text>
          </view>
        </view>

        <!-- 统计信息区 -->
        <view class="card-stats">
          <view class="stat-item">
            <text class="stat-label">有效期</text>
            <text class="stat-value">{{ expireDate }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">可借 / 已借 / 剩余</text>
            <text class="stat-value">
              <text class="highlight">{{ maxBorrow }}</text>
              <text> / {{ borrowedCount }} / </text>
              <text class="highlight">{{ remainCount }}</text>
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 借阅规则说明 -->
    <view class="rules-card">
      <text class="section-title">借阅规则</text>
      <view class="rule-item" v-for="(rule, idx) in rules" :key="idx">
        <view class="rule-dot"></view>
        <text class="rule-text">{{ rule }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const userName = ref("");
const studentId = ref("");
const expireDate = ref("--");
const borrowedCount = ref(0);
const maxBorrow = ref(5);

const rules = [
  "每人最多可同时借阅 5 本图书",
  "单次借阅期限为 30 天",
  "到期前可续借 1 次，续借期 30 天",
  "逾期将暂停借阅权限，请按时归还",
];

const nameFirstChar = computed(() => {
  return userName.value ? userName.value.charAt(0) : "?";
});

const remainCount = computed(() => {
  return Math.max(0, maxBorrow.value - borrowedCount.value);
});

onMounted(() => {
  const user = uni.getStorageSync("user") || {};
  userName.value = user.name || "";
  studentId.value = user.studentId || "";
  expireDate.value = user.expireDate || "2026-12-31";

  const borrows = uni.getStorageSync("borrows") || [];
  borrowedCount.value = borrows.filter((b) => b.status !== "returned").length;
});
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 16px;
}

/* ======== 借阅证卡片 ======== */
.card-wrapper {
  margin-bottom: 12px;
}

.library-card {
  background: linear-gradient(135deg, #1a3350 0%, #1e3a5f 100%);
  border-radius: 16rpx;
  padding: 20px;
  color: #ffffff;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.school-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.badge {
  font-size: 10px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20rpx;
  color: #ffffff;
}

/* 头像 + 姓名学号 */
.card-body {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin-right: 14px;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
}

.user-id {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

/* 统计数据区 */
.card-stats {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 14px;
  display: flex;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
}

.stat-value {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
}

.highlight {
  font-weight: 700;
  color: #ffffff;
}

/* ======== 规则说明卡片 ======== */
.rules-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a2a3a;
  display: block;
  margin-bottom: 12px;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
}

.rule-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3d7ab5;
  margin-top: 7px;
  margin-right: 10px;
  flex-shrink: 0;
}

.rule-text {
  font-size: 13px;
  color: #6b7b8d;
  line-height: 1.5;
}
</style>
