import { allBooks, categories as mockCategories } from "../utils/mock-data.js";

const baseUrl = "http://localhost:3000/api";

const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        token: uni.getStorageSync("token") || "",
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const userApi = {
  login: (data) => request({ url: "/user/login", method: "POST", data }),
  register: (data) => request({ url: "/user/register", method: "POST", data }),
  getUserInfo: () => request({ url: "/user/info" }),
  updateUserInfo: (data) =>
    request({ url: "/user/update", method: "PUT", data }),
  changePassword: (data) =>
    request({ url: "/user/changePassword", method: "PUT", data }),
  getCardStatus: () => request({ url: "/user/cardStatus" }),
};

export const bookApi = {
  search: (data) => request({ url: "/book/search", method: "GET", data }),
  getById: (id) => request({ url: `/book/${id}` }),
  getCategories: () => request({ url: "/book/categories" }),
  getByCategory: (categoryId) =>
    request({ url: `/book/category/${categoryId}` }),
};

export const borrowApi = {
  borrow: (data) => request({ url: "/borrow", method: "POST", data }),
  renew: (id) => request({ url: `/borrow/renew/${id}`, method: "PUT" }),
  return: (id) => request({ url: `/borrow/return/${id}`, method: "PUT" }),
  getMyBorrows: () => request({ url: "/borrow/my" }),
  getHistory: () => request({ url: "/borrow/history" }),
};

export const reserveApi = {
  reserve: (data) => request({ url: "/reserve", method: "POST", data }),
  getMyReserves: () => request({ url: "/reserve/my" }),
  cancel: (id) => request({ url: `/reserve/cancel/${id}`, method: "PUT" }),
};

export const messageApi = {
  getMessages: () => request({ url: "/message" }),
  read: (id) => request({ url: `/message/read/${id}`, method: "PUT" }),
  readAll: () => request({ url: "/message/readAll", method: "PUT" }),
};

// API 调用包装器：失败时 fallback 到 mock 数据
const withFallback = (apiCall, fallback) => {
  return apiCall().catch(() => {
    console.warn("API 不可用，使用本地数据");
    return typeof fallback === "function" ? fallback() : fallback;
  });
};

export const safeApi = {
  search: (params) =>
    withFallback(
      () => bookApi.search(params),
      () => {
        const { keyword, category } = params || {};
        let result = allBooks;
        if (keyword)
          result = result.filter(
            (b) => b.title.includes(keyword) || b.author.includes(keyword),
          );
        if (category) result = result.filter((b) => b.category === category);
        return { data: result };
      },
    ),
  getBookById: (id) =>
    withFallback(
      () => bookApi.getById(id),
      () => ({ data: allBooks.find((b) => b.id === id) }),
    ),
  getCategories: () =>
    withFallback(
      () => bookApi.getCategories(),
      () => ({ data: mockCategories }),
    ),
  getByCategory: (name) =>
    withFallback(
      () => bookApi.getByCategory(name),
      () => ({ data: allBooks.filter((b) => b.category === name) }),
    ),
};
