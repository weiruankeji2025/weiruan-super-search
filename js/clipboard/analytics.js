/**
 * 分析模块
 * 负责高频词统计和数据分析
 */

class ClipboardAnalytics {
    constructor() {
        this.stopWords = new Set([
            // 英文停用词
            'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
            'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
            'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
            'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
            // 中文停用词
            '的', '了', '在', '是', '我', '有', '和', '就', '不', '人',
            '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去',
            '你', '会', '着', '没有', '看', '好', '自己', '这'
        ]);
    }

    /**
     * 分析剪切板数据
     */
    analyzeClipboard(range = 'all') {
        const stats = window.clipboardStorage.getStatistics(range);
        const items = this.getItemsByRange(range);

        // 提取所有文本内容
        const allText = items
            .filter(item => item.type === 'text')
            .map(item => item.content)
            .join(' ');

        // 分词和统计
        const wordFrequency = this.analyzeWordFrequency(allText);
        const phrases = this.extractPhrases(items);
        const patterns = this.detectPatterns(items);

        return {
            ...stats,
            wordFrequency,
            phrases,
            patterns,
            typeDistribution: this.getTypeDistribution(items),
            timeDistribution: this.getTimeDistribution(items),
            lengthStats: this.getLengthStats(items)
        };
    }

    /**
     * 按时间范围获取项目
     */
    getItemsByRange(range) {
        const items = window.clipboardStorage.getItems();

        if (range === 'all') return items;

        const now = Date.now();
        const ranges = {
            today: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000
        };

        const timeLimit = now - (ranges[range] || 0);
        return items.filter(item => item.timestamp >= timeLimit);
    }

    /**
     * 分析词频
     */
    analyzeWordFrequency(text) {
        const words = this.tokenize(text);
        const frequency = {};

        words.forEach(word => {
            if (this.isValidWord(word)) {
                frequency[word] = (frequency[word] || 0) + 1;
            }
        });

        // 转换为数组并排序
        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 100)
            .map(([word, count]) => ({ word, count }));
    }

    /**
     * 分词
     */
    tokenize(text) {
        // 简单的分词实现
        // 对于中文，可以使用更专业的分词库
        return text
            .toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    /**
     * 检查是否为有效词
     */
    isValidWord(word) {
        // 过滤停用词和太短的词
        if (word.length < 2) return false;
        if (this.stopWords.has(word)) return false;

        // 过滤纯数字
        if (/^\d+$/.test(word)) return false;

        return true;
    }

    /**
     * 提取短语
     */
    extractPhrases(items) {
        const phrases = {};

        items.forEach(item => {
            if (item.type !== 'text') return;

            // 提取2-5词的短语
            const words = this.tokenize(item.content);

            for (let len = 2; len <= 5; len++) {
                for (let i = 0; i <= words.length - len; i++) {
                    const phrase = words.slice(i, i + len).join(' ');

                    if (this.isValidPhrase(phrase)) {
                        phrases[phrase] = (phrases[phrase] || 0) + item.frequency;
                    }
                }
            }
        });

        return Object.entries(phrases)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .map(([phrase, count]) => ({ phrase, count }));
    }

    /**
     * 检查是否为有效短语
     */
    isValidPhrase(phrase) {
        const words = phrase.split(' ');

        // 至少包含一个非停用词
        const hasValidWord = words.some(word => !this.stopWords.has(word));
        if (!hasValidWord) return false;

        // 不全是停用词
        const allStopWords = words.every(word => this.stopWords.has(word));
        if (allStopWords) return false;

        return true;
    }

    /**
     * 检测模式
     */
    detectPatterns(items) {
        const patterns = {
            urls: 0,
            emails: 0,
            phoneNumbers: 0,
            dates: 0,
            numbers: 0,
            code: 0
        };

        const regexPatterns = {
            url: /https?:\/\/[^\s]+/g,
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
            date: /\b\d{4}[-/]\d{2}[-/]\d{2}\b|\b\d{2}[-/]\d{2}[-/]\d{4}\b/g,
            number: /\b\d+\.?\d*\b/g
        };

        items.forEach(item => {
            const content = item.content;

            if (regexPatterns.url.test(content)) patterns.urls += item.frequency;
            if (regexPatterns.email.test(content)) patterns.emails += item.frequency;
            if (regexPatterns.phone.test(content)) patterns.phoneNumbers += item.frequency;
            if (regexPatterns.date.test(content)) patterns.dates += item.frequency;
            if (item.type === 'code') patterns.code += item.frequency;
        });

        return patterns;
    }

    /**
     * 获取类型分布
     */
    getTypeDistribution(items) {
        const distribution = {};

        items.forEach(item => {
            distribution[item.type] = (distribution[item.type] || 0) + 1;
        });

        return Object.entries(distribution).map(([type, count]) => ({
            type,
            count,
            percentage: (count / items.length * 100).toFixed(1)
        }));
    }

    /**
     * 获取时间分布
     */
    getTimeDistribution(items) {
        const distribution = {
            hourly: new Array(24).fill(0),
            daily: new Array(7).fill(0)
        };

        items.forEach(item => {
            const date = new Date(item.timestamp);
            const hour = date.getHours();
            const day = date.getDay();

            distribution.hourly[hour] += item.frequency;
            distribution.daily[day] += item.frequency;
        });

        return distribution;
    }

    /**
     * 获取长度统计
     */
    getLengthStats(items) {
        const lengths = items.map(item => item.content.length);

        return {
            min: Math.min(...lengths),
            max: Math.max(...lengths),
            avg: lengths.reduce((a, b) => a + b, 0) / lengths.length,
            median: this.calculateMedian(lengths)
        };
    }

    /**
     * 计算中位数
     */
    calculateMedian(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    /**
     * 生成词云数据
     */
    generateWordCloud(words, maxWords = 50) {
        const topWords = words.slice(0, maxWords);

        if (topWords.length === 0) return [];

        const maxCount = topWords[0].count;
        const minCount = topWords[topWords.length - 1].count;

        return topWords.map(({ word, count }) => ({
            text: word,
            size: this.calculateWordSize(count, minCount, maxCount),
            count: count
        }));
    }

    /**
     * 计算词的显示大小
     */
    calculateWordSize(count, minCount, maxCount) {
        const minSize = 12;
        const maxSize = 48;

        if (maxCount === minCount) return maxSize;

        const ratio = (count - minCount) / (maxCount - minCount);
        return Math.round(minSize + ratio * (maxSize - minSize));
    }

    /**
     * 获取推荐内容
     */
    getRecommendations(limit = 10) {
        const items = window.clipboardStorage.getItems();

        // 根据频率和最近使用时间计算分数
        const scoredItems = items.map(item => {
            const recency = (Date.now() - item.timestamp) / (1000 * 60 * 60); // 小时
            const score = item.frequency * Math.exp(-recency / 24); // 24小时衰减

            return { ...item, score };
        });

        return scoredItems
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * 导出分析报告
     */
    exportReport(range = 'all') {
        const analysis = this.analyzeClipboard(range);

        const report = {
            generatedAt: new Date().toISOString(),
            range: range,
            summary: {
                totalItems: analysis.uniqueItems,
                totalCopies: analysis.totalCopies,
                topWord: analysis.topWord
            },
            topWords: analysis.wordFrequency.slice(0, 20),
            topPhrases: analysis.phrases.slice(0, 20),
            patterns: analysis.patterns,
            typeDistribution: analysis.typeDistribution,
            lengthStats: analysis.lengthStats
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clipboard_analytics_${range}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 创建全局实例
window.clipboardAnalytics = new ClipboardAnalytics();
