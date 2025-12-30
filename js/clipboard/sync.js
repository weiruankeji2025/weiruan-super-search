/**
 * 剪切板同步模块
 * 负责多端数据同步
 */

class ClipboardSync {
    constructor() {
        this.syncEndpoint = 'https://api.weiruan-clipboard.com/sync'; // 替换为实际API
        this.syncInterval = 30000; // 30秒
        this.syncTimer = null;
        this.lastSyncTime = 0;
        this.callbacks = {
            onSync: [],
            onConflict: [],
            onError: []
        };

        this.initStorageListener();
    }

    /**
     * 初始化存储监听（跨标签页同步）
     */
    initStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'weiruan_clipboard_items') {
                this.triggerCallbacks('onSync', {
                    source: 'storage',
                    data: JSON.parse(e.newValue || '[]')
                });
            }
        });
    }

    /**
     * 开始自动同步
     */
    startAutoSync() {
        if (this.syncTimer) return;

        // 立即执行一次同步
        this.sync();

        // 设置定时同步
        this.syncTimer = setInterval(() => {
            this.sync();
        }, this.syncInterval);
    }

    /**
     * 停止自动同步
     */
    stopAutoSync() {
        if (this.syncTimer) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
    }

    /**
     * 执行同步
     */
    async sync() {
        const settings = window.clipboardStorage.getSettings();
        if (!settings.autoSync) return;

        const user = window.clipboardAuth?.currentUser;
        if (!user) {
            console.log('未登录，跳过云端同步');
            return;
        }

        try {
            const localItems = window.clipboardStorage.getItems();
            const deviceId = window.clipboardStorage.getDeviceId();

            // 获取上次同步时间后的本地变更
            const changedItems = localItems.filter(item =>
                item.timestamp > this.lastSyncTime
            );

            // 准备同步数据
            const syncData = {
                userId: user.id,
                deviceId: deviceId,
                lastSyncTime: this.lastSyncTime,
                items: changedItems,
                timestamp: Date.now()
            };

            // 发送到服务器
            const response = await this.sendToServer(syncData);

            if (response.success) {
                // 合并服务器返回的数据
                this.mergeServerData(response.data);
                this.lastSyncTime = response.serverTime;

                this.triggerCallbacks('onSync', {
                    source: 'server',
                    data: response.data
                });
            }
        } catch (error) {
            console.error('同步失败:', error);
            this.triggerCallbacks('onError', error);
        }
    }

    /**
     * 发送数据到服务器
     */
    async sendToServer(data) {
        // 这里使用模拟数据，实际应该调用真实API
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟服务器响应
                resolve({
                    success: true,
                    serverTime: Date.now(),
                    data: {
                        items: [],
                        conflicts: []
                    }
                });
            }, 500);
        });

        // 实际实现：
        /*
        const response = await fetch(this.syncEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.clipboardAuth.getToken()}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('同步请求失败');
        }

        return await response.json();
        */
    }

    /**
     * 合并服务器数据
     */
    mergeServerData(serverData) {
        if (!serverData.items || serverData.items.length === 0) return;

        const localItems = window.clipboardStorage.getItems();
        const mergedItems = [...localItems];

        serverData.items.forEach(serverItem => {
            const localIndex = mergedItems.findIndex(item => item.id === serverItem.id);

            if (localIndex === -1) {
                // 本地不存在，直接添加
                mergedItems.push(serverItem);
            } else {
                // 存在冲突，使用时间戳较新的
                const localItem = mergedItems[localIndex];

                if (serverItem.timestamp > localItem.timestamp) {
                    mergedItems[localIndex] = serverItem;
                } else if (serverItem.timestamp === localItem.timestamp) {
                    // 时间戳相同，检查内容是否一致
                    if (serverItem.content !== localItem.content) {
                        this.triggerCallbacks('onConflict', {
                            local: localItem,
                            server: serverItem
                        });
                    }
                }
            }
        });

        // 按时间戳排序
        mergedItems.sort((a, b) => b.timestamp - a.timestamp);

        // 保存合并后的数据
        window.clipboardStorage.saveItems(mergedItems);
    }

    /**
     * 强制推送本地数据到服务器
     */
    async pushToServer() {
        const user = window.clipboardAuth?.currentUser;
        if (!user) {
            throw new Error('需要登录才能推送数据');
        }

        const localItems = window.clipboardStorage.getItems();
        const deviceId = window.clipboardStorage.getDeviceId();

        const pushData = {
            userId: user.id,
            deviceId: deviceId,
            items: localItems,
            timestamp: Date.now(),
            force: true
        };

        const response = await this.sendToServer(pushData);
        return response;
    }

    /**
     * 从服务器拉取数据
     */
    async pullFromServer() {
        const user = window.clipboardAuth?.currentUser;
        if (!user) {
            throw new Error('需要登录才能拉取数据');
        }

        // 模拟拉取
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: { items: [] }
                });
            }, 500);
        });

        // 实际实现：
        /*
        const response = await fetch(`${this.syncEndpoint}?userId=${user.id}`, {
            headers: {
                'Authorization': `Bearer ${window.clipboardAuth.getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('拉取数据失败');
        }

        const data = await response.json();
        if (data.items) {
            this.mergeServerData(data);
        }

        return data;
        */
    }

    /**
     * 解决冲突
     */
    resolveConflict(itemId, resolution) {
        // resolution: 'local' | 'server' | 'both'
        const localItems = window.clipboardStorage.getItems();
        const item = localItems.find(i => i.id === itemId);

        if (!item) return;

        switch (resolution) {
            case 'local':
                // 保留本地版本，标记为需要推送
                item.needsPush = true;
                break;
            case 'server':
                // 使用服务器版本，标记为已同步
                item.needsPush = false;
                break;
            case 'both':
                // 创建新副本
                const newItem = {
                    ...item,
                    id: Date.now().toString(),
                    timestamp: Date.now()
                };
                localItems.unshift(newItem);
                break;
        }

        window.clipboardStorage.saveItems(localItems);
    }

    /**
     * 注册回调函数
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * 触发回调
     */
    triggerCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('回调执行失败:', error);
                }
            });
        }
    }

    /**
     * 获取同步状态
     */
    getSyncStatus() {
        const user = window.clipboardAuth?.currentUser;

        return {
            isLoggedIn: !!user,
            autoSyncEnabled: window.clipboardStorage.getSettings().autoSync,
            lastSyncTime: this.lastSyncTime,
            isSyncing: !!this.syncTimer,
            deviceId: window.clipboardStorage.getDeviceId()
        };
    }

    /**
     * 清除同步数据
     */
    clearSyncData() {
        this.lastSyncTime = 0;
        this.stopAutoSync();
    }
}

// 使用WebSocket实现实时同步（可选）
class RealtimeSync {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
    }

    connect(userId, token) {
        if (this.ws) return;

        try {
            const wsUrl = `wss://api.weiruan-clipboard.com/ws?userId=${userId}&token=${token}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket连接已建立');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('处理消息失败:', error);
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket连接已关闭');
                this.ws = null;
                this.reconnect(userId, token);
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket错误:', error);
            };
        } catch (error) {
            console.error('WebSocket连接失败:', error);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts;
    }

    reconnect(userId, token) {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('达到最大重连次数');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`${delay}ms后尝试重连...`);
        setTimeout(() => {
            this.connect(userId, token);
        }, delay);
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'item_added':
                window.clipboardSync.triggerCallbacks('onSync', {
                    source: 'realtime',
                    action: 'add',
                    data: data.item
                });
                break;
            case 'item_updated':
                window.clipboardSync.triggerCallbacks('onSync', {
                    source: 'realtime',
                    action: 'update',
                    data: data.item
                });
                break;
            case 'item_deleted':
                window.clipboardSync.triggerCallbacks('onSync', {
                    source: 'realtime',
                    action: 'delete',
                    data: data.itemId
                });
                break;
        }
    }
}

// 创建全局实例
window.clipboardSync = new ClipboardSync();
window.realtimeSync = new RealtimeSync();
