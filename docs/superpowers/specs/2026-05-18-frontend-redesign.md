# 蓝航图书馆前端重设计

## 目标

以航空文化为主题，重做 uni-app 前端界面。统一视觉风格，消除代码重复，接入 API 层，删除无用页面。

---

## 一、设计系统

### 1.1 基础配色

| 角色       | 色值                        | 用途                       |
| ---------- | --------------------------- | -------------------------- |
| 主色       | `#1E3A5F`                   | 导航栏、按钮、标题         |
| 亮蓝       | `#3D7AB5`                   | 强调色、标签、链接、选中态 |
| 背景       | `#F0F4F8`                   | 页面底色                   |
| 卡片       | `#FFFFFF`                   | 内容卡片、列表项           |
| 浅衬       | `#E8F0F8`                   | 图标底衬、分隔区域         |
| 主文字     | `#1A2A3A`                   | 标题、正文                 |
| 次文字     | `#6B7B8D`                   | 辅助信息                   |
| 弱文字     | `#9CAAB8`                   | 占位、提示                 |
| 可借阅标签 | `#E8F0F8` 底 + `#2D5A87` 字 | 蓝色圆角标签               |
| 借出中标签 | `#FEF3E4` 底 + `#B8780A` 字 | 暖黄圆角标签               |

### 1.2 分类特色主题

| 分类     | 主色      | 底色      | 卡片渐变            | 氛围     |
| -------- | --------- | --------- | ------------------- | -------- |
| 航空宇航 | `#1E3A5F` | `#F0F4F8` | 蓝白天空渐变        | 蓝天白云 |
| 人文历史 | `#5C3D2E` | `#FAF7F0` | 暖木渐变            | 古籍卷轴 |
| 自然科学 | `#2C5F7C` | `#FAFBFC` | 白大褂 + 蓝灰科技感 | 实验室   |
| 文学艺术 | `#6B2D3B` | `#FDF8F5` | 酒红渐变            | 朱砂墨韵 |

### 1.3 字号层级

| 层级    | 字号 | 字重 | 用途               |
| ------- | ---- | ---- | ------------------ |
| H1      | 18px | 700  | 页面标题           |
| H2      | 16px | 700  | 区块标题           |
| H3      | 15px | 600  | 卡片标题（书名）   |
| Body    | 13px | 400  | 正文               |
| Caption | 11px | 300  | 作者、出版社       |
| Label   | 10px | 500  | 标签、状态         |
| Mono    | 10px | 400  | 索书号（等宽字体） |

### 1.4 间距与圆角

- 卡片间距：10-12px
- 版块间距：24px
- 页面内边距：16px
- 大圆角：16-24px（导航、搜索条、入口卡片）
- 中圆角：14px（书籍卡片、分类卡片）
- 小圆角：4px（书籍封面缩略图）

### 1.5 图标与装饰

- 使用 SVG 图标，不使用 emoji
- 核心图标：指南针（检索）、纸飞机（航空）、书本+齿轮（借阅）
- 装饰元素：淡网格背景、流线型弧线、航线虚线、淡色几何图形
- 分类卡片各有独特淡色 SVG 几何装饰
- 列表卡片左侧 3px 蓝色竖线模拟图纸标注线

---

## 二、页面清理

### 删除

| 文件                      | 原因                                          |
| ------------------------- | --------------------------------------------- |
| `pages/index/index.vue`   | 未使用，Hello world 模板                      |
| `pages/user/personal.vue` | 与 `pages/tabbar/personal/index.vue` 功能重叠 |

删除后在 `pages.json` 中移除对应路由。

### 保留（16 个页面）

| 分组    | 页面     | 路由                          |
| ------- | -------- | ----------------------------- |
| tabbar  | 首页     | `pages/tabbar/home/index`     |
| tabbar  | 借阅     | `pages/tabbar/borrow/index`   |
| tabbar  | 个人     | `pages/tabbar/personal/index` |
| user    | 登录     | `pages/user/login`            |
| user    | 注册     | `pages/user/register`         |
| user    | 借阅证   | `pages/user/cardStatus`       |
| user    | 改密     | `pages/user/changePassword`   |
| user    | 关于     | `pages/user/about`            |
| book    | 搜索     | `pages/book/search`           |
| book    | 详情     | `pages/book/detail`           |
| book    | 分类     | `pages/book/category`         |
| book    | 热门     | `pages/book/list`             |
| borrow  | 借阅列表 | `pages/borrow/list`           |
| borrow  | 借阅历史 | `pages/borrow/history`        |
| reserve | 预约列表 | `pages/reserve/list`          |
| message | 消息列表 | `pages/message/list`          |

---

## 三、代码架构

### 3.1 新增共享模块

```
utils/
├── storage.js          (保留)
├── format.js           (保留，补充 formatBorrowStatus)
├── icons.js            (新增 - SVG 图标组件)
├── mock-data.js        (新增 - 统一的 mock 数据)
└── theme.js            (新增 - 主题色常量)
```

**mock-data.js** — 集中管理所有 mock 数据：

- `allBooks` — 16 本书数组（唯一来源）
- `bookCovers` — 书籍 ID 到封面渐变的映射
- `bookInfoMap` — 书籍 ID 到 {title, author} 的映射
- 所有页面从此导入，不再各自定义

**theme.js** — 主题色常量：

- `BASE_THEME` — 主主题配色
- `CATEGORY_THEMES` — 四套分类主题配置
- 页面通过分类名查表获取对应主题

### 3.2 API 接入

当前 `api/index.js` 定义完整但未被引用。改造方案：

1. `api/index.js` 中的 `request()` 函数作为基础
2. 每个页面的数据加载改为调用 API 方法
3. 添加加载状态（`loading` ref）和错误处理
4. API 调用失败时 fallback 到 mock-data.js（确保离线可用）

数据流：`page.vue → api/index.js → 后端`（失败时 → `mock-data.js`）

### 3.3 导航统一

所有子页面使用 uni-app 内置导航栏，统一配置：

- 导航栏背景：`#1E3A5F`
- 导航栏文字：白色
- 返回按钮：默认白色箭头
- 移除所有自定义返回按钮（"←" 文字返回、CSS 箭头返回等）

---

## 四、页面分级改造

### 第一梯队：核心页面（6 个）

| 页面 | 改造要点                                |
| ---- | --------------------------------------- |
| 首页 | 新 UI、SVG 图标、分类主题卡片、搜索条   |
| 借阅 | 书籍列表新样式、续借/归还操作、统计卡片 |
| 个人 | 用户信息卡、菜单列表、航空主题装饰      |
| 登录 | 统一配色、LOGO 区、"日新自强 知行合一"  |
| 搜索 | 搜索栏新样式、筛选面板、结果列表新卡片  |
| 详情 | 书籍信息展示、借阅/预约按钮、底部操作栏 |

### 第二梯队：功能页面（6 个）

| 页面   | 改造要点                   |
| ------ | -------------------------- |
| 注册   | 统一配色、表单样式         |
| 借阅证 | 卡片 UI 新设计             |
| 改密   | 表单样式统一               |
| 分类   | 根据当前分类切换分类主题色 |
| 热门   | 列表卡片新样式             |
| 消息   | 列表新样式、已读/未读标记  |

### 第三梯队：次要页面（4 个）

| 页面     | 改造要点                 |
| -------- | ------------------------ |
| 借阅列表 | 同借阅 tab 样式          |
| 借阅历史 | 列表新样式、借阅时长展示 |
| 预约列表 | 列表新样式、取消操作     |
| 关于     | 大学信息、校训、功能列表 |

---

## 五、uni.scss 更新

```scss
// 主配色 - 航空蓝图
$primary-color: #1e3a5f;
$primary-light: #3d7ab5;
$primary-bg: #e8f0f8;

// 语义色
$success-color: #059669;
$warning-color: #d97706;
$error-color: #dc2626;

// 文字
$text-color: #1a2a3a;
$text-secondary: #6b7b8d;
$text-hint: #9caab8;

// 表面
$border-color: #e5e7eb;
$bg-color: #f0f4f8;
$card-bg: #ffffff;

// 圆角
$radius-sm: 4rpx;
$radius-base: 10rpx;
$radius-lg: 14rpx;
$radius-xl: 24rpx;

// 阴影
$shadow-card: 0 2rpx 12rpx rgba(26, 51, 80, 0.04);
$shadow-lg: 0 4rpx 20rpx rgba(26, 51, 80, 0.08);
```

---

## 六、不涉及

- 后端开发（仅接入已有 API 定义）
- 新增功能（保持现有功能不变）
- 国际化
- TypeScript 迁移
