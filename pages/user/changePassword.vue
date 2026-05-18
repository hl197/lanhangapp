<template>
  <view class="page">
    <!-- 表单卡片 -->
    <view class="form-card">
      <!-- 原密码 -->
      <view class="input-row">
        <view class="icon-wrap">
          <view class="icon-lock"></view>
        </view>
        <input
          v-model="form.oldPassword"
          class="input-field"
          :type="showOld ? 'text' : 'password'"
          placeholder="请输入原密码"
          placeholder-style="color:#9CAAB8"
        />
        <view class="eye-btn" @click="showOld = !showOld">
          <view
            :class="['icon-eye', showOld ? 'eye-open' : 'eye-close']"
          ></view>
        </view>
      </view>

      <!-- 新密码 -->
      <view class="input-row">
        <view class="icon-wrap">
          <view class="icon-lock"></view>
        </view>
        <input
          v-model="form.newPassword"
          class="input-field"
          :type="showNew ? 'text' : 'password'"
          placeholder="请输入新密码"
          placeholder-style="color:#9CAAB8"
        />
        <view class="eye-btn" @click="showNew = !showNew">
          <view
            :class="['icon-eye', showNew ? 'eye-open' : 'eye-close']"
          ></view>
        </view>
      </view>

      <!-- 确认新密码 -->
      <view class="input-row">
        <view class="icon-wrap">
          <view class="icon-lock"></view>
        </view>
        <input
          v-model="form.confirmPassword"
          class="input-field"
          :type="showConfirm ? 'text' : 'password'"
          placeholder="请再次输入新密码"
          placeholder-style="color:#9CAAB8"
        />
        <view class="eye-btn" @click="showConfirm = !showConfirm">
          <view
            :class="['icon-eye', showConfirm ? 'eye-open' : 'eye-close']"
          ></view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-btn" @click="handleSubmit">
        <text>确认修改</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const handleSubmit = () => {
  // 空校验
  if (!form.oldPassword) {
    uni.showToast({ title: "请输入原密码", icon: "none" });
    return;
  }
  if (!form.newPassword) {
    uni.showToast({ title: "请输入新密码", icon: "none" });
    return;
  }
  if (!form.confirmPassword) {
    uni.showToast({ title: "请确认新密码", icon: "none" });
    return;
  }

  // 长度校验
  if (form.newPassword.length < 6) {
    uni.showToast({ title: "新密码长度不能少于6位", icon: "none" });
    return;
  }

  // 一致性校验
  if (form.newPassword !== form.confirmPassword) {
    uni.showToast({ title: "两次输入的密码不一致", icon: "none" });
    return;
  }

  // 原密码校验
  const user = uni.getStorageSync("user");
  if (!user) {
    uni.showToast({ title: "请先登录", icon: "none" });
    return;
  }

  if (user.password !== form.oldPassword) {
    uni.showToast({ title: "原密码不正确", icon: "none" });
    return;
  }

  // 保存新密码
  user.password = form.newPassword;
  uni.setStorageSync("user", user);

  uni.showToast({ title: "密码修改成功", icon: "success" });
  setTimeout(() => {
    uni.navigateBack();
  }, 1500);
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 16px;
}

/* ======== 表单卡片 ======== */
.form-card {
  background: #ffffff;
  border-radius: 14rpx;
  padding: 20px 16px;
}

.input-row {
  display: flex;
  align-items: center;
  background: #f0f4f8;
  border-radius: 10rpx;
  padding: 0 14px;
  height: 48px;
  margin-bottom: 16px;

  &:last-of-type {
    margin-bottom: 24px;
  }
}

.icon-wrap {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

/* 锁图标 — CSS 绘制 */
.icon-lock {
  width: 16px;
  height: 20px;
  background: #9caab8;
  border-radius: 2px;
  position: relative;
}
.icon-lock::after {
  content: "";
  position: absolute;
  top: -6px;
  left: 2px;
  width: 12px;
  height: 8px;
  border: 2px solid #9caab8;
  border-radius: 8px 8px 0 0;
  border-bottom: none;
}

.input-field {
  flex: 1;
  height: 100%;
  font-size: 13px;
  color: #1a2a3a;
}

/* 眼睛图标 — CSS 绘制（开 / 关） */
.eye-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-eye {
  width: 20px;
  height: 14px;
  transition: all 0.2s;
}

.eye-open {
  border: 2px solid #6b7b8d;
  border-radius: 50%;
  position: relative;
}
.eye-open::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b7b8d;
}

.eye-close {
  border: 2px solid #9caab8;
  border-radius: 50%;
  position: relative;
}
.eye-close::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 2px;
  height: 16px;
  background: #9caab8;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 48px;
  background: #1e3a5f;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2px;

  &:active {
    opacity: 0.85;
  }
}
</style>
