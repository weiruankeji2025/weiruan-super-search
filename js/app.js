/**
 * 威软快搜 - 主应用入口
 * 初始化所有模块和全局功能
 */

const App = {
    // 当前主题
    currentTheme: 'light',

    /**
     * 初始化应用
     */
    init() {
        // 加载保存的主题
        this.loadTheme();

        // 初始化各模块
        this.initModules();

        // 初始化全局功能
        this.initGlobalFeatures();

        // 显示欢迎信息
        this.showWelcome();

        console.log(`%c${CONFIG.appName} v${CONFIG.version}`, 'color: #4f46e5; font-size: 24px; font-weight: bold;');
        console.log('%c欢迎使用威软快搜 - 您的智能搜索助手', 'color: #64748b; font-size: 14px;');
    },

    /**
     * 初始化所有模块
     */
    initModules() {
        // 初始化搜索模块
        if (typeof SearchModule !== 'undefined') {
            SearchModule.init();
        }

        // 初始化热搜模块
        if (typeof HotSearchModule !== 'undefined') {
            HotSearchModule.init();
        }

        // 初始化工具模块
        if (typeof ToolsModule !== 'undefined') {
            ToolsModule.init();
        }
    },

    /**
     * 初始化全局功能
     */
    initGlobalFeatures() {
        // 主题切换
        this.initThemeToggle();

        // 返回顶部
        this.initBackToTop();

        // 快捷键
        this.initKeyboardShortcuts();

        // 自动聚焦搜索框
        this.autoFocusSearch();
    },

    /**
     * 初始化主题切换
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    /**
     * 切换主题
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // 更新图标
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }

        // 保存主题设置
        this.saveTheme();
    },

    /**
     * 保存主题设置
     */
    saveTheme() {
        try {
            localStorage.setItem(CONFIG.storageKeys.theme, this.currentTheme);
        } catch (e) {
            console.warn('保存主题设置失败:', e);
        }
    },

    /**
     * 加载主题设置
     */
    loadTheme() {
        try {
            const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
            if (savedTheme) {
                this.currentTheme = savedTheme;
                document.documentElement.setAttribute('data-theme', this.currentTheme);

                const themeIcon = document.querySelector('.theme-icon');
                if (themeIcon) {
                    themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
                }
            }
        } catch (e) {
            console.warn('加载主题设置失败:', e);
        }
    },

    /**
     * 初始化返回顶部按钮
     */
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        // 监听滚动
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // 点击返回顶部
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    /**
     * 初始化键盘快捷键
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // / 键聚焦搜索框（不在输入框内时）
            if (e.key === '/' && !this.isInputFocused()) {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    },

    /**
     * 检查是否有输入框获得焦点
     * @returns {boolean}
     */
    isInputFocused() {
        const activeElement = document.activeElement;
        return activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
    },

    /**
     * 自动聚焦搜索框
     */
    autoFocusSearch() {
        // 页面加载后自动聚焦搜索框
        setTimeout(() => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && !this.isMobile()) {
                searchInput.focus();
            }
        }, 100);
    },

    /**
     * 检测是否为移动设备
     * @returns {boolean}
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * 显示欢迎信息
     */
    showWelcome() {
        // 检查是否是首次访问
        const hasVisited = localStorage.getItem('weiruan_visited');
        if (!hasVisited) {
            localStorage.setItem('weiruan_visited', 'true');

            // 显示简短提示
            this.showToast('欢迎使用威软快搜！按 / 键可快速搜索');
        }
    },

    /**
     * 显示提示消息
     * @param {string} message - 消息内容
     * @param {number} duration - 显示时长（毫秒）
     */
    showToast(message, duration = 3000) {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--text-primary);
            color: var(--bg-secondary);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';

            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
};

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 导出App对象（兼容模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
