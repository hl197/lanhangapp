<template>
  <view class="register-page">
    <view class="card">
      <!-- 学号 -->
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

      <!-- 姓名 -->
      <view class="input-group">
        <view class="input-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.66-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"
              fill="#6B7B8D"
            />
          </svg>
        </view>
        <input
          v-model="form.name"
          class="input-field"
          placeholder="请输入姓名"
          type="text"
          placeholder-class="input-placeholder"
        />
      </view>

      <!-- 密码 -->
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
          placeholder="请输入密码"
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

      <!-- 确认密码 -->
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
          v-model="form.confirmPassword"
          class="input-field"
          placeholder="请确认密码"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder-class="input-placeholder"
        />
        <view
          class="eye-icon"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <svg
            v-if="!showConfirmPassword"
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

      <!-- 邮箱 -->
      <view class="input-group">
        <view class="input-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              fill="#6B7B8D"
            />
          </svg>
        </view>
        <input
          v-model="form.email"
          class="input-field"
          placeholder="请输入邮箱"
          type="text"
          placeholder-class="input-placeholder"
        />
      </view>

      <!-- 注册按钮 -->
      <view
        class="register-btn"
        hover-class="register-btn-active"
        @click="handleRegister"
      >
        <text class="register-btn-text">注 册</text>
      </view>

      <!-- 登录链接 -->
      <view class="link-row">
        <text class="link-text">已有账号？</text>
        <text class="link-text link-highlight" @click="goToLogin">去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { setStorage, getStorage } from "@/utils/storage";

const form = reactive({
  studentId: "",
  name: "",
  password: "",
  confirmPassword: "",
  email: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = () => {
  if (!form.studentId) {
    uni.showToast({ title: "请输入学号", icon: "none" });
    return;
  }
  if (!form.name) {
    uni.showToast({ title: "请输入姓名", icon: "none" });
    return;
  }
  if (!form.password) {
    uni.showToast({ title: "请输入密码", icon: "none" });
    return;
  }
  if (form.password.length < 6) {
    uni.showToast({ title: "密码长度不能少于6位", icon: "none" });
    return;
  }
  if (form.password !== form.confirmPassword) {
    uni.showToast({ title: "两次输入的密码不一致", icon: "none" });
    return;
  }
  if (!form.email) {
    uni.showToast({ title: "请输入邮箱", icon: "none" });
    return;
  }

  try {
    const existingUsers = getStorage("users") || [];

    // 检查学号是否已注册
    const userExists = existingUsers.some(
      (u) => u.studentId === form.studentId,
    );

    if (userExists) {
      uni.showToast({ title: "该学号已注册", icon: "none" });
      return;
    }

    const newUser = {
      studentId: form.studentId,
      name: form.name,
      password: form.password,
      email: form.email,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(newUser);
    setStorage("users", existingUsers);

    uni.showToast({ title: "注册成功，请登录", icon: "success" });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (err) {
    uni.showToast({ title: "注册失败，请重试", icon: "none" });
  }
};

const goToLogin = () => {
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 32rpx;
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 40rpx 36rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.06);
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

/* ========== 注册按钮 ========== */
.register-btn {
  width: 100%;
  height: 88rpx;
  background: #1e3a5f;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
}

.register-btn-active {
  opacity: 0.85;
}

.register-btn-text {
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
