<template>
  <view class="login-page">
    <!-- 上部：深蓝渐变背景区域 -->
    <view class="hero-section">
      <!-- 流线弧线装饰 -->
      <view class="curve-decoration"></view>
      <!-- 纸飞机装饰 -->
      <view class="paper-plane">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 90 L90 60 L30 30 L50 60 Z"
            fill="rgba(255,255,255,0.08)"
          />
          <path
            d="M50 60 L90 60"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="2"
          />
        </svg>
      </view>

      <view class="hero-content">
        <text class="school-name-en">NANCHANG HANGKONG UNIVERSITY</text>
        <text class="hero-title">蓝航图书馆</text>
        <text class="hero-subtitle">日新自强 · 知行合一</text>
      </view>
    </view>

    <!-- 下部：白色卡片区域 -->
    <view class="card-section">
      <view class="card">
        <text class="card-title">登录</text>

        <!-- 学号输入框 -->
        <view class="input-group">
          <view class="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#6B7B8D"
              />
            </svg>
          </view>
          <input
            v-model="form.studentId"
            class="input-field"
            placeholder="请输入学号"
            type="text"
            placeholder-class="input-placeholder"
          />
        </view>

        <!-- 密码输入框 -->
        <view class="input-group">
          <view class="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                fill="#6B7B8D"
              />
            </svg>
          </view>
          <input
            v-model="form.password"
            class="input-field"
            :placeholder="'请输入密码'"
            :type="showPassword ? 'text' : 'password'"
            placeholder-class="input-placeholder"
          />
          <view class="eye-icon" @click="showPassword = !showPassword">
            <svg
              v-if="!showPassword"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                fill="#9CAAB8"
              />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                fill="#9CAAB8"
              />
            </svg>
          </view>
        </view>

        <!-- 登录按钮 -->
        <view
          class="login-btn"
          hover-class="login-btn-active"
          @click="handleLogin"
        >
          <text class="login-btn-text">登 录</text>
        </view>

        <!-- 注册链接 -->
        <view class="link-row">
          <text class="link-text" @click="goToRegister">没有账号？</text>
          <text class="link-text link-highlight" @click="goToRegister"
            >去注册</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { setStorage, getStorage } from "@/utils/storage";

const form = reactive({
  studentId: "",
  password: "",
});

const showPassword = ref(false);

const handleLogin = () => {
  if (!form.studentId || !form.password) {
    uni.showToast({ title: "请输入学号和密码", icon: "none" });
    return;
  }

  // 管理员账号
  if (form.studentId === "admin" && form.password === "admin123") {
    const adminUser = {
      studentId: "admin",
      name: "管理员",
      role: "admin",
    };
    setStorage("token", "mock-token-admin");
    setStorage("user", adminUser);
    uni.showToast({ title: "登录成功", icon: "success" });
    setTimeout(() => {
      uni.switchTab({ url: "/pages/tabbar/home/index" });
    }, 1500);
    return;
  }

  try {
    const users = getStorage("users") || [];
    const user = users.find(
      (u) => u.studentId === form.studentId && u.password === form.password,
    );

    if (user) {
      setStorage("token", "mock-token-" + user.studentId);
      setStorage("user", user);
      uni.showToast({ title: "登录成功", icon: "success" });
      setTimeout(() => {
        uni.switchTab({ url: "/pages/tabbar/home/index" });
      }, 1500);
    } else {
      uni.showToast({ title: "学号或密码错误", icon: "none" });
    }
  } catch (err) {
    uni.showToast({ title: "登录失败，请重试", icon: "none" });
  }
};

const goToRegister = () => {
  uni.navigateTo({ url: "/pages/user/register" });
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #f0f4f8;
  position: relative;
  overflow: hidden;
}

/* ========== 上部：深蓝渐变背景 ========== */
.hero-section {
  width: 100%;
  height: 480rpx;
  background: linear-gradient(180deg, #1a3350 0%, #1e3a5f 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 流线弧线装饰 */
.curve-decoration {
  position: absolute;
  bottom: -60rpx;
  left: -30%;
  width: 160%;
  height: 200rpx;
  background: #f0f4f8;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

/* 纸飞机装饰 */
.paper-plane {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%) rotate(-15deg);
  opacity: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.school-name-en {
  font-size: 22rpx;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4rpx;
  margin-bottom: 24rpx;
}

.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 16rpx;
  margin-bottom: 16rpx;
}

.hero-subtitle {
  font-size: 24rpx;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 4rpx;
}

/* ========== 下部：白色卡片区域 ========== */
.card-section {
  position: relative;
  z-index: 3;
  margin-top: -20rpx;
  padding: 0 32rpx;
}

.card {
  background: #ffffff;
  border-radius: 24rpx 24rpx 24rpx 24rpx;
  padding: 48rpx 36rpx 40rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
}

.card-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a2a3a;
  display: block;
  margin-bottom: 40rpx;
}

/* ========== 输入框 ========== */
.input-group {
  display: flex;
  align-items: center;
  background: #f0f4f8;
  border-radius: 10rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  height: 88rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.2s;
}

.input-group:focus-within {
  border-color: #3d7ab5;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  font-size: 28rpx;
  font-weight: 400;
  color: #1a2a3a;
  height: 100%;
}

.input-placeholder {
  color: #9caab8;
  font-size: 28rpx;
}

.eye-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx;
  flex-shrink: 0;
}

/* ========== 登录按钮 ========== */
.login-btn {
  width: 100%;
  height: 88rpx;
  background: #1e3a5f;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
}

.login-btn-active {
  opacity: 0.85;
}

.login-btn-text {
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 8rpx;
}

/* ========== 底部链接 ========== */
.link-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32rpx;
}

.link-text {
  font-size: 26rpx;
  font-weight: 400;
  color: #6b7b8d;
}

.link-highlight {
  color: #3d7ab5;
  margin-left: 4rpx;
}
</style>
