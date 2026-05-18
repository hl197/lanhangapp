<template>
  <view class="page">
    <!-- 全部已读 -->
    <view class="top-bar" v-if="messages.length > 0">
      <view class="top-spacer"></view>
      <view class="mark-all" @click="handleReadAll" v-if="unreadCount > 0">
        <view class="mark-all-icon"></view>
        <text>全部已读</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <view class="message-list" v-if="messages.length > 0">
      <view
        class="message-card"
        v-for="item in messages"
        :key="item.id"
        @click="handleRead(item)"
      >
        <view class="card-left">
          <view class="dot" :class="{ unread: !item.read }"></view>
        </view>
        <view class="card-body">
          <view class="msg-header">
            <text class="msg-title" :class="{ 'title-unread': !item.read }">{{
              item.title
            }}</text>
            <text class="msg-time">{{ formatTime(item.createTime) }}</text>
          </view>
          <text class="msg-desc">{{ item.content }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <view class="empty-icon-wrap">
        <view class="empty-icon"></view>
      </view>
      <text class="empty-text">暂无消息</text>
      <text class="empty-desc">您的通知消息将显示在这里</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getStorage, setStorage } from "@/utils/storage.js";

const messages = ref([]);

const unreadCount = computed(() => {
  return messages.value.filter((item) => !item.read).length;
});

const formatTime = (time) => {
  if (!time) return "刚刚";
  const now = new Date();
  const msgTime = new Date(time);
  const diff = now - msgTime;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? "刚刚" : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  } else if (days === 1) {
    return "昨天";
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    const d = new Date(time);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}-${day}`;
  }
};

const loadData = () => {
  const stored = getStorage("messages") || [];

  if (stored.length === 0) {
    const defaults = [
      {
        id: "1",
        title: "系统通知",
        content: "欢迎使用南昌航空大学图书馆借阅系统！",
        createTime: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        title: "借阅提醒",
        content: "您借阅的《活着》还有3天到期，请及时归还或续借。",
        createTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
      },
    ];
    messages.value = defaults;
    setStorage("messages", defaults);
    return;
  }

  messages.value = [...stored].sort(
    (a, b) => new Date(b.createTime) - new Date(a.createTime),
  );
};

const handleRead = (item) => {
  if (!item.read) {
    item.read = true;
    setStorage("messages", messages.value);
  }
};

const handleReadAll = () => {
  messages.value.forEach((item) => {
    item.read = true;
  });
  setStorage("messages", messages.value);
  uni.showToast({ title: "已全部标记为已读", icon: "success" });
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

/* ---------- 顶部操作栏 ---------- */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24rpx;
}

.top-spacer {
  flex: 1;
}

.mark-all {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #3d7ab5;
  font-weight: 500;

  &:active {
    opacity: 0.7;
  }
}

.mark-all-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
  background: #3d7ab5;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

/* ---------- 消息列表 ---------- */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.message-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 28rpx;
  display: flex;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  &:active {
    background: #f8fafc;
  }
}

.card-left {
  width: 28rpx;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 6rpx;
}

.dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #9caab8;

  &.unread {
    background: #3d7ab5;
  }
}

.card-body {
  flex: 1;
  min-width: 0;
  margin-left: 16rpx;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10rpx;
}

.msg-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1a2a3a;

  &.title-unread {
    font-weight: 700;
  }
}

.msg-time {
  font-size: 22rpx;
  color: #9caab8;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.msg-desc {
  font-size: 26rpx;
  color: #6b7b8d;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z'/%3E%3C/svg%3E");
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
</style>
