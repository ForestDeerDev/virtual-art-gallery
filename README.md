<div align="center">

# 🎨 Virtual Art Gallery

  **把世界装进画廊，让艺术触手可及**

  [![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/yourusername/virtual-art-gallery)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.13-green?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
  [![Vue](https://img.shields.io/badge/Vue-3.3.4-brightgreen?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

  **一个打破时空界限的数字艺术殿堂，在这里，每一次点击都是一次艺术的邂逅**

  [English README](README_EN.md) • [快速开始](#-快速开始) • [功能特性](#-功能特性) • [技术架构](#-技术架构) • [在线演示](#-在线演示)

</div>

---

## ✨ 为什么选择我们？

> "艺术不是你看到了什么，而是你让别人看到了什么" —— 埃德加·德加

我们相信，艺术不应该被物理空间所限制。Virtual Art Gallery 不仅仅是一个管理系统，更是一个**连接创作者与欣赏者的数字桥梁**。

- 🌍 **零距离接触** - 3D虚拟画廊，足不出户漫步世界级艺术殿堂
- 🎯 **智能发现** - AI驱动的推荐系统，让每一件艺术品都能找到知音
- 🔒 **安全可靠** - 企业级安全架构，保护每一份创作
- ⚡ **极致体验** - 毫秒级响应，丝滑流畅的交互体验

---

## 🌟 功能特性

### 🖼️ 沉浸式3D画廊

```
想象一下：
你走进一间虚拟的画廊
灯光柔和地洒在每一幅画作上
你可以自由地走动、旋转、近距离观察
就像在卢浮宫、MoMA一样真实
```

- 基于 Three.js 构建的 WebGL 3D 引擎
- 支持第一人称视角的自由漫游
- 实时光影渲染，还原真实观展体验
- 交互式展品查看，支持缩放、旋转

### 🎨 艺术品全生命周期管理

- **上传** - 支持图片、视频等多种格式，一键上传
- **分类** - 智能标签系统，让艺术品井井有条
- **展示** - 多样化展示方式，瀑布流、网格、时间线
- **分享** - 一键分享到社交平台，让艺术传播更远

### � 社区互动生态

- 💬 **评论系统** - 分享你的观展感受，与艺术家深度交流
- ❤️ **点赞收藏** - 建立你的私人收藏馆
- 🏆 **艺术家认证** - 专属标识，彰显创作身份
- 📊 **数据洞察** - 了解你的作品影响力

### 🤖 AI智能推荐

> "它比你更懂你的艺术品味"

- 基于用户行为的协同过滤算法
- 标签相似度匹配推荐
- 实时学习，越用越懂你

### 🔐 企业级安全保障

- JWT + Spring Security 双重认证
- OAuth2 第三方登录支持
- 细粒度权限控制
- 数据加密传输

---

## 🏗️ 技术架构

### 前端技术栈

| 技术         | 版本    | 用途                     |
| ------------ | ------- | ------------------------ |
| Vue.js       | 3.3.4   | 渐进式JavaScript框架     |
| TypeScript   | 6.0.2   | 类型安全的JavaScript超集 |
| Vite         | 5.0.0   | 下一代前端构建工具       |
| Element Plus | 2.13.7  | Vue 3组件库              |
| Three.js     | 0.182.0 | 3D图形引擎               |
| Pinia        | 2.1.7   | 状态管理                 |
| Vue Router   | 4.2.5   | 官方路由管理器           |
| Axios        | 1.6.0   | HTTP客户端               |

### 后端技术栈

| 技术            | 版本   | 用途             |
| --------------- | ------ | ---------------- |
| Spring Boot     | 3.5.13 | Java应用开发框架 |
| Java            | 17     | 编程语言         |
| Spring Security | 6.x    | 安全框架         |
| Spring Data JPA | 3.x    | 数据持久化       |
| MySQL           | 8.0+   | 关系型数据库     |
| JWT             | 0.11.5 | JSON Web Token   |
| Lombok          | -      | Java代码简化     |
| MapStruct       | 1.5.5  | 对象映射框架     |

---

## 📁 项目结构

```bash
virtual-art-gallery/
├── 📂 backend/                    # 后端服务
│   ├── 📂 src/main/java/com/artgallery/
│   │   ├── 📂 controller/         # 🎮 控制器层 - API入口
│   │   ├── 📂 service/            # 💼 服务层 - 业务逻辑
│   │   ├── 📂 repository/          # 🗄️ 数据访问层 - 数据库操作
│   │   ├── 📂 entity/             # 📦 实体类 - 数据模型
│   │   ├── 📂 dto/                # 🔄 数据传输对象
│   │   ├── 📂 config/             # ⚙️ 配置类
│   │   ├── 📂 security/           # 🔒 安全配置
│   │   ├── 📂 oauth/              # 🔑 OAuth2配置
│   │   ├── 📂 exception/          # ⚠️ 异常处理
│   │   ├── 📂 mapper/             # 🗺️ 对象映射
│   │   └── 📂 util/               # 🛠️ 工具类
│   ├── 📄 build.gradle            # Gradle构建配置
│   └── 🚀 gradlew                 # Gradle包装器
│
├── 📂 frontend/                   # 前端应用
│   ├── 📂 src/
│   │   ├── 📂 api/                # 🌐 API接口封装
│   │   ├── 📂 assets/             # 🖼️ 静态资源
│   │   ├── 📂 components/         # 🧩 公共组件
│   │   ├── 📂 composables/        # 🔧 组合式函数
│   │   ├── 📂 directives/         # 📌 自定义指令
│   │   ├── 📂 router/             # 🛣️ 路由配置
│   │   ├── 📂 stores/             # 📦 状态管理
│   │   ├── 📂 styles/             # 🎨 全局样式
│   │   ├── 📂 utils/              # 🛠️ 工具函数
│   │   ├── 📂 views/              # 📄 页面组件
│   │   │   ├── 📂 admin/          # 👨‍💼 管理后台
│   │   │   ├── 📂 auth/           # 🔐 认证页面
│   │   │   └── 📂 user/           # 👤 用户页面
│   │   ├── 📄 App.vue             # 🏠 根组件
│   │   └── 📄 main.ts             # 🚀 入口文件
│   ├── 📄 package.json           # 📦 依赖配置
│   ├── 📄 vite.config.ts         # ⚡ Vite配置
│   └── 📄 tsconfig.json          # 🔷 TypeScript配置
│
├── 📄 .env                        # 🔐 环境变量
└── 📄 .gitignore                  # 🚫 Git忽略配置
```

---

## 🚀 快速开始

### 📋 环境要求

- **后端**: JDK 17+, MySQL 8.0+
- **前端**: Node.js 18+, npm 9+

### 🔧 后端启动

1. **克隆项目**

```bash
git clone https://github.com/yourusername/virtual-art-gallery.git
cd virtual-art-gallery/backend
```

2. **配置数据库**

```sql
CREATE DATABASE art_gallery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

3. **配置环境变量**

```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

4. **启动服务**

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

🎉 后端服务启动成功：`http://localhost:8080`

### 🎨 前端启动

1. **安装依赖**

```bash
cd frontend
npm install
```

2. **配置环境变量**

创建 `.env.local` 文件：

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

3. **启动开发服务器**

```bash
npm run dev
```

🎉 前端服务启动成功：`http://localhost:5173`

4. **构建生产版本**

```bash
npm run build
```

---

## ⚙️ 环境配置

### 后端环境变量 (.env)

```properties
# 🗄️ 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=art_gallery
DB_USERNAME=root
DB_PASSWORD=your_password

# 🔐 JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# 🔑 OAuth2配置
OAUTH2_GITHUB_CLIENT_ID=your_github_client_id
OAUTH2_GITHUB_CLIENT_SECRET=your_github_client_secret

# 📁 文件上传配置
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### 前端环境变量 (.env.local)

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 API接口

### 🔐 认证接口

| 方法 | 路径                   | 描述             |
| ---- | ---------------------- | ---------------- |
| POST | `/api/auth/register` | 用户注册         |
| POST | `/api/auth/login`    | 用户登录         |
| GET  | `/api/oauth/github`  | GitHub OAuth登录 |

### 🎨 艺术品接口

| 方法   | 路径                   | 描述           |
| ------ | ---------------------- | -------------- |
| GET    | `/api/artworks`      | 获取艺术品列表 |
| GET    | `/api/artworks/{id}` | 获取艺术品详情 |
| POST   | `/api/artworks`      | 创建艺术品     |
| PUT    | `/api/artworks/{id}` | 更新艺术品     |
| DELETE | `/api/artworks/{id}` | 删除艺术品     |

### 👤 用户接口

| 方法 | 路径                   | 描述         |
| ---- | ---------------------- | ------------ |
| GET  | `/api/users/profile` | 获取用户信息 |
| PUT  | `/api/users/profile` | 更新用户信息 |

### 💬 互动接口

| 方法 | 路径                          | 描述 |
| ---- | ----------------------------- | ---- |
| POST | `/api/interactions/like`    | 点赞 |
| POST | `/api/interactions/comment` | 评论 |

📖 详细API文档：`http://localhost:8080/api-docs` (Swagger UI)

---

## 🎯 核心亮点

### 🌐 3D虚拟画廊

> "这不是普通的图片展示，这是一次真正的艺术之旅"

- 使用 Three.js 构建 WebGL 3D 场景
- 支持第一人称视角的自由漫游
- 实时光影渲染，还原真实观展体验
- 交互式展品查看，支持缩放、旋转

### 🧠 智能推荐算法

> "它比你更懂你的艺术品味"

- 基于用户行为的协同过滤
- 标签相似度匹配
- 实时学习，越用越懂你

### 🔒 企业级安全

- JWT + Spring Security 双重认证
- OAuth2 第三方登录
- 细粒度权限控制
- 数据加密传输

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. 🍴 Fork 本仓库
2. 🌿 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 💾 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🔀 开启 Pull Request

---

## 📝 开源协议

本项目采用 [MIT License](LICENSE) 开源协议

---

## 👨‍� 作者

**Virtual Art Gallery Team**

> 用代码构建艺术，用技术连接世界

---

## 🙏 致谢

感谢以下开源项目：

- [Spring Boot](https://spring.io/projects/spring-boot) - 强大的Java应用框架
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Three.js](https://threejs.org/) - 3D图形引擎
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

<div align="center">

  **如果这个项目对你有帮助，请给我们一个 ⭐️**

  **让我们一起，让艺术触手可及** 🎨✨

  [回到顶部](#-virtual-art-gallery)

</div>
