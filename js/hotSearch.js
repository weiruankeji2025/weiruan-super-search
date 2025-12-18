/**
 * 威软快搜 - 热搜功能模块
 * 实现多平台热搜榜单展示
 */

const HotSearchModule = {
    // 当前热搜源
    currentSource: 'weibo',

    // 当前热搜数据
    currentData: [],

    // 模拟热搜数据（实际项目中应从API获取）
    mockData: {
        weibo: [
            { title: '2024年度十大热搜', heat: '9999万', tag: '热' },
            { title: '春节档电影票房破纪录', heat: '8888万', tag: '爆' },
            { title: 'AI技术最新突破', heat: '7777万', tag: '新' },
            { title: '国产手机销量排行', heat: '6666万', tag: '' },
            { title: '考研成绩公布时间', heat: '5555万', tag: '' },
            { title: '新能源汽车补贴政策', heat: '4444万', tag: '' },
            { title: '热门综艺节目更新', heat: '3333万', tag: '' },
            { title: '国际油价最新动态', heat: '2222万', tag: '' },
            { title: '健康养生小妙招', heat: '1111万', tag: '' },
            { title: '明星最新动态', heat: '999万', tag: '' }
        ],
        baidu: [
            { title: '今日头条新闻', heat: '搜索热度 9999', tag: '热' },
            { title: '天气预报查询', heat: '搜索热度 8888', tag: '' },
            { title: '股票行情分析', heat: '搜索热度 7777', tag: '新' },
            { title: '美食菜谱大全', heat: '搜索热度 6666', tag: '' },
            { title: '旅游景点推荐', heat: '搜索热度 5555', tag: '' },
            { title: '电影院上映电影', heat: '搜索热度 4444', tag: '' },
            { title: '招聘求职信息', heat: '搜索热度 3333', tag: '' },
            { title: '房价走势分析', heat: '搜索热度 2222', tag: '' },
            { title: '汽车报价查询', heat: '搜索热度 1111', tag: '' },
            { title: '教育培训课程', heat: '搜索热度 999', tag: '' }
        ],
        zhihu: [
            { title: '如何看待人工智能的发展前景？', heat: '1.2亿热度', tag: '热' },
            { title: '年轻人应该如何理财？', heat: '8500万热度', tag: '精' },
            { title: '程序员35岁危机是真的吗？', heat: '7200万热度', tag: '' },
            { title: '为什么要读书？读书有什么用？', heat: '6800万热度', tag: '' },
            { title: '如何提高英语口语水平？', heat: '5500万热度', tag: '' },
            { title: '有哪些让你相见恨晚的学习方法？', heat: '4300万热度', tag: '' },
            { title: '如何评价某某电影？', heat: '3800万热度', tag: '' },
            { title: '怎样才能月入过万？', heat: '3200万热度', tag: '' },
            { title: '有哪些值得推荐的书籍？', heat: '2800万热度', tag: '' },
            { title: '如何保持健康的生活习惯？', heat: '2200万热度', tag: '' }
        ],
        douyin: [
            { title: '#热门舞蹈挑战', heat: '2.5亿次播放', tag: '热' },
            { title: '#美食制作教程', heat: '1.8亿次播放', tag: '爆' },
            { title: '#搞笑视频合集', heat: '1.5亿次播放', tag: '' },
            { title: '#宠物日常', heat: '1.2亿次播放', tag: '' },
            { title: '#旅行vlog', heat: '9800万次播放', tag: '' },
            { title: '#健身打卡', heat: '8500万次播放', tag: '' },
            { title: '#穿搭分享', heat: '7200万次播放', tag: '' },
            { title: '#生活小技巧', heat: '6500万次播放', tag: '' },
            { title: '#音乐翻唱', heat: '5800万次播放', tag: '' },
            { title: '#手工DIY', heat: '4500万次播放', tag: '' }
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
                <span>加载中...</span>
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
        const baseData = this.mockData[source] || this.mockData.weibo;

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
                    <span>暂无热搜数据</span>
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
