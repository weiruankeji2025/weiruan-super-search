/**
 * 备份模块
 * 支持多种云存储服务
 */

class ClipboardBackup {
    constructor() {
        this.services = {
            googledrive: {
                name: 'Google Drive',
                connected: false,
                token: null
            },
            onedrive: {
                name: 'OneDrive',
                connected: false,
                token: null
            },
            dropbox: {
                name: 'Dropbox',
                connected: false,
                token: null
            }
        };

        this.backupSettingsKey = 'weiruan_backup_settings';
        this.backupHistoryKey = 'weiruan_backup_history';

        this.loadSettings();
        this.loadConnections();
    }

    /**
     * 加载备份设置
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.backupSettingsKey);
            this.settings = data ? JSON.parse(data) : {
                autoBackup: false,
                frequency: 'daily',
                lastBackup: null
            };
        } catch (error) {
            console.error('加载备份设置失败:', error);
            this.settings = {
                autoBackup: false,
                frequency: 'daily',
                lastBackup: null
            };
        }
    }

    /**
     * 保存备份设置
     */
    saveSettings() {
        try {
            localStorage.setItem(this.backupSettingsKey, JSON.stringify(this.settings));
        } catch (error) {
            console.error('保存备份设置失败:', error);
        }
    }

    /**
     * 加载连接状态
     */
    loadConnections() {
        Object.keys(this.services).forEach(service => {
            const token = localStorage.getItem(`weiruan_${service}_token`);
            if (token) {
                this.services[service].connected = true;
                this.services[service].token = token;
            }
        });
    }

    /**
     * 连接到云存储服务
     */
    async connectService(serviceName) {
        const service = this.services[serviceName];
        if (!service) {
            throw new Error('不支持的服务');
        }

        // OAuth配置
        const oauthConfig = {
            googledrive: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                scope: 'https://www.googleapis.com/auth/drive.file',
                redirectUri: window.location.origin + '/clipboard.html'
            },
            onedrive: {
                clientId: 'YOUR_MICROSOFT_CLIENT_ID',
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                scope: 'Files.ReadWrite',
                redirectUri: window.location.origin + '/clipboard.html'
            },
            dropbox: {
                clientId: 'YOUR_DROPBOX_CLIENT_ID',
                authUrl: 'https://www.dropbox.com/oauth2/authorize',
                scope: 'files.content.write',
                redirectUri: window.location.origin + '/clipboard.html'
            }
        };

        const config = oauthConfig[serviceName];
        if (!config) {
            throw new Error('服务配置未找到');
        }

        // 生成state
        const state = btoa(JSON.stringify({
            service: serviceName,
            timestamp: Date.now()
        }));

        // 构建授权URL
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: 'token',
            scope: config.scope,
            state: state
        });

        const authUrl = `${config.authUrl}?${params.toString()}`;
        window.location.href = authUrl;
    }

    /**
     * 断开云存储服务
     */
    disconnectService(serviceName) {
        const service = this.services[serviceName];
        if (!service) return;

        service.connected = false;
        service.token = null;
        localStorage.removeItem(`weiruan_${serviceName}_token`);
    }

    /**
     * 执行备份
     */
    async backupNow(serviceName = null) {
        const items = window.clipboardStorage.getItems();
        const settings = window.clipboardStorage.getSettings();

        const backupData = {
            version: '1.0.0',
            timestamp: Date.now(),
            items: items,
            settings: settings,
            deviceId: window.clipboardStorage.getDeviceId()
        };

        const fileName = `clipboard_backup_${Date.now()}.json`;
        const content = JSON.stringify(backupData, null, 2);

        // 如果指定了服务，上传到云端
        if (serviceName && this.services[serviceName]?.connected) {
            await this.uploadToService(serviceName, fileName, content);
        } else {
            // 否则下载到本地
            this.downloadBackup(fileName, content);
        }

        // 记录备份历史
        this.addBackupHistory({
            timestamp: Date.now(),
            service: serviceName || 'local',
            fileName: fileName,
            itemCount: items.length
        });

        this.settings.lastBackup = Date.now();
        this.saveSettings();
    }

    /**
     * 上传到云存储服务
     */
    async uploadToService(serviceName, fileName, content) {
        const service = this.services[serviceName];
        if (!service || !service.connected) {
            throw new Error('服务未连接');
        }

        switch (serviceName) {
            case 'googledrive':
                return await this.uploadToGoogleDrive(fileName, content, service.token);
            case 'onedrive':
                return await this.uploadToOneDrive(fileName, content, service.token);
            case 'dropbox':
                return await this.uploadToDropbox(fileName, content, service.token);
            default:
                throw new Error('不支持的服务');
        }
    }

    /**
     * 上传到Google Drive
     */
    async uploadToGoogleDrive(fileName, content, token) {
        // 使用模拟实现
        console.log('上传到Google Drive:', fileName);
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });

        // 实际实现：
        /*
        const metadata = {
            name: fileName,
            mimeType: 'application/json'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([content], { type: 'application/json' }));

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });

        if (!response.ok) {
            throw new Error('上传失败');
        }

        return await response.json();
        */
    }

    /**
     * 上传到OneDrive
     */
    async uploadToOneDrive(fileName, content, token) {
        console.log('上传到OneDrive:', fileName);
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });

        // 实际实现：
        /*
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/ClipboardBackup/${fileName}:/content`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: content
        });

        if (!response.ok) {
            throw new Error('上传失败');
        }

        return await response.json();
        */
    }

    /**
     * 上传到Dropbox
     */
    async uploadToDropbox(fileName, content, token) {
        console.log('上传到Dropbox:', fileName);
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });

        // 实际实现：
        /*
        const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify({
                    path: `/ClipboardBackup/${fileName}`,
                    mode: 'add',
                    autorename: true
                })
            },
            body: content
        });

        if (!response.ok) {
            throw new Error('上传失败');
        }

        return await response.json();
        */
    }

    /**
     * 下载备份到本地
     */
    downloadBackup(fileName, content) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 从备份恢复
     */
    async restoreFromBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);

                    // 验证备份数据
                    if (!backupData.version || !backupData.items) {
                        throw new Error('无效的备份文件');
                    }

                    // 恢复数据
                    if (backupData.items) {
                        window.clipboardStorage.saveItems(backupData.items);
                    }

                    if (backupData.settings) {
                        window.clipboardStorage.saveSettings(backupData.settings);
                    }

                    resolve(backupData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file);
        });
    }

    /**
     * 添加备份历史记录
     */
    addBackupHistory(record) {
        const history = this.getBackupHistory();
        history.unshift(record);

        // 只保留最近50条记录
        if (history.length > 50) {
            history.splice(50);
        }

        try {
            localStorage.setItem(this.backupHistoryKey, JSON.stringify(history));
        } catch (error) {
            console.error('保存备份历史失败:', error);
        }
    }

    /**
     * 获取备份历史
     */
    getBackupHistory() {
        try {
            const data = localStorage.getItem(this.backupHistoryKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('获取备份历史失败:', error);
            return [];
        }
    }

    /**
     * 检查是否需要自动备份
     */
    shouldAutoBackup() {
        if (!this.settings.autoBackup) return false;
        if (!this.settings.lastBackup) return true;

        const intervals = {
            daily: 24 * 60 * 60 * 1000,
            weekly: 7 * 24 * 60 * 60 * 1000,
            monthly: 30 * 24 * 60 * 60 * 1000
        };

        const interval = intervals[this.settings.frequency] || intervals.daily;
        const timeSinceLastBackup = Date.now() - this.settings.lastBackup;

        return timeSinceLastBackup >= interval;
    }

    /**
     * 启动自动备份
     */
    startAutoBackup() {
        // 检查是否需要备份
        if (this.shouldAutoBackup()) {
            this.performAutoBackup();
        }

        // 设置定时检查（每小时检查一次）
        setInterval(() => {
            if (this.shouldAutoBackup()) {
                this.performAutoBackup();
            }
        }, 60 * 60 * 1000);
    }

    /**
     * 执行自动备份
     */
    async performAutoBackup() {
        try {
            // 尝试备份到所有连接的云服务
            const connectedServices = Object.keys(this.services).filter(
                key => this.services[key].connected
            );

            if (connectedServices.length > 0) {
                // 备份到第一个连接的服务
                await this.backupNow(connectedServices[0]);
            } else {
                // 如果没有连接的服务，备份到本地
                await this.backupNow();
            }

            console.log('自动备份完成');
        } catch (error) {
            console.error('自动备份失败:', error);
        }
    }

    /**
     * 获取服务状态
     */
    getServiceStatus(serviceName) {
        const service = this.services[serviceName];
        return {
            name: service.name,
            connected: service.connected
        };
    }

    /**
     * 获取所有服务状态
     */
    getAllServiceStatus() {
        return Object.keys(this.services).map(key => ({
            id: key,
            ...this.getServiceStatus(key)
        }));
    }
}

// 创建全局实例
window.clipboardBackup = new ClipboardBackup();
