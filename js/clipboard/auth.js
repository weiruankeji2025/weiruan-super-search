/**
 * 认证模块
 * 支持多种OAuth提供商
 */

class ClipboardAuth {
    constructor() {
        this.currentUser = null;
        this.authTokenKey = 'weiruan_auth_token';
        this.userKey = 'weiruan_user_data';

        // OAuth配置（需要替换为实际的应用配置）
        this.oauthConfigs = {
            google: {
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                scope: 'profile email',
                redirectUri: window.location.origin + '/clipboard.html'
            },
            microsoft: {
                clientId: 'YOUR_MICROSOFT_CLIENT_ID',
                authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
                scope: 'User.Read',
                redirectUri: window.location.origin + '/clipboard.html'
            },
            github: {
                clientId: 'YOUR_GITHUB_CLIENT_ID',
                authUrl: 'https://github.com/login/oauth/authorize',
                scope: 'user:email',
                redirectUri: window.location.origin + '/clipboard.html'
            },
            twitter: {
                clientId: 'YOUR_TWITTER_CLIENT_ID',
                authUrl: 'https://twitter.com/i/oauth2/authorize',
                scope: 'tweet.read users.read',
                redirectUri: window.location.origin + '/clipboard.html'
            }
        };

        this.init();
    }

    /**
     * 初始化认证状态
     */
    init() {
        // 检查本地存储的用户数据
        this.loadUserFromStorage();

        // 检查URL中的OAuth回调参数
        this.handleOAuthCallback();
    }

    /**
     * 从本地存储加载用户数据
     */
    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem(this.userKey);
            const token = localStorage.getItem(this.authTokenKey);

            if (userData && token) {
                this.currentUser = JSON.parse(userData);
                this.currentUser.token = token;

                // 验证token是否过期
                if (this.isTokenExpired()) {
                    this.logout();
                }
            }
        } catch (error) {
            console.error('加载用户数据失败:', error);
        }
    }

    /**
     * 处理OAuth回调
     */
    handleOAuthCallback() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');

        if (error) {
            console.error('OAuth错误:', error);
            return;
        }

        if (code && state) {
            // 从state中获取provider
            const stateData = this.parseState(state);
            if (stateData) {
                this.exchangeCodeForToken(code, stateData.provider);
            }

            // 清理URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    /**
     * 使用OAuth登录
     */
    loginWithOAuth(provider) {
        const config = this.oauthConfigs[provider];
        if (!config) {
            throw new Error(`不支持的OAuth提供商: ${provider}`);
        }

        // 生成state用于CSRF保护
        const state = this.generateState({ provider });

        // 构建授权URL
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            response_type: 'code',
            scope: config.scope,
            state: state
        });

        const authUrl = `${config.authUrl}?${params.toString()}`;

        // 重定向到OAuth提供商
        window.location.href = authUrl;
    }

    /**
     * 交换授权码为访问令牌
     */
    async exchangeCodeForToken(code, provider) {
        try {
            // 实际应该调用后端API来交换token
            // 这里使用模拟数据
            const mockUser = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                name: 'Demo User',
                email: 'demo@example.com',
                avatar: 'https://via.placeholder.com/100',
                provider: provider
            };

            const mockToken = 'token_' + Math.random().toString(36).substr(2, 16);

            await this.setUser(mockUser, mockToken);

            // 实际实现：
            /*
            const response = await fetch('/api/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    provider: provider,
                    redirectUri: this.oauthConfigs[provider].redirectUri
                })
            });

            if (!response.ok) {
                throw new Error('Token交换失败');
            }

            const data = await response.json();
            await this.setUser(data.user, data.token);
            */
        } catch (error) {
            console.error('Token交换失败:', error);
            throw error;
        }
    }

    /**
     * 设置用户数据
     */
    async setUser(user, token) {
        this.currentUser = { ...user, token };

        // 保存到本地存储
        localStorage.setItem(this.userKey, JSON.stringify(user));
        localStorage.setItem(this.authTokenKey, token);

        // 启动同步
        if (window.clipboardSync) {
            window.clipboardSync.startAutoSync();
        }

        // 连接实时同步
        if (window.realtimeSync) {
            window.realtimeSync.connect(user.id, token);
        }

        // 触发登录事件
        this.triggerEvent('login', this.currentUser);
    }

    /**
     * 退出登录
     */
    logout() {
        // 停止同步
        if (window.clipboardSync) {
            window.clipboardSync.stopAutoSync();
            window.clipboardSync.clearSyncData();
        }

        // 断开实时连接
        if (window.realtimeSync) {
            window.realtimeSync.disconnect();
        }

        // 清除本地数据
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.authTokenKey);

        this.currentUser = null;

        // 触发退出事件
        this.triggerEvent('logout');
    }

    /**
     * 获取当前用户
     */
    getUser() {
        return this.currentUser;
    }

    /**
     * 检查是否已登录
     */
    isLoggedIn() {
        return !!this.currentUser;
    }

    /**
     * 获取访问令牌
     */
    getToken() {
        return this.currentUser?.token || null;
    }

    /**
     * 检查token是否过期
     */
    isTokenExpired() {
        // 这里需要根据实际token格式来判断
        // 简单起见，假设token有效期为7天
        const savedTime = localStorage.getItem('weiruan_auth_time');
        if (!savedTime) return true;

        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return Date.now() - parseInt(savedTime) > sevenDays;
    }

    /**
     * 刷新token
     */
    async refreshToken() {
        if (!this.currentUser) {
            throw new Error('未登录');
        }

        try {
            // 实际应该调用后端API刷新token
            // 这里使用模拟数据
            const newToken = 'token_' + Math.random().toString(36).substr(2, 16);
            this.currentUser.token = newToken;
            localStorage.setItem(this.authTokenKey, newToken);
            localStorage.setItem('weiruan_auth_time', Date.now().toString());

            // 实际实现：
            /*
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.currentUser.token}`
                }
            });

            if (!response.ok) {
                throw new Error('刷新token失败');
            }

            const data = await response.json();
            this.currentUser.token = data.token;
            localStorage.setItem(this.authTokenKey, data.token);
            */
        } catch (error) {
            console.error('刷新token失败:', error);
            this.logout();
            throw error;
        }
    }

    /**
     * 生成state参数
     */
    generateState(data) {
        const state = {
            ...data,
            timestamp: Date.now(),
            random: Math.random().toString(36).substr(2)
        };
        return btoa(JSON.stringify(state));
    }

    /**
     * 解析state参数
     */
    parseState(state) {
        try {
            return JSON.parse(atob(state));
        } catch (error) {
            console.error('解析state失败:', error);
            return null;
        }
    }

    /**
     * 事件监听器
     */
    listeners = {
        login: [],
        logout: [],
        error: []
    };

    /**
     * 添加事件监听
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * 触发事件
     */
    triggerEvent(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('事件回调执行失败:', error);
                }
            });
        }
    }

    /**
     * 使用演示账号登录（用于测试）
     */
    loginWithDemo() {
        const demoUser = {
            id: 'demo_user',
            name: '演示用户',
            email: 'demo@weiruan.com',
            avatar: 'https://via.placeholder.com/100',
            provider: 'demo'
        };

        const demoToken = 'demo_token_' + Date.now();
        this.setUser(demoUser, demoToken);
    }
}

// 创建全局实例
window.clipboardAuth = new ClipboardAuth();
