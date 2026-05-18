<template>
  <view class="page">
    <!-- 区块标题 -->
    <view class="section-header" v-if="reserveList.length > 0">
      <view class="section-bar"></view>
      <text class="section-title">我的预约</text>
      <text class="section-count">共 {{ reserveList.length }} 条</text>
    </view>

    <!-- 预约列表 -->
    <view class="reserve-list" v-if="reserveList.length > 0">
      <view
        class="reserve-card"
        v-for="item in reserveList"
        :key="item.reserveId || item.bookId"
      >
        <view class="card-top">
          <view
            class="book-cover"
            :style="{ background: getCover(item.bookId) }"
          >
            <text class="cover-letter">{{ (item.title || "?")[0] }}</text>
          </view>
          <view class="book-meta">
            <view class="title-row">
              <text class="book-title">{{ item.title || "未知图书" }}</text>
              <view class="status-tag" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </view>
            </view>
            <text class="book-author">{{ item.author || "未知作者" }}</text>
          </view>
        </view>

        <view class="card-dates">
          <view class="date-item">
            <text class="date-label">预约日期</text>
            <text class="date-value">{{ item.reserveDateStr }}</text>
          </view>
          <view class="date-item" v-if="item.expireDate">
            <text class="date-label">取书截止</text>
            <text class="date-value">{{ item.expireDateStr }}</text>
          </view>
          <view class="date-item" v-if="item.position">
            <text class="date-label">排队位次</text>
            <text class="date-value pos-value">第 {{ item.position }} 位</text>
          </view>
        </view>

        <view class="card-action" v-if="item.status === 'pending'">
          <view class="cancel-btn" @click="handleCancel(item)">
            <text>取消预约</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-icon-wrap">
        <view class="empty-icon"></view>
      </view>
      <text class="empty-text">暂无预约</text>
      <text class="empty-desc">快去预约心仪的图书吧</text>
      <view class="empty-btn" @click="goToSearch">
        <text>去预约</text>
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

const reserveList = ref([]);

const getCover = (bookId) => {
  return bookCovers[String(bookId)] || defaultCover;
};

const getStatusClass = (status) => {
  const map = {
    pending: "status-pending",
    available: "status-available",
    cancelled: "status-cancelled",
    expired: "status-expired",
    completed: "status-completed",
  };
  return map[status] || "status-pending";
};

const getStatusText = (status) => {
  const map = {
    pending: "等待中",
    available: "已到馆",
    cancelled: "已取消",
    expired: "已过期",
    completed: "已完成",
  };
  return map[status] || status;
};

const loadData = () => {
  const raw = getStorage("reserves") || [];

  reserveList.value = raw.map((r) => {
    const info = bookInfoMap[r.bookId] || {};
    return {
      ...r,
      ...info,
      reserveDateStr: formatDate(r.reserveDate),
      expireDateStr: r.expireDate ? formatDate(r.expireDate) : "",
    };
  });
};

const handleCancel = (item) => {
  uni.showModal({
    title: "取消预约",
    content: `确定要取消《${item.title}》的预约吗？`,
    success: (res) => {
      if (res.confirm) {
        const reserves = getStorage("reserves") || [];
        const filtered = reserves.filter(
          (r) => String(r.bookId) !== String(item.bookId),
        );
        setStorage("reserves", filtered);
        loadData();
        uni.showToast({ title: "取消成功", icon: "success" });
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
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 32rpx;
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
  flex: 1;
}

.section-count {
  font-size: 24rpx;
  color: #9caab8;
}

/* ---------- 预约卡片 ---------- */
.reserve-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.reserve-card {
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

.title-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8rpx;
}

.book-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a2a3a;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12rpx;
}

.book-author {
  font-size: 22rpx;
  font-weight: 300;
  color: #6b7b8d;
}

/* ---------- 状态标签 ---------- */
.status-tag {
  font-size: 20rpx;
  font-weight: 500;
  padding: 4rpx 14rpx;
  border-radius: 12rpx;
  flex-shrink: 0;

  &.status-pending {
    background: #e8f0f8;
    color: #2d5a87;
  }

  &.status-available {
    background: #d1fae5;
    color: #059669;
  }

  &.status-cancelled {
    background: #ecf0f4;
    color: #9caab8;
  }

  &.status-expired {
    background: #fef3e4;
    color: #b8780a;
  }

  &.status-completed {
    background: #d1fae5;
    color: #059669;
  }
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

.pos-value {
  color: #3d7ab5;
}

/* ---------- 操作按钮 ---------- */
.card-action {
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  border: 2rpx solid #3d7ab5;
  border-radius: 24rpx;
  padding: 12rpx 36rpx;

  text {
    font-size: 26rpx;
    font-weight: 500;
    color: #3d7ab5;
  }

  &:active {
    background: #e8f0f8;
  }
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
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z'/%3E%3C/svg%3E");
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
  border-radius: 24rpx;
  padding: 20rpx 56rpx;
}

.empty-btn text {
  font-size: 28rpx;
  font-weight: 500;
  color: #ffffff;
}
</style>
