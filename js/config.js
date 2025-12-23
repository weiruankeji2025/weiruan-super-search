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
        google: {
            name: 'Google',
            url: 'https://www.google.com/search?q=',
            icon: '🔍',
            category: 'general'
        },
        bing: {
            name: 'Bing',
            url: 'https://www.bing.com/search?q=',
            icon: 'Ⓜ️',
            category: 'general'
        },
        duckduckgo: {
            name: 'DuckDuckGo',
            url: 'https://duckduckgo.com/?q=',
            icon: '🦆',
            category: 'general'
        },
        yahoo: {
            name: 'Yahoo',
            url: 'https://search.yahoo.com/search?p=',
            icon: '🟣',
            category: 'general'
        },
        ecosia: {
            name: 'Ecosia',
            url: 'https://www.ecosia.org/search?q=',
            icon: '🌳',
            category: 'general'
        },

        // 云盘/文件搜索
        googleDrive: {
            name: 'Google Drive',
            url: 'https://drive.google.com/drive/search?q=',
            icon: '📁',
            category: 'disk'
        },
        dropbox: {
            name: 'Dropbox',
            url: 'https://www.dropbox.com/search/personal?query=',
            icon: '📦',
            category: 'disk'
        },
        onedrive: {
            name: 'OneDrive',
            url: 'https://onedrive.live.com/?q=',
            icon: '☁️',
            category: 'disk'
        },
        mediafire: {
            name: 'MediaFire',
            url: 'https://www.mediafire.com/search?q=',
            icon: '🔥',
            category: 'disk'
        },

        // 学术搜索
        scholar: {
            name: 'Google Scholar',
            url: 'https://scholar.google.com/scholar?q=',
            icon: '🎓',
            category: 'academic'
        },
        pubmed: {
            name: 'PubMed',
            url: 'https://pubmed.ncbi.nlm.nih.gov/?term=',
            icon: '🔬',
            category: 'academic'
        },
        arxiv: {
            name: 'arXiv',
            url: 'https://arxiv.org/search/?query=',
            icon: '📐',
            category: 'academic'
        },
        semanticScholar: {
            name: 'Semantic Scholar',
            url: 'https://www.semanticscholar.org/search?q=',
            icon: '🧠',
            category: 'academic'
        },
        jstor: {
            name: 'JSTOR',
            url: 'https://www.jstor.org/action/doBasicSearch?Query=',
            icon: '📚',
            category: 'academic'
        },

        // 社区论坛
        reddit: {
            name: 'Reddit',
            url: 'https://www.reddit.com/search/?q=',
            icon: '🤖',
            category: 'forum'
        },
        quora: {
            name: 'Quora',
            url: 'https://www.quora.com/search?q=',
            icon: '❓',
            category: 'forum'
        },
        stackoverflow: {
            name: 'Stack Overflow',
            url: 'https://stackoverflow.com/search?q=',
            icon: '📊',
            category: 'forum'
        },
        twitter: {
            name: 'X (Twitter)',
            url: 'https://twitter.com/search?q=',
            icon: '🐦',
            category: 'forum'
        },
        hackernews: {
            name: 'Hacker News',
            url: 'https://hn.algolia.com/?q=',
            icon: '🔶',
            category: 'forum'
        },

        // 视频搜索
        youtube: {
            name: 'YouTube',
            url: 'https://www.youtube.com/results?search_query=',
            icon: '▶️',
            category: 'video'
        },
        vimeo: {
            name: 'Vimeo',
            url: 'https://vimeo.com/search?q=',
            icon: '🎬',
            category: 'video'
        },
        dailymotion: {
            name: 'Dailymotion',
            url: 'https://www.dailymotion.com/search/',
            icon: '📹',
            category: 'video'
        },
        twitch: {
            name: 'Twitch',
            url: 'https://www.twitch.tv/search?term=',
            icon: '🎮',
            category: 'video'
        },

        // 图片搜索
        googleImg: {
            name: 'Google Images',
            url: 'https://www.google.com/search?tbm=isch&q=',
            icon: '🖼️',
            category: 'image'
        },
        unsplash: {
            name: 'Unsplash',
            url: 'https://unsplash.com/s/photos/',
            icon: '📷',
            category: 'image'
        },
        pexels: {
            name: 'Pexels',
            url: 'https://www.pexels.com/search/',
            icon: '🏞️',
            category: 'image'
        },
        flickr: {
            name: 'Flickr',
            url: 'https://www.flickr.com/search/?text=',
            icon: '📸',
            category: 'image'
        },
        pinterest: {
            name: 'Pinterest',
            url: 'https://www.pinterest.com/search/pins/?q=',
            icon: '📌',
            category: 'image'
        },

        // 文档搜索
        scribd: {
            name: 'Scribd',
            url: 'https://www.scribd.com/search?query=',
            icon: '📄',
            category: 'doc'
        },
        slideshare: {
            name: 'SlideShare',
            url: 'https://www.slideshare.net/search/slideshow?q=',
            icon: '📊',
            category: 'doc'
        },
        academia: {
            name: 'Academia.edu',
            url: 'https://www.academia.edu/search?q=',
            icon: '🎓',
            category: 'doc'
        },
        issuu: {
            name: 'Issuu',
            url: 'https://issuu.com/search?q=',
            icon: '📖',
            category: 'doc'
        },

        // 软件/代码搜索
        github: {
            name: 'GitHub',
            url: 'https://github.com/search?q=',
            icon: '🐙',
            category: 'soft'
        },
        gitlab: {
            name: 'GitLab',
            url: 'https://gitlab.com/search?search=',
            icon: '🦊',
            category: 'soft'
        },
        sourceforge: {
            name: 'SourceForge',
            url: 'https://sourceforge.net/directory/?q=',
            icon: '💾',
            category: 'soft'
        },
        npm: {
            name: 'npm',
            url: 'https://www.npmjs.com/search?q=',
            icon: '📦',
            category: 'soft'
        },
        pypi: {
            name: 'PyPI',
            url: 'https://pypi.org/search/?q=',
            icon: '🐍',
            category: 'soft'
        }
    },

    // 搜索类型映射
    searchTypes: {
        all: ['google', 'bing', 'duckduckgo'],
        web: ['google', 'bing', 'duckduckgo', 'yahoo', 'ecosia'],
        disk: ['googleDrive', 'dropbox', 'onedrive', 'mediafire'],
        forum: ['reddit', 'quora', 'stackoverflow', 'twitter', 'hackernews'],
        video: ['youtube', 'vimeo', 'dailymotion', 'twitch'],
        image: ['googleImg', 'unsplash', 'pexels', 'flickr', 'pinterest'],
        doc: ['scribd', 'slideshare', 'academia', 'scholar'],
        soft: ['github', 'gitlab', 'sourceforge', 'npm', 'pypi']
    },

    // 默认搜索引擎
    defaultEngine: 'google',

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
