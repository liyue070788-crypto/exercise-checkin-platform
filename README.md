# 运动打卡平台

一个简洁高效的运动打卡平台，支持每日早晚两次打卡，记录运动习惯，提供统计分析功能。

## 🌟 功能特性

- ✅ **每日打卡**: 支持早晚两次打卡记录
- 📋 **记录查看**: 按月查看历史打卡记录
- 📊 **数据统计**: 累计天数、连续打卡等多维度统计
- 💪 **激励系统**: 每次打卡后显示随机鼓励语句
- 📱 **移动优化**: 专为移动端设计的响应式界面

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 部署到云平台

#### Vercel 部署
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

#### Netlify 部署
1. 将代码推送到 GitHub
2. 在 [Netlify](https://netlify.com) 连接仓库
3. 构建设置会自动读取 `netlify.toml`

#### GitHub Pages 部署
1. 启用仓库的 GitHub Pages 功能
2. 推送代码到 main 分支
3. GitHub Actions 自动构建并部署

## 🛠 技术栈

- **前端框架**: React 18
- **路由**: React Router DOM (Hash模式)
- **样式**: Tailwind CSS
- **构建工具**: Webpack 5
- **数据库**: PostgreSQL (onedaybase)
- **API客户端**: @supabase/postgrest-js

## 📱 界面预览

- **打卡页面**: 简洁的早晚打卡界面
- **记录页面**: 按月查看打卡历史
- **统计页面**: 详细的运动数据分析

## 🔧 配置说明

### 路由配置
应用使用 Hash 路由模式，支持以下页面：
- `/` 或 `/checkin` - 打卡页面
- `/records` - 记录页面
- `/stats` - 统计页面

### 数据存储
- 使用 PostgreSQL 数据库持久化存储
- 支持用户数据隔离和安全访问
- 自动备份和数据恢复

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**开始你的运动打卡之旅吧！** 💪