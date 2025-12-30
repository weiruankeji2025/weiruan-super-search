/**
 * 后台服务脚本
 * 监听剪切板变化并同步数据
 */

let lastClipboardContent = '';
let checkInterval = 1000; // 每秒检查一次

// 安装时初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('威软云剪扩展已安装');

  // 创建定时器监听剪切板
  chrome.alarms.create('checkClipboard', {
    periodInMinutes: 1 / 60 // 每秒检查
  });

  // 设置默认配置
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({
        settings: {
          autoCapture: true,
          syncEnabled: true,
          notificationEnabled: true,
          excludePasswords: true
        }
      });
    }
  });
});

// 监听定时器
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkClipboard') {
    checkClipboard();
  }
});

// 检查剪切板
async function checkClipboard() {
  try {
    // 获取设置
    const { settings } = await chrome.storage.sync.get(['settings']);

    if (!settings || !settings.autoCapture) {
      return;
    }

    // 读取剪切板
    const text = await readClipboard();

    if (text && text !== lastClipboardContent) {
      lastClipboardContent = text;

      // 检查是否排除密码
      if (settings.excludePasswords && isPossiblyPassword(text)) {
        return;
      }

      // 保存到存储
      await saveClipboardItem(text);

      // 显示通知
      if (settings.notificationEnabled) {
        showNotification(text);
      }

      // 同步到云端
      if (settings.syncEnabled) {
        syncToCloud(text);
      }
    }
  } catch (error) {
    console.error('检查剪切板失败:', error);
  }
}

// 读取剪切板
async function readClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    // 如果直接读取失败，尝试通过content script读取
    return null;
  }
}

// 保存剪切板项
async function saveClipboardItem(content) {
  try {
    const { items = [] } = await chrome.storage.local.get(['items']);

    // 检查是否已存在
    const existingIndex = items.findIndex(item => item.content === content);

    const newItem = {
      id: Date.now().toString(),
      content: content,
      type: detectType(content),
      timestamp: Date.now(),
      frequency: 1,
      isFavorite: false,
      source: 'extension'
    };

    if (existingIndex !== -1) {
      items[existingIndex].frequency++;
      items[existingIndex].timestamp = Date.now();
      items.splice(existingIndex, 1);
      items.unshift(items[existingIndex]);
    } else {
      items.unshift(newItem);
    }

    // 限制数量
    if (items.length > 500) {
      items.splice(500);
    }

    await chrome.storage.local.set({ items });

    // 通知popup更新
    chrome.runtime.sendMessage({ action: 'itemAdded', item: newItem });

  } catch (error) {
    console.error('保存失败:', error);
  }
}

// 检测内容类型
function detectType(content) {
  const urlPattern = /^https?:\/\/.+/i;
  if (urlPattern.test(content.trim())) {
    return 'url';
  }

  const codePatterns = [
    /^(function|class|const|let|var|import|export)/,
    /{\s*[\w\s:;,()=>[\]{}]+\s*}/,
    /<[a-z][\s\S]*>/i
  ];

  if (codePatterns.some(pattern => pattern.test(content))) {
    return 'code';
  }

  return 'text';
}

// 检查是否可能是密码
function isPossiblyPassword(content) {
  const passwordPatterns = [
    /password/i,
    /passwd/i,
    /pwd/i,
    /^[a-zA-Z0-9!@#$%^&*]{8,}$/,
    /^\d{6,}$/
  ];

  return passwordPatterns.some(pattern => pattern.test(content));
}

// 显示通知
function showNotification(text) {
  const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: '已捕获剪切板',
    message: preview,
    priority: 0
  });
}

// 同步到云端
async function syncToCloud(text) {
  try {
    // 获取用户token
    const { authToken } = await chrome.storage.sync.get(['authToken']);

    if (!authToken) {
      return;
    }

    // 发送到服务器
    await fetch('https://api.weiruan-clipboard.com/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        content: text,
        timestamp: Date.now()
      })
    });

  } catch (error) {
    console.error('同步失败:', error);
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getItems') {
    chrome.storage.local.get(['items'], (result) => {
      sendResponse({ items: result.items || [] });
    });
    return true;
  }

  if (request.action === 'copyToClipboard') {
    navigator.clipboard.writeText(request.content).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (request.action === 'deleteItem') {
    chrome.storage.local.get(['items'], async (result) => {
      const items = result.items || [];
      const filtered = items.filter(item => item.id !== request.id);
      await chrome.storage.local.set({ items: filtered });
      sendResponse({ success: true });
    });
    return true;
  }
});

// 监听快捷键
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-clipboard') {
    chrome.action.openPopup();
  }
});
