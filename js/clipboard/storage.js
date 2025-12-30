/**
 * 剪切板存储管理模块
 * 负责本地存储和数据管理
 */

class ClipboardStorage {
    constructor() {
        this.storageKey = 'weiruan_clipboard_items';
        this.settingsKey = 'weiruan_clipboard_settings';
        this.favoritesKey = 'weiruan_clipboard_favorites';
        this.maxItems = this.getSettings().historyLimit || 500;
    }

    /**
     * 获取所有剪切板项
     */
    getItems() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('获取剪切板数据失败:', error);
            return [];
        }
    }

    /**
     * 添加剪切板项
     */
    addItem(content, type = 'text', tags = []) {
        const items = this.getItems();

        // 检查是否已存在相同内容
        const existingIndex = items.findIndex(item => item.content === content);

        const newItem = {
            id: Date.now().toString(),
            content: content,
            type: type,
            tags: tags,
            timestamp: Date.now(),
            frequency: 1,
            isFavorite: false,
            deviceId: this.getDeviceId()
        };

        if (existingIndex !== -1) {
            // 如果已存在，更新频率和时间
            items[existingIndex].frequency++;
            items[existingIndex].timestamp = Date.now();
            newItem.id = items[existingIndex].id;
            newItem.frequency = items[existingIndex].frequency;
            newItem.isFavorite = items[existingIndex].isFavorite;
            items.splice(existingIndex, 1);
        }

        // 添加到开头
        items.unshift(newItem);

        // 限制数量
        if (this.maxItems > 0 && items.length > this.maxItems) {
            items.splice(this.maxItems);
        }

        this.saveItems(items);
        return newItem;
    }

    /**
     * 更新剪切板项
     */
    updateItem(id, updates) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this.saveItems(items);
            return items[index];
        }
        return null;
    }

    /**
     * 删除剪切板项
     */
    deleteItem(id) {
        const items = this.getItems();
        const filtered = items.filter(item => item.id !== id);
        this.saveItems(filtered);
    }

    /**
     * 清空所有剪切板项
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * 保存剪切板项
     */
    saveItems(items) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(items));
        } catch (error) {
            console.error('保存剪切板数据失败:', error);
            // 如果存储满了，删除最旧的项
            if (error.name === 'QuotaExceededError') {
                items.splice(-100); // 删除最后100项
                this.saveItems(items);
            }
        }
    }

    /**
     * 切换收藏状态
     */
    toggleFavorite(id) {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items[index].isFavorite = !items[index].isFavorite;
            this.saveItems(items);
            return items[index];
        }
        return null;
    }

    /**
     * 获取收藏项
     */
    getFavorites() {
        return this.getItems().filter(item => item.isFavorite);
    }

    /**
     * 搜索剪切板项
     */
    searchItems(query) {
        const items = this.getItems();
        const lowerQuery = query.toLowerCase();

        return items.filter(item =>
            item.content.toLowerCase().includes(lowerQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    /**
     * 按类型过滤
     */
    filterByType(type) {
        if (type === 'all') return this.getItems();
        return this.getItems().filter(item => item.type === type);
    }

    /**
     * 排序剪切板项
     */
    sortItems(sortType) {
        const items = this.getItems();

        switch (sortType) {
            case 'time':
                return items.sort((a, b) => b.timestamp - a.timestamp);
            case 'frequency':
                return items.sort((a, b) => b.frequency - a.frequency);
            case 'length':
                return items.sort((a, b) => b.content.length - a.content.length);
            default:
                return items;
        }
    }

    /**
     * 检测内容类型
     */
    detectType(content) {
        // URL检测
        const urlPattern = /^https?:\/\/.+/i;
        if (urlPattern.test(content.trim())) {
            return 'url';
        }

        // 代码检测（简单判断）
        const codePatterns = [
            /^(function|class|const|let|var|import|export)/,
            /{\s*[\w\s:;,()=>[\]{}]+\s*}/,
            /<[a-z][\s\S]*>/i
        ];

        if (codePatterns.some(pattern => pattern.test(content))) {
            return 'code';
        }

        // 图片URL检测
        const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
        if (imagePattern.test(content.trim())) {
            return 'image';
        }

        return 'text';
    }

    /**
     * 获取设备ID
     */
    getDeviceId() {
        let deviceId = localStorage.getItem('weiruan_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('weiruan_device_id', deviceId);
        }
        return deviceId;
    }

    /**
     * 获取设置
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.settingsKey);
            return data ? JSON.parse(data) : {
                autoSync: true,
                historyLimit: 500,
                soundEnabled: false,
                excludePasswords: true,
                encryptSensitive: false
            };
        } catch (error) {
            return {};
        }
    }

    /**
     * 保存设置
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            this.maxItems = settings.historyLimit || 500;
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    }

    /**
     * 导出数据
     */
    exportData() {
        const data = {
            items: this.getItems(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clipboard_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 导入数据
     */
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (data.items) {
                        this.saveItems(data.items);
                    }

                    if (data.settings) {
                        this.saveSettings(data.settings);
                    }

                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }

    /**
     * 获取统计数据
     */
    getStatistics(range = 'all') {
        const items = this.getItems();
        let filteredItems = items;

        // 按时间范围过滤
        if (range !== 'all') {
            const now = Date.now();
            const ranges = {
                today: 24 * 60 * 60 * 1000,
                week: 7 * 24 * 60 * 60 * 1000,
                month: 30 * 24 * 60 * 60 * 1000
            };

            const timeLimit = now - (ranges[range] || 0);
            filteredItems = items.filter(item => item.timestamp >= timeLimit);
        }

        // 计算总复制次数
        const totalCopies = filteredItems.reduce((sum, item) => sum + item.frequency, 0);

        // 统计词频
        const wordFrequency = {};
        filteredItems.forEach(item => {
            if (item.type === 'text') {
                // 分词（简单的空格分割）
                const words = item.content
                    .toLowerCase()
                    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
                    .split(/\s+/)
                    .filter(word => word.length > 1);

                words.forEach(word => {
                    wordFrequency[word] = (wordFrequency[word] || 0) + item.frequency;
                });
            }
        });

        // 排序获取高频词
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);

        return {
            totalCopies,
            uniqueItems: filteredItems.length,
            topWords: sortedWords,
            topWord: sortedWords[0] ? sortedWords[0][0] : '-'
        };
    }

    /**
     * 检查是否可能包含密码
     */
    isPossiblyPassword(content) {
        const passwordPatterns = [
            /password/i,
            /passwd/i,
            /pwd/i,
            /^[a-zA-Z0-9!@#$%^&*]{8,}$/,
            /^\d{6,}$/
        ];

        return passwordPatterns.some(pattern => pattern.test(content));
    }
}

// 创建全局实例
window.clipboardStorage = new ClipboardStorage();
