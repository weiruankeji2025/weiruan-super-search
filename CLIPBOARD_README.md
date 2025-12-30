# 威软云剪 - 智能云剪切板 📋

> 功能完善的网络剪切板应用，支持多端同步、高频词统计、自动备份等功能

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## ✨ 功能特性

### 🔄 核心功能

- **自动捕获剪切板** - 通过浏览器扩展自动捕获系统复制内容
- **多端同步** - 云端实时同步，支持多设备登录
- **智能分类** - 自动识别文本、链接、代码、图片等类型
- **快速搜索** - 全文搜索，快速找到历史内容
- **收藏管理** - 收藏常用内容，一键访问

### 📊 高级功能

- **高频词统计** - 自动分析使用频率，智能推荐
- **词云展示** - 可视化展示高频词汇
- **使用分析** - 按时间、类型、长度等维度统计
- **智能推荐** - 基于使用频率和时间的智能推荐

### ☁️ 云端备份

- **多平台支持** - Google Drive、OneDrive、Dropbox
- **自动备份** - 定时自动备份到云端
- **一键恢复** - 快速从备份恢复数据
- **数据导出** - 支持JSON格式导出

### 🔐 安全与隐私

- **排除密码** - 自动识别并排除可能的密码内容
- **端到端加密** - 敏感内容加密存储
- **本地优先** - 数据优先存储在本地
- **隐私保护** - 可选择是否云端同步

### 🎨 用户体验

- **现代化设计** - 简洁优雅的界面，去AI味
- **深色模式** - 支持深色/浅色主题切换
- **响应式布局** - 完美适配桌面和移动设备
- **快捷键支持** - 提高操作效率

### 🔑 一键登录

支持主流OAuth登录方式：
- Google 账号
- Microsoft 账号
- GitHub 账号
- Twitter (X) 账号

## 🚀 快速开始

### 在线体验

访问 [https://your-domain.com/clipboard.html](https://your-domain.com/clipboard.html)

### 本地运行

1. 克隆仓库
```bash
git clone https://github.com/weiruankeji2025/weiruan-super-search.git
cd weiruan-super-search
```

2. 使用本地服务器运行
```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve
```

3. 打开浏览器访问 `http://localhost:8080/clipboard.html`

### 安装浏览器扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `browser-extension` 文件夹

详细说明请查看 [browser-extension/README.md](browser-extension/README.md)

## 📖 使用指南

### 基本操作

1. **添加内容**
   - 复制任何内容，自动捕获（需安装扩展）
   - 点击"新建"按钮手动添加

2. **搜索内容**
   - 使用顶部搜索框快速查找
   - 支持全文搜索和标签搜索

3. **管理内容**
   - 点击星标收藏常用内容
   - 点击复制按钮一键复制
   - 点击删除按钮移除内容

4. **查看详情**
   - 点击卡片查看完整内容
   - 查看使用统计和创建时间

### 高频词分析

1. 切换到"高频词"视图
2. 选择时间范围（今天/本周/本月/全部）
3. 查看统计数据和词云
4. 点击词汇快速搜索相关内容

### 云端备份

1. 切换到"云备份"视图
2. 连接你的云存储账号
3. 配置自动备份频率
4. 点击"立即备份"手动备份
5. 需要时点击"从备份恢复"

### 设置选项

在设置页面可以配置：
- 自动同步开关
- 历史记录保存数量
- 声音提示
- 隐私保护选项

## 🛠️ 技术架构

### 前端技术

- **HTML5** - 语义化标签
- **CSS3** - 现代化样式，CSS Variables
- **JavaScript (ES6+)** - 模块化开发

### 核心模块

```
js/clipboard/
├── storage.js      # 本地存储管理
├── sync.js         # 多端同步
├── auth.js         # 用户认证
├── analytics.js    # 数据分析
├── backup.js       # 云端备份
└── app.js          # 主应用逻辑
```

### 数据存储

- **LocalStorage** - 本地数据存储
- **IndexedDB** - 大容量存储（可选）
- **Cloud Storage** - 云端同步存储

### API集成

- OAuth 2.0 - 第三方登录
- Google Drive API - 云盘备份
- OneDrive API - 云盘备份
- Dropbox API - 云盘备份

## 🔧 配置说明

### OAuth配置

在 `js/clipboard/auth.js` 中配置OAuth客户端ID：

```javascript
oauthConfigs: {
    google: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        // ...
    },
    // ...
}
```

### 云存储配置

在 `js/clipboard/backup.js` 中配置云存储API：

```javascript
oauthConfig: {
    googledrive: {
        clientId: 'YOUR_GOOGLE_CLIENT_ID',
        // ...
    },
    // ...
}
```

### 同步服务器

在 `js/clipboard/sync.js` 中配置同步服务器地址：

```javascript
this.syncEndpoint = 'https://your-api-domain.com/sync';
```

## 📱 浏览器扩展

### 功能特性

- 自动捕获剪切板内容
- 实时同步到云端
- 快捷键快速访问
- 轻量级弹出窗口

### 快捷键

- `Ctrl+Shift+V` (Mac: `Cmd+Shift+V`) - 打开剪切板面板

### 权限说明

- `clipboardRead` - 读取剪切板
- `clipboardWrite` - 写入剪切板
- `storage` - 本地存储
- `alarms` - 定时任务

## 🎯 最佳实践

### 性能优化

1. **限制历史数量** - 建议设置为500-1000条
2. **定期清理** - 删除不需要的内容
3. **使用收藏** - 收藏常用内容，提高查找效率

### 隐私保护

1. **启用密码排除** - 防止密码被保存
2. **敏感内容加密** - 开启加密存储
3. **定期导出备份** - 防止数据丢失

### 使用技巧

1. **标签管理** - 为内容添加标签，方便分类
2. **快捷搜索** - 使用 `Ctrl+K` 快速搜索
3. **高频词分析** - 定期查看高频词，了解使用习惯

## 🔍 常见问题

### Q: 如何自动捕获剪切板？
A: 需要安装浏览器扩展，网页端受浏览器安全限制，只能捕获粘贴事件。

### Q: 数据存储在哪里？
A: 默认存储在浏览器LocalStorage，登录后可同步到云端。

### Q: 是否支持移动端？
A: 网页版支持移动浏览器访问，原生移动应用正在开发中。

### Q: 数据会丢失吗？
A: 建议开启自动备份功能，定期备份到云端，防止数据丢失。

### Q: 如何取消同步？
A: 在设置中关闭"自动同步"开关，或退出登录。

## 🗺️ 开发路线图

### v1.0.0 ✅
- [x] 基础剪切板功能
- [x] 本地存储
- [x] 搜索和过滤
- [x] 浏览器扩展

### v1.1.0 🚧
- [ ] 真实OAuth集成
- [ ] 云端同步API
- [ ] 云存储备份
- [ ] 移动端优化

### v1.2.0 📋
- [ ] 团队协作功能
- [ ] 分享功能
- [ ] 更多数据分析
- [ ] AI智能推荐

### v2.0.0 🎯
- [ ] 桌面客户端
- [ ] 移动端应用
- [ ] 企业版功能
- [ ] API开放平台

## 🤝 贡献指南

欢迎贡献代码、提出建议或报告问题！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 作者

**威软科技**

- 网站: [https://weiruan.com](https://weiruan.com)
- GitHub: [@weiruankeji2025](https://github.com/weiruankeji2025)

## 🙏 致谢

感谢所有贡献者和使用者的支持！

## 📞 联系方式

- 问题反馈: [GitHub Issues](https://github.com/weiruankeji2025/weiruan-super-search/issues)
- 功能建议: [GitHub Discussions](https://github.com/weiruankeji2025/weiruan-super-search/discussions)

---

**威软云剪** - 让剪切板更智能 📋✨
