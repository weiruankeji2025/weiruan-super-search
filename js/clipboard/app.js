/**
 * 主应用逻辑
 * 整合所有模块和UI交互
 */

class ClipboardApp {
    constructor() {
        this.currentView = 'clipboard';
        this.currentFilter = 'all';
        this.currentSort = 'time';
        this.searchQuery = '';

        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.bindEvents();
        this.loadUserInterface();
        this.loadClipboardItems();
        this.initializeModules();
        this.setupKeyboardShortcuts();

        // 监听剪贴板事件
        this.setupClipboardListener();

        // 启动自动备份
        if (clipboardBackup.settings.autoBackup) {
            clipboardBackup.startAutoBackup();
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 侧边栏
        document.getElementById('sidebarToggle')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('menuToggle')?.addEventListener('click', () => this.toggleSidebar());

        // 导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // 搜索
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.filterAndRenderItems();
        });

        // 过滤和排序
        document.getElementById('filterType')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterAndRenderItems();
        });

        document.getElementById('sortType')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndRenderItems();
        });

        // 工具栏按钮
        document.getElementById('syncBtn')?.addEventListener('click', () => this.syncNow());
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('addClipBtn')?.addEventListener('click', () => this.showAddModal());
        document.getElementById('clearAllBtn')?.addEventListener('click', () => this.clearAll());

        // 登录
        document.getElementById('showLoginBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // 模态框
        this.bindModalEvents();

        // OAuth登录按钮
        this.bindAuthButtons();

        // 备份按钮
        this.bindBackupButtons();

        // 设置
        this.bindSettingsEvents();
    }

    /**
     * 绑定模态框事件
     */
    bindModalEvents() {
        // 登录模态框
        document.getElementById('closeLoginModal')?.addEventListener('click', () => {
            this.hideModal('loginModal');
        });

        // 新建剪切板模态框
        document.getElementById('closeAddModal')?.addEventListener('click', () => {
            this.hideModal('addClipModal');
        });

        document.getElementById('saveNewClip')?.addEventListener('click', () => this.saveNewClip());
        document.getElementById('cancelAddClip')?.addEventListener('click', () => {
            this.hideModal('addClipModal');
        });

        // 详情模态框
        document.getElementById('closeDetailModal')?.addEventListener('click', () => {
            this.hideModal('detailModal');
        });

        // 点击背景关闭模态框
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    /**
     * 绑定认证按钮
     */
    bindAuthButtons() {
        document.getElementById('googleLogin')?.addEventListener('click', () => {
            clipboardAuth.loginWithOAuth('google');
        });

        document.getElementById('microsoftLogin')?.addEventListener('click', () => {
            clipboardAuth.loginWithOAuth('microsoft');
        });

        document.getElementById('githubLogin')?.addEventListener('click', () => {
            clipboardAuth.loginWithOAuth('github');
        });

        document.getElementById('twitterLogin')?.addEventListener('click', () => {
            clipboardAuth.loginWithOAuth('twitter');
        });
    }

    /**
     * 绑定备份按钮
     */
    bindBackupButtons() {
        document.getElementById('gdrive-connect')?.addEventListener('click', () => {
            this.connectBackupService('googledrive');
        });

        document.getElementById('onedrive-connect')?.addEventListener('click', () => {
            this.connectBackupService('onedrive');
        });

        document.getElementById('dropbox-connect')?.addEventListener('click', () => {
            this.connectBackupService('dropbox');
        });

        document.getElementById('backupNowBtn')?.addEventListener('click', () => this.backupNow());
        document.getElementById('restoreBtn')?.addEventListener('click', () => this.restoreBackup());
    }

    /**
     * 绑定设置事件
     */
    bindSettingsEvents() {
        const settings = ['autoSync', 'historyLimit', 'soundEnabled', 'excludePasswords', 'encryptSensitive', 'autoBackup', 'backupFrequency'];

        settings.forEach(setting => {
            const element = document.getElementById(setting);
            if (element) {
                element.addEventListener('change', () => this.saveSettings());
            }
        });

        // 数据管理
        document.getElementById('exportDataBtn')?.addEventListener('click', () => {
            clipboardStorage.exportData();
            this.showToast('数据已导出', 'success');
        });

        document.getElementById('importDataBtn')?.addEventListener('click', () => this.importData());
        document.getElementById('clearDataBtn')?.addEventListener('click', () => this.confirmClearData());

        // 扩展下载
        document.getElementById('installChromeExt')?.addEventListener('click', () => {
            this.showToast('Chrome扩展正在开发中', 'info');
        });

        document.getElementById('installFirefoxExt')?.addEventListener('click', () => {
            this.showToast('Firefox扩展正在开发中', 'info');
        });
    }

    /**
     * 初始化模块
     */
    initializeModules() {
        // 监听认证事件
        clipboardAuth.on('login', (user) => {
            this.updateUserInterface(user);
            this.showToast(`欢迎，${user.name}！`, 'success');
            clipboardSync.startAutoSync();
        });

        clipboardAuth.on('logout', () => {
            this.updateUserInterface(null);
            this.showToast('已退出登录', 'info');
        });

        // 监听同步事件
        clipboardSync.on('onSync', (data) => {
            if (data.source === 'storage' || data.source === 'realtime') {
                this.loadClipboardItems();
            }
        });

        // 如果已登录，启动同步
        if (clipboardAuth.isLoggedIn()) {
            clipboardSync.startAutoSync();
        }
    }

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: 聚焦搜索
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput')?.focus();
            }

            // Ctrl/Cmd + N: 新建
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showAddModal();
            }

            // Esc: 关闭模态框
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    this.hideModal(modal.id);
                });
            }
        });
    }

    /**
     * 设置剪贴板监听
     */
    setupClipboardListener() {
        // 浏览器API受限，需要用户交互
        document.addEventListener('paste', async (e) => {
            try {
                const text = e.clipboardData.getData('text');
                if (text && text.trim()) {
                    const settings = clipboardStorage.getSettings();

                    // 检查是否排除密码
                    if (settings.excludePasswords && clipboardStorage.isPossiblyPassword(text)) {
                        return;
                    }

                    const type = clipboardStorage.detectType(text);
                    clipboardStorage.addItem(text, type);
                    this.loadClipboardItems();

                    if (settings.soundEnabled) {
                        this.playNotificationSound();
                    }
                }
            } catch (error) {
                console.error('处理剪贴板失败:', error);
            }
        });

        // 提示用户安装扩展以获得完整功能
        this.showClipboardTip();
    }

    /**
     * 显示剪贴板提示
     */
    showClipboardTip() {
        setTimeout(() => {
            if (clipboardStorage.getItems().length === 0) {
                this.showToast('💡 提示：安装浏览器扩展可自动捕获剪贴板内容', 'info', 5000);
            }
        }, 2000);
    }

    /**
     * 加载用户界面
     */
    loadUserInterface() {
        const user = clipboardAuth.getUser();
        this.updateUserInterface(user);
    }

    /**
     * 更新用户界面
     */
    updateUserInterface(user) {
        const loginPrompt = document.getElementById('loginPrompt');
        const userInfo = document.getElementById('userInfo');

        if (user) {
            loginPrompt.style.display = 'none';
            userInfo.style.display = 'flex';

            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('userAvatar').src = user.avatar || 'https://via.placeholder.com/40';
        } else {
            loginPrompt.style.display = 'block';
            userInfo.style.display = 'none';
        }
    }

    /**
     * 加载剪贴板项
     */
    loadClipboardItems() {
        this.filterAndRenderItems();
        this.updateAnalytics();
    }

    /**
     * 过滤和渲染项目
     */
    filterAndRenderItems() {
        let items = clipboardStorage.getItems();

        // 搜索过滤
        if (this.searchQuery) {
            items = clipboardStorage.searchItems(this.searchQuery);
        }

        // 类型过滤
        if (this.currentFilter !== 'all') {
            items = items.filter(item => item.type === this.currentFilter);
        }

        // 排序
        items = this.sortItems(items);

        // 渲染
        if (this.currentView === 'clipboard') {
            this.renderClipboardItems(items);
        } else if (this.currentView === 'favorites') {
            this.renderFavorites();
        }
    }

    /**
     * 排序项目
     */
    sortItems(items) {
        const sorted = [...items];

        switch (this.currentSort) {
            case 'time':
                return sorted.sort((a, b) => b.timestamp - a.timestamp);
            case 'frequency':
                return sorted.sort((a, b) => b.frequency - a.frequency);
            case 'length':
                return sorted.sort((a, b) => b.content.length - a.content.length);
            default:
                return sorted;
        }
    }

    /**
     * 渲染剪贴板项
     */
    renderClipboardItems(items) {
        const grid = document.getElementById('clipboardGrid');
        if (!grid) return;

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>暂无剪贴板记录</h3>
                    <p>复制内容后会自动出现在这里</p>
                    <p class="empty-tip">💡 提示：安装浏览器扩展可自动捕获剪贴板</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = items.map(item => this.createClipCard(item)).join('');

        // 绑定卡片事件
        this.bindCardEvents();
    }

    /**
     * 创建剪贴板卡片
     */
    createClipCard(item) {
        const typeIcons = {
            text: '📝',
            url: '🔗',
            code: '💻',
            image: '🖼️'
        };

        const icon = typeIcons[item.type] || '📄';
        const preview = this.getContentPreview(item.content, 150);
        const timeAgo = this.formatTimeAgo(item.timestamp);

        return `
            <div class="clip-card" data-id="${item.id}">
                <div class="clip-header">
                    <span class="clip-type">${icon} ${item.type}</span>
                    <div class="clip-actions">
                        <button class="clip-action-btn" data-action="favorite" title="收藏">
                            ${item.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button class="clip-action-btn" data-action="copy" title="复制">📋</button>
                        <button class="clip-action-btn" data-action="delete" title="删除">🗑️</button>
                    </div>
                </div>
                <div class="clip-content ${item.type === 'code' ? 'code' : ''}" data-action="view">
                    ${this.escapeHtml(preview)}
                </div>
                <div class="clip-footer">
                    <span>${timeAgo}</span>
                    <span>使用 ${item.frequency} 次</span>
                </div>
            </div>
        `;
    }

    /**
     * 绑定卡片事件
     */
    bindCardEvents() {
        document.querySelectorAll('.clip-card').forEach(card => {
            const id = card.dataset.id;

            // 查看详情
            card.querySelector('[data-action="view"]')?.addEventListener('click', () => {
                this.viewClipDetail(id);
            });

            // 复制
            card.querySelector('[data-action="copy"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyToClipboard(id);
            });

            // 收藏
            card.querySelector('[data-action="favorite"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(id);
            });

            // 删除
            card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteItem(id);
            });
        });
    }

    /**
     * 查看详情
     */
    viewClipDetail(id) {
        const items = clipboardStorage.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;

        const modal = document.getElementById('detailModal');
        const content = document.getElementById('detailContent');

        content.innerHTML = `
            <div class="clip-detail">
                <div class="detail-header">
                    <span class="clip-type">${item.type}</span>
                    <span>创建于 ${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div class="detail-content ${item.type === 'code' ? 'code' : ''}">
                    ${this.escapeHtml(item.content)}
                </div>
                <div class="detail-stats">
                    <div>长度：${item.content.length} 字符</div>
                    <div>使用频率：${item.frequency} 次</div>
                </div>
                <div class="detail-actions">
                    <button class="btn-primary" onclick="clipboardApp.copyToClipboard('${id}')">复制</button>
                    <button class="btn-secondary" onclick="clipboardApp.hideModal('detailModal')">关闭</button>
                </div>
            </div>
        `;

        this.showModal('detailModal');
    }

    /**
     * 复制到剪贴板
     */
    async copyToClipboard(id) {
        const items = clipboardStorage.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;

        try {
            await navigator.clipboard.writeText(item.content);
            clipboardStorage.updateItem(id, {
                frequency: item.frequency + 1,
                timestamp: Date.now()
            });
            this.showToast('已复制到剪贴板', 'success');
            this.loadClipboardItems();
        } catch (error) {
            console.error('复制失败:', error);
            this.showToast('复制失败', 'error');
        }
    }

    /**
     * 切换收藏
     */
    toggleFavorite(id) {
        clipboardStorage.toggleFavorite(id);
        this.loadClipboardItems();
        this.showToast('已更新收藏', 'success');
    }

    /**
     * 删除项目
     */
    deleteItem(id) {
        if (confirm('确定要删除这条记录吗？')) {
            clipboardStorage.deleteItem(id);
            this.loadClipboardItems();
            this.showToast('已删除', 'success');
        }
    }

    /**
     * 渲染收藏夹
     */
    renderFavorites() {
        const grid = document.getElementById('favoritesGrid');
        if (!grid) return;

        const favorites = clipboardStorage.getFavorites();

        if (favorites.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⭐</div>
                    <h3>暂无收藏内容</h3>
                    <p>点击剪切板项的星标图标即可收藏</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = favorites.map(item => this.createClipCard(item)).join('');
        this.bindCardEvents();
    }

    /**
     * 更新分析数据
     */
    updateAnalytics() {
        const range = document.getElementById('analyticsRange')?.value || 'all';
        const analysis = clipboardAnalytics.analyzeClipboard(range);

        // 更新统计卡片
        document.getElementById('totalCopies').textContent = analysis.totalCopies;
        document.getElementById('uniqueItems').textContent = analysis.uniqueItems;
        document.getElementById('topWord').textContent = analysis.topWord;

        // 渲染词云
        this.renderWordCloud(analysis.wordFrequency);

        // 渲染频率列表
        this.renderFrequencyList(analysis.wordFrequency);
    }

    /**
     * 渲染词云
     */
    renderWordCloud(words) {
        const container = document.getElementById('wordCloud');
        if (!container) return;

        const cloudData = clipboardAnalytics.generateWordCloud(words, 30);

        if (cloudData.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-secondary)">暂无数据</p>';
            return;
        }

        container.innerHTML = cloudData.map(item => `
            <span class="word-item" style="font-size: ${item.size}px" title="出现 ${item.count} 次">
                ${this.escapeHtml(item.text)}
            </span>
        `).join('');
    }

    /**
     * 渲染频率列表
     */
    renderFrequencyList(words) {
        const list = document.getElementById('frequencyList');
        if (!list) return;

        const topWords = words.slice(0, 20);
        const maxCount = topWords[0]?.count || 1;

        list.innerHTML = topWords.map(item => {
            const percentage = (item.count / maxCount * 100).toFixed(1);
            return `
                <div class="frequency-item">
                    <div>
                        <div class="frequency-word">${this.escapeHtml(item.word)}</div>
                        <div class="frequency-bar" style="width: ${percentage}%"></div>
                    </div>
                    <div class="frequency-count">${item.count} 次</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 切换视图
     */
    switchView(viewName) {
        this.currentView = viewName;

        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });

        // 切换视图容器
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active');
        });

        const viewMap = {
            clipboard: 'clipboardView',
            favorites: 'favoritesView',
            analytics: 'analyticsView',
            backup: 'backupView',
            settings: 'settingsView'
        };

        const targetView = document.getElementById(viewMap[viewName]);
        if (targetView) {
            targetView.classList.add('active');

            // 加载对应视图的数据
            if (viewName === 'favorites') {
                this.renderFavorites();
            } else if (viewName === 'analytics') {
                this.updateAnalytics();
            } else if (viewName === 'backup') {
                this.updateBackupView();
            } else if (viewName === 'settings') {
                this.loadSettings();
            }
        }
    }

    /**
     * 更新备份视图
     */
    updateBackupView() {
        const services = clipboardBackup.getAllServiceStatus();

        services.forEach(service => {
            const statusEl = document.getElementById(`${service.id}-status`);
            const btnEl = document.getElementById(`${service.id}-connect`);

            if (statusEl && btnEl) {
                statusEl.textContent = service.connected ? '已连接' : '未连接';
                statusEl.className = service.connected ? 'service-status connected' : 'service-status';
                btnEl.textContent = service.connected ? '断开' : '连接';
                btnEl.className = service.connected ? 'btn-connect connected' : 'btn-connect';
            }
        });

        // 加载备份历史
        this.loadBackupHistory();
    }

    /**
     * 加载备份历史
     */
    loadBackupHistory() {
        const history = clipboardBackup.getBackupHistory();
        const container = document.getElementById('backupHistory');
        if (!container) return;

        if (history.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>暂无备份记录</p></div>';
            return;
        }

        container.innerHTML = history.map(record => `
            <div class="history-item">
                <div>${new Date(record.timestamp).toLocaleString()}</div>
                <div>${record.service} - ${record.itemCount} 项</div>
            </div>
        `).join('');
    }

    /**
     * 连接备份服务
     */
    async connectBackupService(serviceName) {
        const service = clipboardBackup.services[serviceName];

        if (service.connected) {
            if (confirm('确定要断开连接吗？')) {
                clipboardBackup.disconnectService(serviceName);
                this.updateBackupView();
                this.showToast('已断开连接', 'info');
            }
        } else {
            try {
                await clipboardBackup.connectService(serviceName);
                this.showToast('连接成功', 'success');
            } catch (error) {
                this.showToast('连接失败', 'error');
            }
        }
    }

    /**
     * 立即备份
     */
    async backupNow() {
        try {
            const connectedServices = Object.keys(clipboardBackup.services).filter(
                key => clipboardBackup.services[key].connected
            );

            if (connectedServices.length > 0) {
                await clipboardBackup.backupNow(connectedServices[0]);
                this.showToast('备份成功', 'success');
            } else {
                await clipboardBackup.backupNow();
                this.showToast('已下载备份文件', 'success');
            }

            this.updateBackupView();
        } catch (error) {
            console.error('备份失败:', error);
            this.showToast('备份失败', 'error');
        }
    }

    /**
     * 恢复备份
     */
    restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                await clipboardBackup.restoreFromBackup(file);
                this.loadClipboardItems();
                this.showToast('恢复成功', 'success');
            } catch (error) {
                console.error('恢复失败:', error);
                this.showToast('恢复失败', 'error');
            }
        };

        input.click();
    }

    /**
     * 加载设置
     */
    loadSettings() {
        const settings = clipboardStorage.getSettings();

        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });

        // 加载备份设置
        document.getElementById('autoBackup').checked = clipboardBackup.settings.autoBackup;
        document.getElementById('backupFrequency').value = clipboardBackup.settings.frequency;
    }

    /**
     * 保存设置
     */
    saveSettings() {
        const settings = {
            autoSync: document.getElementById('autoSync')?.checked || false,
            historyLimit: parseInt(document.getElementById('historyLimit')?.value) || 500,
            soundEnabled: document.getElementById('soundEnabled')?.checked || false,
            excludePasswords: document.getElementById('excludePasswords')?.checked || true,
            encryptSensitive: document.getElementById('encryptSensitive')?.checked || false
        };

        clipboardStorage.saveSettings(settings);

        // 保存备份设置
        clipboardBackup.settings.autoBackup = document.getElementById('autoBackup')?.checked || false;
        clipboardBackup.settings.frequency = document.getElementById('backupFrequency')?.value || 'daily';
        clipboardBackup.saveSettings();

        this.showToast('设置已保存', 'success');
    }

    /**
     * 导入数据
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                await clipboardStorage.importData(file);
                this.loadClipboardItems();
                this.showToast('导入成功', 'success');
            } catch (error) {
                console.error('导入失败:', error);
                this.showToast('导入失败', 'error');
            }
        };

        input.click();
    }

    /**
     * 确认清空数据
     */
    confirmClearData() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            if (confirm('请再次确认：真的要删除所有剪贴板数据吗？')) {
                clipboardStorage.clearAll();
                this.loadClipboardItems();
                this.showToast('数据已清空', 'info');
            }
        }
    }

    /**
     * 显示新建模态框
     */
    showAddModal() {
        this.showModal('addClipModal');
        document.getElementById('newClipContent').value = '';
        document.getElementById('newClipTags').value = '';
    }

    /**
     * 保存新剪贴板项
     */
    saveNewClip() {
        const content = document.getElementById('newClipContent')?.value;
        const type = document.getElementById('newClipType')?.value;
        const tagsStr = document.getElementById('newClipTags')?.value;

        if (!content || !content.trim()) {
            this.showToast('请输入内容', 'warning');
            return;
        }

        const tags = tagsStr ? tagsStr.split(/\s+/).filter(t => t) : [];
        clipboardStorage.addItem(content, type, tags);

        this.hideModal('addClipModal');
        this.loadClipboardItems();
        this.showToast('添加成功', 'success');
    }

    /**
     * 显示登录模态框
     */
    showLoginModal() {
        this.showModal('loginModal');
    }

    /**
     * 退出登录
     */
    logout() {
        if (confirm('确定要退出登录吗？')) {
            clipboardAuth.logout();
        }
    }

    /**
     * 立即同步
     */
    async syncNow() {
        if (!clipboardAuth.isLoggedIn()) {
            this.showToast('请先登录', 'warning');
            this.showLoginModal();
            return;
        }

        try {
            await clipboardSync.sync();
            this.loadClipboardItems();
            this.showToast('同步成功', 'success');
        } catch (error) {
            console.error('同步失败:', error);
            this.showToast('同步失败', 'error');
        }
    }

    /**
     * 清空所有
     */
    clearAll() {
        if (confirm('确定要清空所有剪贴板历史吗？')) {
            clipboardStorage.clearAll();
            this.loadClipboardItems();
            this.showToast('已清空', 'success');
        }
    }

    /**
     * 切换侧边栏
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    /**
     * 显示模态框
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * 隐藏模态框
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * 显示提示
     */
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * 播放通知音
     */
    playNotificationSound() {
        // 可以使用Web Audio API播放简单的提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    /**
     * 获取内容预览
     */
    getContentPreview(content, maxLength = 100) {
        if (content.length <= maxLength) {
            return content;
        }
        return content.substring(0, maxLength) + '...';
    }

    /**
     * 格式化时间
     */
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diff < minute) {
            return '刚刚';
        } else if (diff < hour) {
            return `${Math.floor(diff / minute)} 分钟前`;
        } else if (diff < day) {
            return `${Math.floor(diff / hour)} 小时前`;
        } else if (diff < 7 * day) {
            return `${Math.floor(diff / day)} 天前`;
        } else {
            return new Date(timestamp).toLocaleDateString();
        }
    }

    /**
     * HTML转义
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
let clipboardApp;

document.addEventListener('DOMContentLoaded', () => {
    // 加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = '☀️';
    }

    // 创建应用实例
    clipboardApp = new ClipboardApp();
});
