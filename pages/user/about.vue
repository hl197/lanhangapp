<template>
  <view class="page">
    <!-- LOGO 与名称区 -->
    <view class="brand-card">
      <view class="logo-circle">
        <text class="logo-icon">📖</text>
      </view>
      <text class="app-name">蓝航图书馆</text>
      <text class="app-version">v1.0.0</text>
    </view>

    <!-- 应用介绍卡片 -->
    <view class="info-card">
      <text class="intro-text">
        蓝航图书馆是为南昌航空大学师生量身打造的移动图书借阅服务平台，致力于提供便捷、高效的图书管理和阅读体验。
      </text>
      <view class="motto-box">
        <text class="motto-label">校训</text>
        <text class="motto-text">日新自强 知行合一</text>
      </view>
    </view>

    <!-- 功能特性卡片 -->
    <view class="info-card">
      <text class="section-title">功能特性</text>
      <view class="feature-list">
        <view class="feature-item" v-for="(feat, idx) in features" :key="idx">
          <view class="check-icon">
            <text class="check-mark">✓</text>
          </view>
          <view class="feature-content">
            <text class="feature-name">{{ feat.name }}</text>
            <text class="feature-desc">{{ feat.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 版权信息 -->
    <view class="copyright">
      <text>© 南昌航空大学图书馆</text>
    </view>
  </view>
</template>

<script setup>
const features = [
  { name: "在线检索", desc: "海量图书资源一键检索" },
  { name: "借阅管理", desc: "个人借阅记录实时查看" },
  { name: "预约服务", desc: "热门图书提前预约锁定" },
  { name: "消息通知", desc: "到期提醒与馆内公告推送" },
];
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 24px 16px 16px;
}

/* ======== LOGO 区域 ======== */
.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 0 20px;
  margin-bottom: 12px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a3350 0%, #1e3a5f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
}

.logo-icon {
  font-size: 36px;
}

.app-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a2a3a;
  margin-bottom: 6px;
}

.app-version {
  font-size: 10px;
  font-weight: 500;
  color: #9caab8;
  background: rgba(156, 170, 184, 0.12);
  padding: 2px 12px;
  border-radius: 10rpx;
}

/* ======== 信息卡片（通用） ======== */
.info-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 16px;
  margin-bottom: 12px;
}

.intro-text {
  font-size: 13px;
  line-height: 1.6;
  color: #6b7b8d;
  display: block;
  margin-bottom: 16px;
}

/* 校训高亮区 */
.motto-box {
  background: rgba(30, 58, 95, 0.05);
  border-radius: 10rpx;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.motto-label {
  font-size: 10px;
  font-weight: 500;
  color: #1e3a5f;
  background: rgba(30, 58, 95, 0.1);
  padding: 2px 10px;
  border-radius: 6rpx;
}

.motto-text {
  font-size: 16px;
  font-weight: 700;
  color: #1e3a5f;
  letter-spacing: 2px;
}

/* 区块标题 */
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a2a3a;
  display: block;
  margin-bottom: 14px;
}

/* 功能列表 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
}

.check-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(61, 122, 181, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}

.check-mark {
  font-size: 12px;
  font-weight: 700;
  color: #3d7ab5;
}

.feature-content {
  display: flex;
  flex-direction: column;
}

.feature-name {
  font-size: 13px;
  font-weight: 700;
  color: #1a2a3a;
  margin-bottom: 2px;
}

.feature-desc {
  font-size: 10px;
  font-weight: 500;
  color: #9caab8;
}

/* ======== 版权 ======== */
.copyright {
  text-align: center;
  padding: 20px 0 10px;
  font-size: 10px;
  font-weight: 500;
  color: #9caab8;
}
</style>
