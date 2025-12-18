/**
 * 威软快搜 - 快捷工具模块
 * 实现各种实用小工具功能
 */

const ToolsModule = {
    // 工具配置
    tools: {
        translate: {
            name: '在线翻译',
            icon: '🌍',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>输入要翻译的文本：</label>
                        <textarea class="form-input" id="translateInput" rows="4" placeholder="请输入文本..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>选择翻译方向：</label>
                        <select class="form-input" id="translateDirection">
                            <option value="zh2en">中文 → 英文</option>
                            <option value="en2zh">英文 → 中文</option>
                            <option value="zh2jp">中文 → 日文</option>
                            <option value="jp2zh">日文 → 中文</option>
                        </select>
                    </div>
                    <button class="form-btn" onclick="ToolsModule.translate()">翻译</button>
                    <div class="form-group" style="margin-top: 16px;">
                        <label>翻译结果：</label>
                        <div class="result-box" id="translateResult">翻译结果将显示在这里...</div>
                    </div>
                </div>
            `
        },
        calculator: {
            name: '计算器',
            icon: '🧮',
            render: () => `
                <div class="tool-form">
                    <div class="calculator-display">
                        <input type="text" class="form-input" id="calcDisplay" value="0" readonly>
                    </div>
                    <div class="calculator-buttons">
                        <button class="calc-btn" onclick="ToolsModule.calcInput('C')">C</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('(')">(</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput(')')">)</button>
                        <button class="calc-btn operator" onclick="ToolsModule.calcInput('/')">÷</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('7')">7</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('8')">8</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('9')">9</button>
                        <button class="calc-btn operator" onclick="ToolsModule.calcInput('*')">×</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('4')">4</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('5')">5</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('6')">6</button>
                        <button class="calc-btn operator" onclick="ToolsModule.calcInput('-')">-</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('1')">1</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('2')">2</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('3')">3</button>
                        <button class="calc-btn operator" onclick="ToolsModule.calcInput('+')">+</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('0')">0</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('.')">.</button>
                        <button class="calc-btn" onclick="ToolsModule.calcInput('del')">⌫</button>
                        <button class="calc-btn equal" onclick="ToolsModule.calcInput('=')">=</button>
                    </div>
                </div>
            `
        },
        weather: {
            name: '天气查询',
            icon: '🌤️',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>输入城市名称：</label>
                        <input type="text" class="form-input" id="weatherCity" placeholder="如：北京、上海">
                    </div>
                    <button class="form-btn" onclick="ToolsModule.getWeather()">查询天气</button>
                    <div class="weather-result" id="weatherResult" style="margin-top: 16px;">
                        <div class="result-box">输入城市名称后点击查询</div>
                    </div>
                </div>
            `
        },
        ip: {
            name: 'IP查询',
            icon: '📍',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>输入IP地址（留空查询本机IP）：</label>
                        <input type="text" class="form-input" id="ipInput" placeholder="如：8.8.8.8">
                    </div>
                    <button class="form-btn" onclick="ToolsModule.getIPInfo()">查询IP</button>
                    <div class="ip-result" id="ipResult" style="margin-top: 16px;">
                        <div class="result-box">点击查询获取IP信息</div>
                    </div>
                </div>
            `
        },
        express: {
            name: '快递查询',
            icon: '📦',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>选择快递公司：</label>
                        <select class="form-input" id="expressCompany">
                            <option value="auto">自动识别</option>
                            <option value="sf">顺丰速运</option>
                            <option value="yt">圆通速递</option>
                            <option value="zt">中通快递</option>
                            <option value="yd">韵达快递</option>
                            <option value="st">申通快递</option>
                            <option value="jd">京东物流</option>
                            <option value="ems">EMS</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>输入快递单号：</label>
                        <input type="text" class="form-input" id="expressNo" placeholder="请输入快递单号">
                    </div>
                    <button class="form-btn" onclick="ToolsModule.getExpress()">查询物流</button>
                    <div class="express-result" id="expressResult" style="margin-top: 16px;">
                        <div class="result-box">输入单号后点击查询</div>
                    </div>
                </div>
            `
        },
        qrcode: {
            name: '二维码生成',
            icon: '📱',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>输入要生成二维码的内容：</label>
                        <textarea class="form-input" id="qrcodeInput" rows="3" placeholder="输入网址或文本"></textarea>
                    </div>
                    <button class="form-btn" onclick="ToolsModule.generateQRCode()">生成二维码</button>
                    <div class="qrcode-result" id="qrcodeResult" style="margin-top: 16px; text-align: center;">
                        <div class="result-box">输入内容后生成二维码</div>
                    </div>
                </div>
            `
        },
        color: {
            name: '颜色转换',
            icon: '🎨',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>选择颜色：</label>
                        <input type="color" class="form-input" id="colorPicker" value="#4f46e5" style="height: 50px; padding: 5px;">
                    </div>
                    <div class="color-results" style="margin-top: 16px;">
                        <div class="form-group">
                            <label>HEX：</label>
                            <input type="text" class="form-input" id="hexValue" value="#4f46e5" readonly>
                        </div>
                        <div class="form-group">
                            <label>RGB：</label>
                            <input type="text" class="form-input" id="rgbValue" value="rgb(79, 70, 229)" readonly>
                        </div>
                        <div class="form-group">
                            <label>HSL：</label>
                            <input type="text" class="form-input" id="hslValue" value="hsl(243, 75%, 59%)" readonly>
                        </div>
                    </div>
                </div>
            `
        },
        time: {
            name: '时间戳转换',
            icon: '⏰',
            render: () => `
                <div class="tool-form">
                    <div class="form-group">
                        <label>当前时间戳（秒）：</label>
                        <input type="text" class="form-input" id="currentTimestamp" value="${Math.floor(Date.now() / 1000)}" readonly>
                    </div>
                    <div class="form-group">
                        <label>时间戳转日期：</label>
                        <input type="text" class="form-input" id="timestampInput" placeholder="输入时间戳">
                    </div>
                    <button class="form-btn" onclick="ToolsModule.timestampToDate()">转换</button>
                    <div class="form-group" style="margin-top: 16px;">
                        <label>转换结果：</label>
                        <div class="result-box" id="timestampResult">输入时间戳后点击转换</div>
                    </div>
                    <hr style="margin: 16px 0; border-color: var(--border-color);">
                    <div class="form-group">
                        <label>日期转时间戳：</label>
                        <input type="datetime-local" class="form-input" id="dateInput">
                    </div>
                    <button class="form-btn" onclick="ToolsModule.dateToTimestamp()">转换</button>
                    <div class="form-group" style="margin-top: 16px;">
                        <label>转换结果：</label>
                        <div class="result-box" id="dateResult">选择日期后点击转换</div>
                    </div>
                </div>
            `
        }
    },

    // 计算器表达式
    calcExpression: '0',

    /**
     * 初始化工具模块
     */
    init() {
        this.bindEvents();
        this.addToolStyles();
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 工具卡片点击
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const toolKey = card.dataset.tool;
                this.openTool(toolKey);
            });
        });

        // 模态框关闭
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        // 点击模态框外部关闭
        const modal = document.getElementById('toolModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    /**
     * 添加工具样式
     */
    addToolStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .calculator-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                margin-top: 16px;
            }
            .calc-btn {
                padding: 16px;
                font-size: 1.2rem;
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            .calc-btn:hover {
                background: var(--primary-light);
            }
            .calc-btn.operator {
                background: var(--primary-light);
                color: var(--primary-color);
            }
            .calc-btn.equal {
                background: var(--gradient-primary);
                color: white;
            }
            #calcDisplay {
                font-size: 1.5rem;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * 打开工具
     * @param {string} toolKey - 工具键名
     */
    openTool(toolKey) {
        const tool = this.tools[toolKey];
        if (!tool) return;

        const modal = document.getElementById('toolModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = tool.icon + ' ' + tool.name;
            modalBody.innerHTML = tool.render();
            modal.classList.add('visible');

            // 特殊工具初始化
            if (toolKey === 'color') {
                this.initColorPicker();
            }
        }
    },

    /**
     * 关闭模态框
     */
    closeModal() {
        const modal = document.getElementById('toolModal');
        if (modal) {
            modal.classList.remove('visible');
        }
    },

    /**
     * 翻译功能
     */
    translate() {
        const input = document.getElementById('translateInput');
        const result = document.getElementById('translateResult');
        const direction = document.getElementById('translateDirection');

        if (!input || !result) return;

        const text = input.value.trim();
        if (!text) {
            result.textContent = '请输入要翻译的文本';
            return;
        }

        // 模拟翻译（实际项目中应调用翻译API）
        result.textContent = '正在翻译...';

        setTimeout(() => {
            // 模拟翻译结果
            const mockTranslations = {
                'zh2en': `Translation: ${text} (This is a simulated translation)`,
                'en2zh': `翻译结果：${text}（这是模拟翻译结果）`,
                'zh2jp': `翻訳：${text}（これはシミュレートされた翻訳です）`,
                'jp2zh': `翻译结果：${text}（这是模拟翻译结果）`
            };
            result.textContent = mockTranslations[direction.value] || text;
        }, 500);
    },

    /**
     * 计算器输入
     * @param {string} value - 输入值
     */
    calcInput(value) {
        const display = document.getElementById('calcDisplay');
        if (!display) return;

        switch (value) {
            case 'C':
                this.calcExpression = '0';
                break;
            case 'del':
                this.calcExpression = this.calcExpression.slice(0, -1) || '0';
                break;
            case '=':
                try {
                    this.calcExpression = String(eval(this.calcExpression));
                } catch (e) {
                    this.calcExpression = 'Error';
                }
                break;
            default:
                if (this.calcExpression === '0' && value !== '.') {
                    this.calcExpression = value;
                } else {
                    this.calcExpression += value;
                }
        }

        display.value = this.calcExpression;
    },

    /**
     * 天气查询
     */
    getWeather() {
        const cityInput = document.getElementById('weatherCity');
        const result = document.getElementById('weatherResult');

        if (!cityInput || !result) return;

        const city = cityInput.value.trim();
        if (!city) {
            result.innerHTML = '<div class="result-box">请输入城市名称</div>';
            return;
        }

        result.innerHTML = '<div class="result-box">正在查询...</div>';

        // 模拟天气数据（实际项目中应调用天气API）
        setTimeout(() => {
            const mockWeather = {
                city: city,
                temp: Math.floor(Math.random() * 30) + 5,
                weather: ['晴', '多云', '阴', '小雨'][Math.floor(Math.random() * 4)],
                humidity: Math.floor(Math.random() * 50) + 30,
                wind: ['东风', '南风', '西风', '北风'][Math.floor(Math.random() * 4)] + Math.floor(Math.random() * 5 + 1) + '级'
            };

            result.innerHTML = `
                <div class="result-box">
                    <p><strong>城市：</strong>${mockWeather.city}</p>
                    <p><strong>温度：</strong>${mockWeather.temp}°C</p>
                    <p><strong>天气：</strong>${mockWeather.weather}</p>
                    <p><strong>湿度：</strong>${mockWeather.humidity}%</p>
                    <p><strong>风向：</strong>${mockWeather.wind}</p>
                </div>
            `;
        }, 500);
    },

    /**
     * IP查询
     */
    getIPInfo() {
        const ipInput = document.getElementById('ipInput');
        const result = document.getElementById('ipResult');

        if (!result) return;

        result.innerHTML = '<div class="result-box">正在查询...</div>';

        // 模拟IP信息（实际项目中应调用IP查询API）
        setTimeout(() => {
            const ip = ipInput?.value.trim() || '您的公网IP';
            const mockInfo = {
                ip: ip || '123.123.123.123',
                country: '中国',
                region: '北京市',
                city: '北京',
                isp: '中国电信'
            };

            result.innerHTML = `
                <div class="result-box">
                    <p><strong>IP地址：</strong>${mockInfo.ip}</p>
                    <p><strong>国家：</strong>${mockInfo.country}</p>
                    <p><strong>省份：</strong>${mockInfo.region}</p>
                    <p><strong>城市：</strong>${mockInfo.city}</p>
                    <p><strong>运营商：</strong>${mockInfo.isp}</p>
                </div>
            `;
        }, 500);
    },

    /**
     * 快递查询
     */
    getExpress() {
        const expressNo = document.getElementById('expressNo');
        const result = document.getElementById('expressResult');

        if (!expressNo || !result) return;

        const no = expressNo.value.trim();
        if (!no) {
            result.innerHTML = '<div class="result-box">请输入快递单号</div>';
            return;
        }

        result.innerHTML = '<div class="result-box">正在查询...</div>';

        // 模拟快递信息
        setTimeout(() => {
            const now = new Date();
            const mockExpress = [
                { time: this.formatDate(new Date(now - 3600000)), status: '快件已签收，签收人：本人' },
                { time: this.formatDate(new Date(now - 7200000)), status: '快件正在派送中，快递员：王师傅' },
                { time: this.formatDate(new Date(now - 86400000)), status: '快件已到达【北京朝阳营业点】' },
                { time: this.formatDate(new Date(now - 172800000)), status: '快件已从【上海转运中心】发出' },
                { time: this.formatDate(new Date(now - 259200000)), status: '快件已收取' }
            ];

            result.innerHTML = `
                <div class="result-box">
                    <p><strong>单号：</strong>${no}</p>
                    <hr style="margin: 8px 0; border-color: var(--border-color);">
                    ${mockExpress.map(item => `
                        <p style="margin-bottom: 8px;">
                            <span style="color: var(--text-tertiary); font-size: 0.85rem;">${item.time}</span><br>
                            ${item.status}
                        </p>
                    `).join('')}
                </div>
            `;
        }, 500);
    },

    /**
     * 生成二维码
     */
    generateQRCode() {
        const input = document.getElementById('qrcodeInput');
        const result = document.getElementById('qrcodeResult');

        if (!input || !result) return;

        const text = input.value.trim();
        if (!text) {
            result.innerHTML = '<div class="result-box">请输入内容</div>';
            return;
        }

        // 使用Google Charts API生成二维码（实际项目中可使用本地库）
        const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(text)}`;

        result.innerHTML = `
            <div style="padding: 16px; background: white; border-radius: 8px; display: inline-block;">
                <img src="${qrUrl}" alt="QR Code" style="display: block;">
            </div>
            <p style="margin-top: 8px; color: var(--text-secondary); font-size: 0.85rem;">扫描二维码查看内容</p>
        `;
    },

    /**
     * 初始化颜色选择器
     */
    initColorPicker() {
        const colorPicker = document.getElementById('colorPicker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.updateColorValues(e.target.value);
            });
        }
    },

    /**
     * 更新颜色值
     * @param {string} hex - HEX颜色值
     */
    updateColorValues(hex) {
        const hexInput = document.getElementById('hexValue');
        const rgbInput = document.getElementById('rgbValue');
        const hslInput = document.getElementById('hslValue');

        if (hexInput) hexInput.value = hex;

        // HEX to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        if (rgbInput) rgbInput.value = `rgb(${r}, ${g}, ${b})`;

        // RGB to HSL
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
                case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
                case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
            }
        }

        if (hslInput) hslInput.value = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    },

    /**
     * 时间戳转日期
     */
    timestampToDate() {
        const input = document.getElementById('timestampInput');
        const result = document.getElementById('timestampResult');

        if (!input || !result) return;

        const timestamp = parseInt(input.value.trim());
        if (isNaN(timestamp)) {
            result.textContent = '请输入有效的时间戳';
            return;
        }

        // 判断是秒还是毫秒
        const ms = timestamp > 9999999999 ? timestamp : timestamp * 1000;
        const date = new Date(ms);

        result.textContent = this.formatDate(date);
    },

    /**
     * 日期转时间戳
     */
    dateToTimestamp() {
        const input = document.getElementById('dateInput');
        const result = document.getElementById('dateResult');

        if (!input || !result) return;

        const date = new Date(input.value);
        if (isNaN(date.getTime())) {
            result.textContent = '请选择有效的日期';
            return;
        }

        const timestamp = Math.floor(date.getTime() / 1000);
        result.textContent = `秒级时间戳: ${timestamp}\n毫秒级时间戳: ${date.getTime()}`;
    },

    /**
     * 格式化日期
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
};
