/**
 * Content Script
 * 在网页中注入，监听复制事件
 */

// 监听复制事件
document.addEventListener('copy', (e) => {
  try {
    const text = window.getSelection().toString();

    if (text && text.trim()) {
      // 发送到background
      chrome.runtime.sendMessage({
        action: 'clipboardCopied',
        content: text
      });
    }
  } catch (error) {
    console.error('处理复制事件失败:', error);
  }
});

// 监听剪切事件
document.addEventListener('cut', (e) => {
  try {
    const text = window.getSelection().toString();

    if (text && text.trim()) {
      chrome.runtime.sendMessage({
        action: 'clipboardCut',
        content: text
      });
    }
  } catch (error) {
    console.error('处理剪切事件失败:', error);
  }
});

// 监听来自popup的快捷键
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelection') {
    const text = window.getSelection().toString();
    sendResponse({ selection: text });
  }
});
