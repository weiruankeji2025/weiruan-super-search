# 威软工具套件

> 包含超级搜索工具和智能云剪切板两大核心产品

## 📦 产品列表

### 1. 威软快搜 - 超级搜索工具 🔍

一站式超级搜索工具，支持网页、网盘、论坛等多源搜索，具备热搜榜单、搜索历史、实用工具等功能。

**访问入口**: [index.html](index.html)

### 2. 威软云剪 - 智能云剪切板 📋

功能完善的网络剪切板应用，支持多端同步、高频词统计、自动备份等功能。

**访问入口**: [clipboard.html](clipboard.html)
**详细文档**: [CLIPBOARD_README.md](CLIPBOARD_README.md)

---

## 威软快搜 - 功能介绍

## 功能特点

### 多源搜索
- **综合搜索**：百度、必应、谷歌、搜狗、360搜索
- **网盘搜索**：盘搜搜、大力盘、56网盘、易搜
- **学术搜索**：谷歌学术、知网、万方
- **论坛搜索**：知乎、贴吧、微博、豆瓣
- **视频搜索**：B站、优酷、爱奇艺
- **图片搜索**：百度图片、谷歌图片
- **文档搜索**：百度文库、豆丁
- **软件搜索**：GitHub、Gitee

### 热搜功能
- 微博热搜
- 百度热搜
- 知乎热榜
- 抖音热点
- 支持一键刷新

### 快捷工具
- 在线翻译
- 计算器
- 天气查询
- IP查询
- 快递查询
- 二维码生成
- 颜色转换
- 时间戳转换

### 其他特性
- 搜索历史记录
- 智能搜索建议
- 关键词高亮匹配
- 深色/浅色主题切换
- 响应式设计，支持移动端
- 快捷键支持（按 `/` 快速搜索）

## 技术栈

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- JavaScript (ES6+)
- LocalStorage 本地存储

## 项目结构

```
weiruan-super-search/
├── index.html                  # 快搜主页面
├── clipboard.html              # 云剪主页面
├── css/
│   ├── style.css              # 快搜样式
│   └── clipboard.css          # 云剪样式
├── js/
│   ├── config.js              # 快搜配置
│   ├── search.js              # 搜索模块
│   ├── hotSearch.js           # 热搜模块
│   ├── tools.js               # 工具模块
│   ├── app.js                 # 快搜主应用
│   └── clipboard/             # 云剪模块
│       ├── storage.js         # 存储管理
│       ├── sync.js            # 多端同步
│       ├── auth.js            # 用户认证
│       ├── analytics.js       # 数据分析
│       ├── backup.js          # 云端备份
│       └── app.js             # 云剪主应用
├── browser-extension/         # 浏览器扩展
│   ├── manifest.json
│   ├── background.js
│   ├── popup.html
│   ├── popup.js
│   └── content.js
├── LICENSE
├── README.md                  # 项目总览
└── CLIPBOARD_README.md        # 云剪详细文档
```

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/your-username/weiruan-super-search.git
```

2. 直接在浏览器中打开 `index.html` 即可使用

或者使用本地服务器：
```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx serve
```

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `/` | 聚焦搜索框 |
| `Ctrl/Cmd + K` | 聚焦并选中搜索框 |
| `Enter` | 执行搜索 |
| `Esc` | 关闭弹窗 |

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 其他现代浏览器

## 开发计划

### 威软快搜
- [ ] 接入真实搜索API
- [ ] 添加更多搜索引擎
- [ ] 实时热搜数据
- [ ] 用户账号系统
- [ ] 搜索结果聚合展示
- [ ] PWA支持

### 威软云剪
- [x] 基础剪切板功能
- [x] 本地存储和搜索
- [x] 高频词统计
- [x] 浏览器扩展
- [ ] 真实OAuth集成
- [ ] 云端同步功能
- [ ] 移动端应用

## 许可证

MIT License

## 作者

威软科技

---

**威软快搜** - 您的智能搜索助手
