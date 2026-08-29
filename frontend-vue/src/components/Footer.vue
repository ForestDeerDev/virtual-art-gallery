<template>
  <footer class="footer">
    <!-- 装饰性背景 -->
    <div class="footer-bg"></div>

    <div class="container">
      <div class="footer-content">
        <!-- 品牌信息 -->
        <div class="footer-section brand">
          <div class="brand-logo">
            <el-icon :size="24" color="#6c5ce7" class="me-2"><Brush /></el-icon>
            <h3 class="brand-name">虚拟艺术画廊</h3>
          </div>
          <p class="brand-description">
            探索数字艺术的无限可能，发现来自世界各地的精美艺术作品。
            我们致力于为艺术家和艺术爱好者打造一个专业的在线艺术平台。
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <el-icon><Platform /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <el-icon><VideoPlay /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <el-icon><Picture /></el-icon>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <el-icon><ChatDotRound /></el-icon>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div class="footer-section links">
          <h4 class="section-title">快速链接</h4>
          <ul class="link-list">
            <li><router-link to="/home" class="footer-link">首页</router-link></li>
            <li><router-link to="/gallery" class="footer-link">画廊</router-link></li>
            <li><router-link to="/recommendations" class="footer-link">推荐作品</router-link></li>
            <li><router-link to="/virtual-gallery" class="footer-link">虚拟画廊</router-link></li>
            <li><router-link to="/upload" class="footer-link">上传作品</router-link></li>
          </ul>
        </div>

        <!-- 艺术家专区 -->
        <div class="footer-section artist">
          <h4 class="section-title">艺术家专区</h4>
          <ul class="link-list">
            <li><router-link to="/register" class="footer-link">成为艺术家</router-link></li>
            <li><a href="#" class="footer-link">艺术家指南</a></li>
            <li><a href="#" class="footer-link">作品管理</a></li>
            <li><a href="#" class="footer-link">销售统计</a></li>
          </ul>
        </div>

        <!-- 联系我们 -->
        <div class="footer-section contact">
          <h4 class="section-title">联系我们</h4>
          <ul class="contact-list">
            <li class="contact-item">
              <el-icon class="contact-icon"><Message /></el-icon>
              <span>contact@artgallery.com</span>
            </li>
            <li class="contact-item">
              <el-icon class="contact-icon"><Phone /></el-icon>
              <span>+86 123 567 8900</span>
            </li>
            <li class="contact-item">
              <el-icon class="contact-icon"><Location /></el-icon>
              <span>北京市朝阳区艺术区100号</span>
            </li>
          </ul>

          <!-- 订阅功能 -->
          <div class="subscribe-section">
            <h5 class="subscribe-title">订阅艺术资讯</h5>
            <form class="subscribe-form">
              <input type="email" placeholder="您的邮箱地址" class="subscribe-input" required />
              <button type="submit" class="subscribe-btn">
                <el-icon><Promotion /></el-icon>
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="footer-divider"></div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ new Date().getFullYear() }} 虚拟艺术画廊. 保留所有权利.
        </div>
        <div class="legal-links">
          <a href="#" class="legal-link">隐私政策</a>
          <a href="#" class="legal-link">服务条款</a>
          <a href="#" class="legal-link">Cookie政策</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
  position: relative;
  background-color: var(--dark-color);
  color: white;
  padding: 4rem 0 2rem;
  overflow: hidden;
  margin-top: auto;
}

/* 背景装饰 */
.footer-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(108, 92, 231, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 184, 148, 0.1) 0%, transparent 50%);
  z-index: 0;
}

.footer-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* 品牌信息 */
.footer-section.brand {
  max-width: 300px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

/* 社交媒体链接 */
.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: var(--primary-gradient);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  color: white;
}

/* 通用部分样式 */
.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: var(--radius-full);
}

/* 链接列表 */
.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.footer-link::before {
  content: '→';
  color: var(--primary-color);
  opacity: 0;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transform: translateX(-5px);
}

.footer-link:hover {
  color: var(--primary-light);
  transform: translateX(5px);
  text-decoration: none;
}

.footer-link:hover::before {
  opacity: 1;
  transform: translateX(0);
}

/* 联系列表 */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.contact-icon {
  color: var(--primary-light);
  font-size: 1.1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
}

/* 订阅区域 */
.subscribe-section {
  margin-top: 1.5rem;
}

.subscribe-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.subscribe-form {
  display: flex;
  gap: 0.5rem;
  position: relative;
}

.subscribe-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.subscribe-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.subscribe-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

.subscribe-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary-gradient);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
}

/* 分隔线 */
.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 2rem 0;
  position: relative;
  z-index: 1;
}

/* 底部版权信息 */
.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.copyright {
  margin: 0;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legal-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: var(--primary-light);
  text-decoration: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 2rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-section.brand {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .legal-links {
    justify-content: center;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .subscribe-btn {
    width: 100%;
    height: auto;
    padding: 0.75rem;
  }
}

@media (max-width: 576px) {
  .footer {
    padding: 2rem 0 1.5rem;
  }

  .footer-content {
    gap: 2rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .brand-name {
    font-size: 1.3rem;
  }
}
</style>
