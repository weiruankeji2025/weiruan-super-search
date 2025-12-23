/**
 * 威软快搜 - 热搜功能模块
 * 实现多平台热搜榜单展示
 */

const HotSearchModule = {
    // 当前热搜源
    currentSource: 'google',

    // 当前热搜数据
    currentData: [],

    // 模拟热搜数据（实际项目中应从API获取）
    mockData: {
        google: [
            { title: 'ChatGPT new features 2024', heat: '5M+ searches', tag: 'Hot' },
            { title: 'AI image generation tools', heat: '2M+ searches', tag: 'Trending' },
            { title: 'Electric vehicle market trends', heat: '1.5M+ searches', tag: '' },
            { title: 'Climate change solutions', heat: '1.2M+ searches', tag: '' },
            { title: 'Remote work best practices', heat: '980K searches', tag: '' },
            { title: 'Cryptocurrency price today', heat: '850K searches', tag: '' },
            { title: 'SpaceX launch schedule', heat: '720K searches', tag: '' },
            { title: 'Best programming languages 2024', heat: '650K searches', tag: '' },
            { title: 'Mental health awareness', heat: '580K searches', tag: '' },
            { title: 'Sustainable living tips', heat: '520K searches', tag: '' }
        ],
        twitter: [
            { title: '#TechNews', heat: '1.2M posts', tag: 'Hot' },
            { title: '#AI', heat: '980K posts', tag: 'Trending' },
            { title: '#OpenSource', heat: '720K posts', tag: '' },
            { title: '#Coding', heat: '650K posts', tag: '' },
            { title: '#StartupLife', heat: '580K posts', tag: '' },
            { title: '#ProductHunt', heat: '520K posts', tag: '' },
            { title: '#WebDev', heat: '480K posts', tag: '' },
            { title: '#MachineLearning', heat: '420K posts', tag: '' },
            { title: '#CloudComputing', heat: '380K posts', tag: '' },
            { title: '#CyberSecurity', heat: '350K posts', tag: '' }
        ],
        reddit: [
            { title: 'New breakthrough in quantum computing', heat: '45.2K upvotes', tag: 'Hot' },
            { title: 'Open source alternative to popular software', heat: '38.5K upvotes', tag: 'Rising' },
            { title: 'Developer shares 10-year coding journey', heat: '32.1K upvotes', tag: '' },
            { title: 'Free online learning resources', heat: '28.7K upvotes', tag: '' },
            { title: 'Best productivity apps for 2024', heat: '24.3K upvotes', tag: '' },
            { title: 'How I automated my daily tasks', heat: '21.8K upvotes', tag: '' },
            { title: 'Career advice for software engineers', heat: '18.5K upvotes', tag: '' },
            { title: 'Home lab setup guide', heat: '15.2K upvotes', tag: '' },
            { title: 'Privacy-focused alternatives', heat: '12.8K upvotes', tag: '' },
            { title: 'Self-hosting guide for beginners', heat: '10.5K upvotes', tag: '' }
        ],
        hackernews: [
            { title: 'Show HN: I built an open-source AI tool', heat: '850 points', tag: 'Top' },
            { title: 'The future of web development', heat: '720 points', tag: 'Hot' },
            { title: 'Why Rust is gaining popularity', heat: '650 points', tag: '' },
            { title: 'Database performance optimization tips', heat: '580 points', tag: '' },
            { title: 'Launch HN: New developer tool', heat: '520 points', tag: '' },
            { title: 'System design interview guide', heat: '480 points', tag: '' },
            { title: 'Ask HN: Best tech stack for startups?', heat: '420 points', tag: '' },
            { title: 'How big tech companies scale', heat: '380 points', tag: '' },
            { title: 'Open source project of the week', heat: '350 points', tag: '' },
            { title: 'Deep dive into Linux kernel', heat: '320 points', tag: '' }
        ]
    },

    /**
     * 初始化热搜模块
     */
    init() {
        this.bindEvents();
        this.loadHotSearch(this.currentSource);
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 热搜标签切换
        const hotTabs = document.querySelectorAll('.hot-tab');
        hotTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchSource(e));
        });

        // 刷新按钮
        const refreshBtn = document.getElementById('refreshHot');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshHotSearch());
        }
    },

    /**
     * 切换热搜源
     * @param {Event} e - 点击事件
     */
    switchSource(e) {
        const tab = e.currentTarget;
        const source = tab.dataset.source;

        // 更新UI
        document.querySelectorAll('.hot-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 更新当前源并加载数据
        this.currentSource = source;
        this.loadHotSearch(source);
    },

    /**
     * 加载热搜数据
     * @param {string} source - 热搜源
     */
    loadHotSearch(source) {
        const listContainer = document.getElementById('hotSearchList');
        if (!listContainer) return;

        // 显示加载状态
        listContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span>Loading...</span>
            </div>
        `;

        // 模拟网络延迟
        setTimeout(() => {
            // 获取数据（实际项目中应调用API）
            const data = this.fetchHotSearchData(source);
            this.currentData = data;
            this.renderHotSearch(data);
        }, 500);
    },

    /**
     * 获取热搜数据（模拟）
     * @param {string} source - 热搜源
     * @returns {Array} 热搜数据
     */
    fetchHotSearchData(source) {
        // 实际项目中应该调用真实API
        // 这里使用模拟数据并添加一些随机性
        const baseData = this.mockData[source] || this.mockData.google;

        // 随机打乱顺序，模拟数据更新
        return this.shuffleArray([...baseData]).map((item, index) => ({
            ...item,
            rank: index + 1
        }));
    },

    /**
     * 渲染热搜列表
     * @param {Array} data - 热搜数据
     */
    renderHotSearch(data) {
        const listContainer = document.getElementById('hotSearchList');
        if (!listContainer) return;

        if (data.length === 0) {
            listContainer.innerHTML = `
                <div class="loading">
                    <span>No trending data available</span>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = data.map((item, index) => `
            <div class="hot-item" data-keyword="${this.escapeHtml(item.title)}">
                <span class="hot-rank">${index + 1}</span>
                <span class="hot-title">${this.escapeHtml(item.title)}</span>
                ${item.tag ? `<span class="hot-tag">${this.escapeHtml(item.tag)}</span>` : ''}
                <span class="hot-heat">${this.escapeHtml(item.heat)}</span>
            </div>
        `).join('');

        // 绑定点击事件
        listContainer.querySelectorAll('.hot-item').forEach(item => {
            item.addEventListener('click', () => {
                const keyword = item.dataset.keyword;
                this.searchKeyword(keyword);
            });
        });

        // 添加入场动画
        this.animateItems();
    },

    /**
     * 刷新热搜
     */
    refreshHotSearch() {
        const refreshBtn = document.getElementById('refreshHot');
        if (refreshBtn) {
            // 添加旋转动画
            const icon = refreshBtn.querySelector('span:first-child');
            if (icon) {
                icon.style.animation = 'spin 0.5s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 500);
            }
        }

        this.loadHotSearch(this.currentSource);
    },

    /**
     * 搜索关键词
     * @param {string} keyword - 关键词
     */
    searchKeyword(keyword) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = keyword;
        }

        // 调用搜索模块执行搜索
        if (typeof SearchModule !== 'undefined') {
            SearchModule.performSearch(keyword);
        }
    },

    /**
     * 列表入场动画
     */
    animateItems() {
        const items = document.querySelectorAll('.hot-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    },

    /**
     * 数组随机排序
     * @param {Array} array - 原数组
     * @returns {Array} 打乱后的数组
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
    }
};
