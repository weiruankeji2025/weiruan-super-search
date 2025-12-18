/**
 * 威软快搜 - 配置文件
 * 包含所有搜索引擎配置和API设置
 */

const CONFIG = {
    // 应用名称
    appName: '威软快搜',
    version: '1.0.0',

    // 搜索引擎配置
    searchEngines: {
        // 综合搜索
        baidu: {
            name: '百度',
            url: 'https://www.baidu.com/s?wd=',
            icon: '🅱️',
            category: 'general'
        },
        bing: {
            name: '必应',
            url: 'https://www.bing.com/search?q=',
            icon: 'Ⓜ️',
            category: 'general'
        },
        google: {
            name: '谷歌',
            url: 'https://www.google.com/search?q=',
            icon: '🔍',
            category: 'general'
        },
        sogou: {
            name: '搜狗',
            url: 'https://www.sogou.com/web?query=',
            icon: '🐕',
            category: 'general'
        },
        '360': {
            name: '360搜索',
            url: 'https://www.so.com/s?q=',
            icon: '🔵',
            category: 'general'
        },

        // 网盘搜索
        pansou: {
            name: '盘搜搜',
            url: 'https://www.pansoso.org/search?q=',
            icon: '☁️',
            category: 'disk'
        },
        dalipan: {
            name: '大力盘',
            url: 'https://www.dalipan.com/search?keyword=',
            icon: '💿',
            category: 'disk'
        },
        '56wangpan': {
            name: '56网盘',
            url: 'https://www.56wangpan.com/search?q=',
            icon: '📁',
            category: 'disk'
        },
        yiso: {
            name: '易搜',
            url: 'https://yiso.fun/info?searchKey=',
            icon: '🔎',
            category: 'disk'
        },

        // 学术搜索
        scholar: {
            name: '谷歌学术',
            url: 'https://scholar.google.com/scholar?q=',
            icon: '🎓',
            category: 'academic'
        },
        cnki: {
            name: '知网',
            url: 'https://kns.cnki.net/kns8/defaultresult/index?kw=',
            icon: '📚',
            category: 'academic'
        },
        wanfang: {
            name: '万方',
            url: 'https://s.wanfangdata.com.cn/paper?q=',
            icon: '📖',
            category: 'academic'
        },

        // 社区论坛
        zhihu: {
            name: '知乎',
            url: 'https://www.zhihu.com/search?type=content&q=',
            icon: '💡',
            category: 'forum'
        },
        tieba: {
            name: '百度贴吧',
            url: 'https://tieba.baidu.com/f?kw=',
            icon: '📝',
            category: 'forum'
        },
        weibo: {
            name: '微博',
            url: 'https://s.weibo.com/weibo?q=',
            icon: '🌐',
            category: 'forum'
        },
        douban: {
            name: '豆瓣',
            url: 'https://www.douban.com/search?q=',
            icon: '🌿',
            category: 'forum'
        },

        // 视频搜索
        bilibili: {
            name: 'B站',
            url: 'https://search.bilibili.com/all?keyword=',
            icon: '📺',
            category: 'video'
        },
        youku: {
            name: '优酷',
            url: 'https://so.youku.com/search_video/q_',
            icon: '🎬',
            category: 'video'
        },
        iqiyi: {
            name: '爱奇艺',
            url: 'https://so.iqiyi.com/so/q_',
            icon: '🎥',
            category: 'video'
        },

        // 图片搜索
        baiduImg: {
            name: '百度图片',
            url: 'https://image.baidu.com/search/index?tn=baiduimage&word=',
            icon: '🖼️',
            category: 'image'
        },
        googleImg: {
            name: '谷歌图片',
            url: 'https://www.google.com/search?tbm=isch&q=',
            icon: '🏞️',
            category: 'image'
        },

        // 文档搜索
        baiduDoc: {
            name: '百度文库',
            url: 'https://wenku.baidu.com/search?word=',
            icon: '📄',
            category: 'doc'
        },
        docin: {
            name: '豆丁',
            url: 'https://www.docin.com/search.do?searchcat=2&searchType_banner=p&nkey=',
            icon: '📃',
            category: 'doc'
        },

        // 软件搜索
        github: {
            name: 'GitHub',
            url: 'https://github.com/search?q=',
            icon: '🐙',
            category: 'soft'
        },
        gitee: {
            name: 'Gitee',
            url: 'https://search.gitee.com/?type=repository&q=',
            icon: '🔴',
            category: 'soft'
        }
    },

    // 搜索类型映射
    searchTypes: {
        all: ['baidu', 'bing', 'google'],
        web: ['baidu', 'bing', 'google', 'sogou', '360'],
        disk: ['pansou', 'dalipan', '56wangpan', 'yiso'],
        forum: ['zhihu', 'tieba', 'weibo', 'douban'],
        video: ['bilibili', 'youku', 'iqiyi'],
        image: ['baiduImg', 'googleImg'],
        doc: ['baiduDoc', 'docin', 'cnki'],
        soft: ['github', 'gitee']
    },

    // 默认搜索引擎
    defaultEngine: 'baidu',

    // 本地存储键名
    storageKeys: {
        searchHistory: 'weiruan_search_history',
        theme: 'weiruan_theme',
        preferences: 'weiruan_preferences'
    },

    // 最大历史记录数
    maxHistoryCount: 20,

    // 热搜刷新间隔（毫秒）
    hotSearchRefreshInterval: 300000 // 5分钟
};

// 导出配置（兼容模块化和非模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
