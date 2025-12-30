/**
 * Popup脚本
 */

let allItems = [];
let searchQuery = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadItems();
  bindEvents();
});

// 绑定事件
function bindEvents() {
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderItems();
  });

  document.getElementById('syncBtn')?.addEventListener('click', () => {
    syncNow();
  });

  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('openWebApp')?.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://your-app-url.com/clipboard.html' });
  });
}

// 加载项目
function loadItems() {
  chrome.runtime.sendMessage({ action: 'getItems' }, (response) => {
    if (response && response.items) {
      allItems = response.items;
      renderItems();
    }
  });
}

// 渲染项目
function renderItems() {
  const container = document.getElementById('itemsContainer');

  let items = allItems;

  // 搜索过滤
  if (searchQuery) {
    items = items.filter(item =>
      item.content.toLowerCase().includes(searchQuery)
    );
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>${searchQuery ? '未找到匹配项' : '暂无剪切板记录'}</p>
        <p style="font-size: 12px; margin-top: 8px;">复制内容后会自动出现在这里</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => createClipItem(item)).join('');

  // 绑定点击事件
  bindItemEvents();
}

// 创建剪切板项
function createClipItem(item) {
  const typeIcons = {
    text: '📝',
    url: '🔗',
    code: '💻',
    image: '🖼️'
  };

  const icon = typeIcons[item.type] || '📄';
  const preview = getPreview(item.content, 100);
  const timeAgo = formatTimeAgo(item.timestamp);

  return `
    <div class="clip-item" data-id="${item.id}">
      <div class="clip-header">
        <span class="clip-type">${icon} ${item.type}</span>
        <span class="clip-time">${timeAgo}</span>
      </div>
      <div class="clip-content">${escapeHtml(preview)}</div>
      <div class="clip-actions">
        <button class="clip-action-btn copy-btn" data-id="${item.id}">复制</button>
        <button class="clip-action-btn delete-btn" data-id="${item.id}">删除</button>
      </div>
    </div>
  `;
}

// 绑定项目事件
function bindItemEvents() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      copyItem(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      deleteItem(id);
    });
  });
}

// 复制项目
function copyItem(id) {
  const item = allItems.find(i => i.id === id);
  if (!item) return;

  chrome.runtime.sendMessage({
    action: 'copyToClipboard',
    content: item.content
  }, (response) => {
    if (response.success) {
      showToast('已复制');
    }
  });
}

// 删除项目
function deleteItem(id) {
  chrome.runtime.sendMessage({
    action: 'deleteItem',
    id: id
  }, (response) => {
    if (response.success) {
      allItems = allItems.filter(item => item.id !== id);
      renderItems();
      showToast('已删除');
    }
  });
}

// 立即同步
function syncNow() {
  showToast('同步中...');
  // 实现同步逻辑
  setTimeout(() => {
    showToast('同步完成');
  }, 1000);
}

// 显示提示
function showToast(message) {
  // 简单的提示实现
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 60px;
    right: 16px;
    background: #1e293b;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    z-index: 1000;
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}

// 获取预览
function getPreview(content, maxLength) {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}

// 格式化时间
function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else {
    return `${Math.floor(diff / day)}天前`;
  }
}

// HTML转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'itemAdded') {
    loadItems();
  }
});
