<div align="center">

# 🎨 Virtual Art Gallery

  **Bring the world into a gallery, make art accessible**

  [![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/yourusername/virtual-art-gallery)
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.13-green?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
  [![Vue](https://img.shields.io/badge/Vue-3.3.4-brightgreen?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

  **A digital art sanctuary that breaks the boundaries of time and space, where every click is an artistic encounter**

  [Quick Start](#-quick-start) • [Features](#-features) • [Architecture](#-architecture) • [Demo](#-demo)

</div>

---

## ✨ Why Choose Us?

> "Art is not what you see, but what you make others see" — Edgar Degas

We believe that art should not be limited by physical space. Virtual Art Gallery is not just a management system, but a **digital bridge connecting creators and admirers**.

- 🌍 **Zero Distance** - 3D virtual gallery, walk through world-class art venues from home
- 🎯 **Smart Discovery** - AI-driven recommendation system, every artwork finds its audience
- 🔒 **Secure & Reliable** - Enterprise-grade security architecture, protecting every creation
- ⚡ **Ultimate Experience** - Millisecond response, silky smooth interaction

---

## 🌟 Features

### 🖼️ Immersive 3D Gallery

```
Imagine:
You walk into a virtual gallery
Soft lighting illuminates every painting
You can freely move, rotate, and observe up close
Just as real as the Louvre or MoMA
```

- WebGL 3D engine built with Three.js
- First-person perspective free roaming
- Real-time lighting rendering, authentic exhibition experience
- Interactive exhibit viewing with zoom and rotation support

### 🎨 Artwork Lifecycle Management

- **Upload** - Support multiple formats including images and videos, one-click upload
- **Categorize** - Smart tagging system, keeping artworks organized
- **Display** - Diverse display methods: waterfall, grid, timeline
- **Share** - One-click share to social platforms, spread art further

### 👥 Community Interaction Ecosystem

- 💬 **Comment System** - Share your exhibition experience, communicate deeply with artists
- ❤️ **Like & Collect** - Build your private collection
- 🏆 **Artist Verification** - Exclusive badge, showcase creative identity
- 📊 **Data Insights** - Understand your artwork's influence

### 🤖 AI Smart Recommendation

> "It knows your artistic taste better than you do"

- Collaborative filtering algorithm based on user behavior
- Tag similarity matching recommendations
- Real-time learning, gets smarter with use

### 🔐 Enterprise-Grade Security

- JWT + Spring Security dual authentication
- OAuth2 third-party login support
- Fine-grained permission control
- Encrypted data transmission

---

## 🏗️ Technical Architecture

### Frontend Stack

| Technology  | Version | Purpose                          |
| ----------- | ------- | -------------------------------- |
| Vue.js     | 3.3.4   | Progressive JavaScript framework |
| TypeScript | 6.0.2   | Type-safe JavaScript superset    |
| Vite       | 5.0.0   | Next-generation frontend build tool |
| Element Plus | 2.13.7 | Vue 3 component library          |
| Three.js   | 0.182.0 | 3D graphics engine               |
| Pinia      | 2.1.7   | State management                |
| Vue Router | 4.2.5   | Official router manager          |
| Axios      | 1.6.0   | HTTP client                      |

### Backend Stack

| Technology      | Version | Purpose                  |
| --------------- | ------- | ------------------------ |
| Spring Boot     | 3.5.13  | Java application framework |
| Java            | 17      | Programming language     |
| Spring Security | 6.x     | Security framework       |
| Spring Data JPA | 3.x     | Data persistence         |
| MySQL           | 8.0+    | Relational database      |
| JWT             | 0.11.5  | JSON Web Token           |
| Lombok          | -       | Java code simplification |
| MapStruct       | 1.5.5   | Object mapping framework |

---

## 📁 Project Structure

```bash
virtual-art-gallery/
├── 📂 backend/                    # Backend service
│   ├── 📂 src/main/java/com/artgallery/
│   │   ├── 📂 controller/         # 🎮 Controller layer - API entry
│   │   ├── 📂 service/            # 💼 Service layer - Business logic
│   │   ├── 📂 repository/          # 🗄️ Data access layer - Database operations
│   │   ├── 📂 entity/             # 📦 Entity classes - Data models
│   │   ├── 📂 dto/                # 🔄 Data transfer objects
│   │   ├── 📂 config/             # ⚙️ Configuration classes
│   │   ├── 📂 security/           # 🔒 Security configuration
│   │   ├── 📂 oauth/              # 🔑 OAuth2 configuration
│   │   ├── 📂 exception/          # ⚠️ Exception handling
│   │   ├── 📂 mapper/             # 🗺️ Object mapping
│   │   └── 📂 util/               # 🛠️ Utility classes
│   ├── 📄 build.gradle            # Gradle build configuration
│   └── 🚀 gradlew                 # Gradle wrapper
│
├── 📂 frontend/                   # Frontend application
│   ├── 📂 src/
│   │   ├── 📂 api/                # 🌐 API interface封装
│   │   ├── 📂 assets/             # 🖼️ Static resources
│   │   ├── 📂 components/         # 🧩 Common components
│   │   ├── 📂 composables/        # 🔧 Composable functions
│   │   ├── 📂 directives/         # 📌 Custom directives
│   │   ├── 📂 router/             # 🛣️ Router configuration
│   │   ├── 📂 stores/             # 📦 State management
│   │   ├── 📂 styles/             # 🎨 Global styles
│   │   ├── 📂 utils/              # 🛠️ Utility functions
│   │   ├── 📂 views/              # 📄 Page components
│   │   │   ├── 📂 admin/          # 👨‍💼 Admin dashboard
│   │   │   ├── 📂 auth/           # 🔐 Authentication pages
│   │   │   └── 📂 user/           # 👤 User pages
│   │   ├── 📄 App.vue             # 🏠 Root component
│   │   └── 📄 main.ts             # 🚀 Entry file
│   ├── 📄 package.json           # 📦 Dependency configuration
│   ├── 📄 vite.config.ts         # ⚡ Vite configuration
│   └── 📄 tsconfig.json          # 🔷 TypeScript configuration
│
├── 📄 .env                        # 🔐 Environment variables
└── 📄 .gitignore                  # 🚫 Git ignore configuration
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Backend**: JDK 17+, MySQL 8.0+
- **Frontend**: Node.js 18+, npm 9+

### 🔧 Backend Setup

1. **Clone the project**

```bash
git clone https://github.com/yourusername/virtual-art-gallery.git
cd virtual-art-gallery/backend
```

2. **Configure database**

```sql
CREATE DATABASE art_gallery
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env file and fill in your configuration
```

4. **Start service**

```bash
# Windows
gradlew.bat bootRun

# Linux/Mac
./gradlew bootRun
```

🎉 Backend service started successfully: `http://localhost:8080`

### 🎨 Frontend Setup

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Configure environment variables**

Create `.env.local` file:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

3. **Start development server**

```bash
npm run dev
```

🎉 Frontend service started successfully: `http://localhost:5173`

4. **Build for production**

```bash
npm run build
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables (.env)

```properties
# 🗄️ Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=art_gallery
DB_USERNAME=root
DB_PASSWORD=your_password

# 🔐 JWT configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# 🔑 OAuth2 configuration
OAUTH2_GITHUB_CLIENT_ID=your_github_client_id
OAUTH2_GITHUB_CLIENT_SECRET=your_github_client_secret

# 📁 File upload configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables (.env.local)

```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 API Endpoints

### 🔐 Authentication Endpoints

| Method | Path                    | Description              |
| ------ | ----------------------- | ------------------------ |
| POST   | `/api/auth/register`   | User registration        |
| POST   | `/api/auth/login`      | User login               |
| GET    | `/api/oauth/github`    | GitHub OAuth login       |

### 🎨 Artwork Endpoints

| Method   | Path                    | Description              |
| -------- | ----------------------- | ------------------------ |
| GET      | `/api/artworks`        | Get artwork list         |
| GET      | `/api/artworks/{id}`   | Get artwork details      |
| POST     | `/api/artworks`        | Create artwork           |
| PUT      | `/api/artworks/{id}`   | Update artwork           |
| DELETE   | `/api/artworks/{id}`   | Delete artwork           |

### 👤 User Endpoints

| Method | Path                    | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/users/profile`   | Get user information     |
| PUT    | `/api/users/profile`   | Update user information  |

### 💬 Interaction Endpoints

| Method | Path                          | Description |
| ------ | ----------------------------- | ----------- |
| POST   | `/api/interactions/like`    | Like       |
| POST   | `/api/interactions/comment` | Comment     |

📖 Detailed API documentation: `http://localhost:8080/api-docs` (Swagger UI)

---

## 🎯 Core Highlights

### 🌐 3D Virtual Gallery

> "This is not just an ordinary image display, it's a true artistic journey"

- WebGL 3D scene built with Three.js
- First-person perspective free roaming
- Real-time lighting rendering, authentic exhibition experience
- Interactive exhibit viewing with zoom and rotation support

### 🧠 Smart Recommendation Algorithm

> "It knows your artistic taste better than you do"

- Collaborative filtering based on user behavior
- Tag similarity matching
- Real-time learning, gets smarter with use

### 🔒 Enterprise-Grade Security

- JWT + Spring Security dual authentication
- OAuth2 third-party login
- Fine-grained permission control
- Encrypted data transmission

---

## 🤝 Contributing

We welcome all forms of contributions!

1. 🍴 Fork this repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

---

## 📝 License

This project is licensed under the [MIT License](LICENSE)

---

## 👨‍💻 Author

**Virtual Art Gallery Team**

> Building art with code, connecting the world with technology

---

## 🙏 Acknowledgments

Thanks to the following open source projects:

- [Spring Boot](https://spring.io/projects/spring-boot) - Powerful Java application framework
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Three.js](https://threejs.org/) - 3D graphics engine
- [Element Plus](https://element-plus.org/) - Vue 3 component library
- [Vite](https://vitejs.dev/) - Next-generation frontend build tool

---

<div align="center">

  **If this project helps you, please give us a ⭐️**

  **Let's make art accessible together** 🎨✨

  [Back to Top](#-virtual-art-gallery)

</div>
