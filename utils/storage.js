export const setStorage = (key, value) => {
  try {
    uni.setStorageSync(
      key,
      typeof value === "object" ? JSON.stringify(value) : value,
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const getStorage = (key) => {
  try {
    const value = uni.getStorageSync(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const clearStorage = () => {
  try {
    uni.clearStorageSync();
    return true;
  } catch (e) {
    return false;
  }
};
