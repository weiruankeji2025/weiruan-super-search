# 威软云剪 - Chrome 浏览器扩展

## 功能特性

- 🔄 自动捕获剪切板内容
- ☁️ 云端同步
- 🔍 快速搜索
- ⭐ 收藏管理
- 📊 使用统计

## 安装方法

### 开发者模式安装

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `browser-extension` 文件夹

### 快捷键

- `Ctrl+Shift+V` (Mac: `Cmd+Shift+V`) - 打开剪切板面板

## 权限说明

- **clipboardRead**: 读取剪切板内容
- **clipboardWrite**: 写入剪切板内容
- **storage**: 本地存储剪切板历史
- **alarms**: 定时检查剪切板变化

## 隐私保护

- 所有数据仅存储在本地
- 可选择排除密码等敏感内容
- 支持端到端加密

## 开发说明

### 文件结构

```
browser-extension/
├── manifest.json      # 扩展配置文件
├── background.js      # 后台服务脚本
├── popup.html        # 弹出窗口页面
├── popup.js          # 弹出窗口脚本
├── content.js        # 内容脚本
└── icons/           # 图标文件
```

### 构建图标

你需要准备以下尺寸的图标：
- 16x16
- 32x32
- 48x48
- 128x128

可以使用在线工具或设计软件创建。

## 浏览器兼容性

- Chrome 88+
- Edge 88+
- Opera 74+
- Brave

## 反馈

如有问题或建议，请访问项目主页。
