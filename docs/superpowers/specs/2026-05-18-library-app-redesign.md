# 南昌航空大学图书借阅手机APP - 重建设计文档

## 概述

基于实验三文档要求，将现有 uni-app 项目按文档技术规范重写为 React Native (Expo) 前端 + Java Spring Boot 后端的完整应用。

## 技术栈

| 层次      | 技术                | 说明                          |
| --------- | ------------------- | ----------------------------- |
| 前端框架  | React Native (Expo) | 文档指定                      |
| UI 组件库 | React Native Paper  | Material Design 风格          |
| 状态管理  | Zustand             | 轻量，比 Redux Toolkit 更简洁 |
| 路由      | React Navigation    | RN 生态标准                   |
| HTTP      | Axios               | 统一请求封装                  |
| 本地存储  | AsyncStorage        | 令牌持久化                    |
| 后端框架  | Java Spring Boot    | 文档指定                      |
| 数据库    | MySQL               | root / 123456                 |
| ORM       | Spring Data JPA     | 简化数据访问                  |
| 认证      | JWT                 | 模拟学校统一认证              |
| API 文档  | Swagger (SpringDoc) | 接口文档                      |

## 仓库结构

单仓库，`client/` + `server/` 双目录。

```
lanhangapp/
├── client/                          # React Native (Expo)
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/               # LoginScreen, RegisterScreen
│   │   │   ├── home/               # HomeScreen (搜索入口+分类)
│   │   │   ├── book/               # BookDetailScreen
│   │   │   ├── borrow/             # BorrowListScreen, BorrowHistoryScreen
│   │   │   └── profile/            # ProfileScreen, CardStatusScreen
│   │   ├── components/             # 通用组件 (BookCard, EmptyState, Loading...)
│   │   ├── store/                  # Zustand stores (auth, borrow, ...)
│   │   ├── api/                    # Axios 实例 + API 函数
│   │   ├── navigation/            # Stack + Tab Navigator
│   │   └── utils/                  # 工具函数、常量
│   ├── App.tsx
│   └── package.json
│
├── server/                          # Spring Boot
│   ├── src/main/java/com/nchu/library/
│   │   ├── controller/             # REST 控制器
│   │   ├── service/                # 业务逻辑层
│   │   ├── repository/             # JPA 仓库接口
│   │   ├── model/                  # 实体 (User, Book, BorrowRecord, Card)
│   │   ├── dto/                    # 请求/响应 DTO
│   │   ├── config/                 # SecurityConfig, CorsConfig
│   │   └── util/                   # JwtUtil, ...
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
└── docs/
    └── superpowers/specs/
```

## 分期规划

### 一期：用户 + 图书检索 + 借阅管理

优先级最高的三个模块，形成完整核心流程：认证 → 浏览 → 借阅。

#### 数据表

**user**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| student_id | VARCHAR(20) UNIQUE | 学号 (登录用) |
| password | VARCHAR(255) | BCrypt 加密 |
| name | VARCHAR(50) | 姓名 |
| phone | VARCHAR(20) | 手机号 |
| created_at | DATETIME | 注册时间 |

**card**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| user_id | BIGINT FK | 用户 |
| card_no | VARCHAR(20) UNIQUE | 借阅证号 |
| status | ENUM(active, frozen, lost) | 状态 |
| created_at | DATETIME | 办证时间 |

**book**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| isbn | VARCHAR(20) | ISBN 编号 |
| title | VARCHAR(200) | 书名 |
| author | VARCHAR(100) | 作者 |
| publisher | VARCHAR(100) | 出版社 |
| category | VARCHAR(50) | 分类 |
| location | VARCHAR(100) | 馆藏位置 |
| total | INT | 总库存 |
| available | INT | 可借数量 |
| cover | VARCHAR(500) | 封面图片URL |
| description | TEXT | 简介 |

**borrow_record**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| user_id | BIGINT FK | 借阅者 |
| book_id | BIGINT FK | 图书 |
| borrow_date | DATETIME | 借书时间 |
| due_date | DATETIME | 应还时间 |
| return_date | DATETIME NULL | 实际归还时间 |
| status | ENUM(borrowed, returned, overdue) | 状态 |
| renewed | BOOLEAN | 是否已续借 |

#### API 接口

| 方法 | 路径                    | 说明                                            | 认证 |
| ---- | ----------------------- | ----------------------------------------------- | ---- |
| POST | /api/auth/login         | 登录                                            | 否   |
| POST | /api/auth/register      | 注册                                            | 否   |
| GET  | /api/user/profile       | 个人信息                                        | 是   |
| GET  | /api/user/card-status   | 借阅证状态                                      | 是   |
| GET  | /api/books              | 搜索/分类查询 (?keyword=&category=&page=&size=) | 否   |
| GET  | /api/books/{id}         | 图书详情                                        | 否   |
| POST | /api/borrow             | 借书 {bookId}                                   | 是   |
| POST | /api/borrow/{id}/renew  | 续借                                            | 是   |
| POST | /api/borrow/{id}/return | 归还                                            | 是   |
| GET  | /api/borrow/current     | 当前借阅                                        | 是   |
| GET  | /api/borrow/history     | 借阅历史                                        | 是   |

### 二期：预约消息 + 系统设置

#### 新增数据表

**reservation**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| user_id | BIGINT FK | 预约者 |
| book_id | BIGINT FK | 图书 |
| reserve_date | DATETIME | 预约时间 |
| status | ENUM(pending, fulfilled, cancelled) | 状态 |
| notify_date | DATETIME NULL | 到书通知时间 |

**notification**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK | 主键 |
| user_id | BIGINT FK | 接收者 |
| type | ENUM(arrival, overdue, system) | 类型 |
| title | VARCHAR(200) | 标题 |
| content | TEXT | 内容 |
| read | BOOLEAN | 是否已读 |
| created_at | DATETIME | 时间 |

#### 新增 API

| 方法   | 路径                         | 说明     | 认证 |
| ------ | ---------------------------- | -------- | ---- |
| POST   | /api/reservations            | 预约图书 | 是   |
| GET    | /api/reservations            | 我的预约 | 是   |
| DELETE | /api/reservations/{id}       | 取消预约 | 是   |
| GET    | /api/notifications           | 消息列表 | 是   |
| PUT    | /api/notifications/{id}/read | 标记已读 | 是   |
| PUT    | /api/user/password           | 修改密码 | 是   |

## 认证方案

- 注册/登录用学号(student_id) + 密码
- 密码 BCrypt 加密存储
- 登录成功后服务端签发 JWT (24h 有效期)
- 前端将 JWT 存入 AsyncStorage，每次请求通过 Authorization header 携带
- Spring Security 配置 JWT 过滤器，拦截需要认证的接口
- 模拟学校统一认证：不接入真实 SSO，但 JWT 方案可无缝替换

## 错误处理

统一响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

异常分类：

- 400: 参数校验失败
- 401: 未登录/令牌过期
- 403: 无权限
- 404: 资源不存在
- 409: 业务冲突（如图书已借出）
- 500: 服务器内部错误

## 前端页面路由

```
Tab Navigator (底部导航)
├── 首页 HomeStack
│   ├── HomeScreen (搜索栏 + 分类列表)
│   └── BookDetailScreen
├── 借阅 BorrowStack
│   ├── BorrowListScreen (当前借阅)
│   ├── BookDetailScreen (嵌入)
│   └── BorrowHistoryScreen
└── 我的 ProfileStack
    ├── ProfileScreen (个人信息)
    ├── CardStatusScreen (借阅证状态)
    ├── LoginScreen (未登录时) / RegisterScreen

全局 Modal
└── BookSearchModal (全屏搜索页)
```

## 一期 vs 二期范围

| 模块     | 一期                            | 二期                     |
| -------- | ------------------------------- | ------------------------ |
| 用户模块 | 登录/注册、个人信息、借阅证状态 | —                        |
| 图书检索 | 关键字搜索、分类浏览、图书详情  | —                        |
| 借阅管理 | 借阅、续借、归还、借阅历史      | —                        |
| 预约消息 | —                               | 预约、到书通知、逾期提醒 |
| 系统设置 | —                               | 修改密码、关于           |
