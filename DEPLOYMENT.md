# 部署指南

本文档详细说明如何将运动打卡平台部署到各种云平台。

## 🚀 部署选项

### 1. Vercel 部署（推荐）

**优势**: 免费、快速、自动HTTPS、全球CDN

**步骤**:
1. 将项目推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "New Project" 导入 GitHub 仓库
4. Vercel 会自动检测到 `vercel.json` 配置
5. 点击 "Deploy" 开始部署
6. 部署完成后获得类似 `https://your-app.vercel.app` 的URL

**配置文件**: `vercel.json` 已包含所有必要配置

### 2. Netlify 部署

**优势**: 免费、简单、表单处理、函数支持

**步骤**:
1. 将项目推送到 GitHub 仓库
2. 访问 [netlify.com](https://netlify.com)
3. 点击 "New site from Git" 连接 GitHub
4. 选择仓库，Netlify 会读取 `netlify.toml` 配置
5. 点击 "Deploy site" 开始部署
6. 部署完成后获得 `https://random-name.netlify.app` 的URL

**配置文件**: `netlify.toml` 已包含构建和重定向配置

### 3. GitHub Pages 部署

**优势**: 完全免费、与 GitHub 集成

**步骤**:
1. 将项目推送到 GitHub 仓库
2. 进入仓库 Settings > Pages
3. Source 选择 "GitHub Actions"
4. 推送代码到 main 分支会自动触发部署
5. 部署完成后访问 `https://username.github.io/repository-name`

**配置文件**: `.github/workflows/deploy.yml` 已配置自动部署

### 4. 其他平台

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Surge.sh
```bash
npm install -g surge
npm run build
cd dist
surge
```

## 📋 部署前检查清单

- [ ] 确保 `npm run build` 能正常执行
- [ ] 检查 `dist/` 目录包含所有必要文件
- [ ] 验证路由在生产环境下正常工作
- [ ] 测试所有功能页面
- [ ] 确认移动端适配正常

## 🔧 环境变量配置

如果需要配置环境变量（如API密钥），在各平台设置：

**Vercel**: Project Settings > Environment Variables
**Netlify**: Site Settings > Environment Variables  
**GitHub Pages**: Repository Settings > Secrets

## 🌐 自定义域名

### Vercel
1. 在项目设置中添加自定义域名
2. 配置DNS记录指向Vercel

### Netlify
1. 在站点设置中添加自定义域名
2. 配置DNS记录或使用Netlify DNS

### GitHub Pages
1. 在仓库设置中配置自定义域名
2. 添加 CNAME 文件到项目根目录

## 🚨 常见问题

**Q: 部署后页面刷新出现404**
A: 确保配置了SPA重定向规则，所有路由都指向 `index.html`

**Q: 样式没有加载**
A: 检查构建输出，确保CSS文件正确生成和引用

**Q: 数据库连接失败**
A: 确认数据库配置和环境变量设置正确

## 📞 技术支持

如果在部署过程中遇到问题，请：
1. 检查构建日志中的错误信息
2. 确认所有依赖都已正确安装
3. 验证配置文件语法正确

---

选择最适合你的部署方案，开始分享你的运动打卡平台吧！ 🎉