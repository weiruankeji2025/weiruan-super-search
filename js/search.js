/**
 * 威软快搜 - 搜索功能模块
 * 实现多源搜索、搜索历史、关键词匹配等功能
 */

const SearchModule = {
    // 当前选中的搜索类型
    currentType: 'all',

    // 搜索历史
    history: [],

    /**
     * 初始化搜索模块
     */
    init() {
        this.loadHistory();
        this.bindEvents();
        this.setupInputListeners();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 搜索按钮点击
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        // 搜索输入框回车
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // 清除按钮
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearInput());
        }

        // 搜索类型切换
        const typeBtns = document.querySelectorAll('.type-btn');
        typeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchType(e));
        });

        // 搜索引擎点击
        const engineItems = document.querySelectorAll('.engine-item');
        engineItems.forEach(item => {
            item.addEventListener('click', (e) => this.searchWithEngine(e));
        });

        // 清空历史
        const clearHistory = document.getElementById('clearHistory');
        if (clearHistory) {
            clearHistory.addEventListener('click', () => this.clearHistory());
        }
    },

    /**
     * 设置输入框监听
     */
    setupInputListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearBtn');
        const suggestions = document.getElementById('searchSuggestions');

        if (searchInput) {
            // 输入时显示/隐藏清除按钮和建议
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();

                // 清除按钮显示/隐藏
                if (clearBtn) {
                    clearBtn.classList.toggle('visible', value.length > 0);
                }

                // 显示搜索建议
                if (value.length > 0) {
                    this.showSuggestions(value);
                } else {
                    this.showHistory();
                }
            });

            // 获得焦点时显示历史/建议
            searchInput.addEventListener('focus', () => {
                const value = searchInput.value.trim();
                if (value.length > 0) {
                    this.showSuggestions(value);
                } else {
                    this.showHistory();
                }
            });

            // 失去焦点时隐藏建议（延迟以允许点击）
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    if (suggestions) {
                        suggestions.classList.remove('visible');
                    }
                }, 200);
            });
        }
    },

    /**
     * 执行搜索
     * @param {string} keyword - 可选，指定关键词
     */
    performSearch(keyword = null) {
        const searchInput = document.getElementById('searchInput');
        const query = keyword || (searchInput ? searchInput.value.trim() : '');

        if (!query) {
            this.shakeInput();
            return;
        }

        // 保存到历史记录
        this.addToHistory(query);

        // 获取当前类型对应的搜索引擎
        const engines = CONFIG.searchTypes[this.currentType] || CONFIG.searchTypes.all;
        const primaryEngine = engines[0];
        const engineConfig = CONFIG.searchEngines[primaryEngine];

        if (engineConfig) {
            // 打开搜索结果
            const searchUrl = engineConfig.url + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
        }

        // 隐藏建议框
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) {
            suggestions.classList.remove('visible');
        }
    },

    /**
     * 使用指定引擎搜索
     * @param {Event} e - 点击事件
     */
    searchWithEngine(e) {
        e.preventDefault();
        const engineKey = e.currentTarget.dataset.engine;
        const searchInput = document.getElementById('searchInput');
        const query = searchInput ? searchInput.value.trim() : '';

        if (!query) {
            searchInput?.focus();
            this.shakeInput();
            return;
        }

        const engineConfig = CONFIG.searchEngines[engineKey];
        if (engineConfig) {
            this.addToHistory(query);
            const searchUrl = engineConfig.url + encodeURIComponent(query);
            window.open(searchUrl, '_blank');
        }
    },

    /**
     * 切换搜索类型
     * @param {Event} e - 点击事件
     */
    switchType(e) {
        const btn = e.currentTarget;
        const type = btn.dataset.type;

        // 更新UI
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新当前类型
        this.currentType = type;

        // 视觉反馈
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    },

    /**
     * 清空输入框
     */
    clearInput() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearBtn');

        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }

        if (clearBtn) {
            clearBtn.classList.remove('visible');
        }

        this.showHistory();
    },

    /**
     * 输入框抖动效果
     */
    shakeInput() {
        const wrapper = document.querySelector('.search-input-wrapper');
        if (wrapper) {
            wrapper.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                wrapper.style.animation = '';
            }, 500);
        }
    },

    /**
     * 显示搜索历史
     */
    showHistory() {
        const suggestions = document.getElementById('searchSuggestions');
        const list = document.getElementById('suggestionsList');
        const header = suggestions?.querySelector('.suggestions-header span');

        if (!suggestions || !list) return;

        if (this.history.length === 0) {
            suggestions.classList.remove('visible');
            return;
        }

        // 更新标题
        if (header) {
            header.textContent = '搜索历史';
        }

        // 生成历史列表
        list.innerHTML = this.history.map(item => `
            <li data-keyword="${this.escapeHtml(item)}">
                <span class="history-icon">🕐</span>
                <span class="history-text">${this.escapeHtml(item)}</span>
            </li>
        `).join('');

        // 绑定点击事件
        list.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const keyword = li.dataset.keyword;
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = keyword;
                }
                this.performSearch(keyword);
            });
        });

        suggestions.classList.add('visible');
    },

    /**
     * 显示搜索建议
     * @param {string} query - 搜索关键词
     */
    showSuggestions(query) {
        const suggestions = document.getElementById('searchSuggestions');
        const list = document.getElementById('suggestionsList');
        const header = suggestions?.querySelector('.suggestions-header span');

        if (!suggestions || !list) return;

        // 匹配历史记录
        const matchedHistory = this.history.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );

        // 生成热门关键词建议（基于热搜）
        const hotSuggestions = this.getHotSuggestions(query);

        // 合并建议
        const allSuggestions = [...new Set([...matchedHistory, ...hotSuggestions])].slice(0, 8);

        if (allSuggestions.length === 0) {
            suggestions.classList.remove('visible');
            return;
        }

        // 更新标题
        if (header) {
            header.textContent = '搜索建议';
        }

        // 生成建议列表，高亮匹配部分
        list.innerHTML = allSuggestions.map(item => {
            const highlightedItem = this.highlightMatch(item, query);
            const isFromHistory = matchedHistory.includes(item);
            return `
                <li data-keyword="${this.escapeHtml(item)}">
                    <span class="history-icon">${isFromHistory ? '🕐' : '🔍'}</span>
                    <span class="history-text">${highlightedItem}</span>
                </li>
            `;
        }).join('');

        // 绑定点击事件
        list.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', () => {
                const keyword = li.dataset.keyword;
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = keyword;
                }
                this.performSearch(keyword);
            });
        });

        suggestions.classList.add('visible');
    },

    /**
     * 获取热门建议（基于当前热搜）
     * @param {string} query - 搜索关键词
     * @returns {Array} 匹配的热门关键词
     */
    getHotSuggestions(query) {
        if (typeof HotSearchModule !== 'undefined' && HotSearchModule.currentData) {
            return HotSearchModule.currentData
                .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
                .map(item => item.title)
                .slice(0, 5);
        }
        return [];
    },

    /**
     * 高亮匹配文本
     * @param {string} text - 原文本
     * @param {string} query - 匹配关键词
     * @returns {string} 高亮后的HTML
     */
    highlightMatch(text, query) {
        if (!query) return this.escapeHtml(text);

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    },

    /**
     * 添加到历史记录
     * @param {string} query - 搜索关键词
     */
    addToHistory(query) {
        // 移除重复项
        this.history = this.history.filter(item => item !== query);

        // 添加到开头
        this.history.unshift(query);

        // 限制数量
        if (this.history.length > CONFIG.maxHistoryCount) {
            this.history = this.history.slice(0, CONFIG.maxHistoryCount);
        }

        // 保存
        this.saveHistory();
    },

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();

        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) {
            suggestions.classList.remove('visible');
        }
    },

    /**
     * 保存历史记录到本地存储
     */
    saveHistory() {
        try {
            localStorage.setItem(
                CONFIG.storageKeys.searchHistory,
                JSON.stringify(this.history)
            );
        } catch (e) {
            console.warn('保存搜索历史失败:', e);
        }
    },

    /**
     * 从本地存储加载历史记录
     */
    loadHistory() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKeys.searchHistory);
            if (saved) {
                this.history = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('加载搜索历史失败:', e);
            this.history = [];
        }
    },

    /**
     * HTML转义
     * @param {string} text - 原文本
     * @returns {string} 转义后的文本
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * 正则表达式转义
     * @param {string} string - 原字符串
     * @returns {string} 转义后的字符串
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};

// 添加抖动动画CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    mark {
        background: rgba(79, 70, 229, 0.2);
        color: var(--primary-color);
        padding: 0 2px;
        border-radius: 2px;
    }
`;
document.head.appendChild(shakeStyle);
