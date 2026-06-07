<div align="center">

# 🚀 TokenCrunch

**輕量級 LLM 輸入智能壓縮引擎**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/gitstq/TokenCrunch)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-orange.svg)](package.json)

**[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)**

</div>

---

<a name="english"></a>
# 🇺🇸 English

## 🎉 Introduction

**TokenCrunch** is a lightweight, zero-dependency LLM input intelligent compression engine inspired by the trending [headroom](https://github.com/chopratejas/headroom) project on GitHub. While headroom focuses on Python ecosystems, TokenCrunch differentiates itself by:

- **Zero dependencies** - Pure Node.js implementation, no external packages
- **Multi-format intelligence** - Auto-detects JSON, Markdown, Code, and Logs
- **Three compression modes** - From conservative to aggressive
- **Proxy middleware** - Drop-in compression for OpenAI/Anthropic APIs
- **Visual reports** - Beautiful terminal output with compression statistics

### 💡 Why TokenCrunch?

LLM API costs scale with token usage. TokenCrunch helps you **reduce token consumption by 60-95%** while preserving semantic integrity, directly translating to significant cost savings on OpenAI, Anthropic, and other LLM providers.

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🧠 **Smart Format Detection** | Automatically identifies JSON, Markdown, Code, and Log formats |
| 📉 **Three Compression Modes** | Conservative (20-40%), Balanced (40-70%), Aggressive (60-95%) |
| 🔧 **Semantic Compression** | Removes filler words, simplifies verbose phrases, compresses numbers |
| 🏗️ **Structural Compression** | Collapses arrays, removes comments, deduplicates logs |
| 🔌 **API Proxy Middleware** | Seamless integration with OpenAI and Anthropic APIs |
| 📊 **Visual Reports** | Beautiful terminal output with compression statistics |
| 🚀 **Zero Dependencies** | Pure Node.js, no npm install required |
| ⚡ **High Performance** | Processes thousands of words in milliseconds |

## 🚀 Quick Start

### Requirements
- **Node.js** >= 14.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/gitstq/TokenCrunch.git
cd TokenCrunch

# No npm install needed - zero dependencies!
```

### CLI Usage

```bash
# Compress a file
node bin/tokensqueeze.js input.txt

# Aggressive compression mode
node bin/tokensqueeze.js --aggressive logfile.log

# Save output to file
node bin/tokensqueeze.js -o output.md input.md

# Compress inline text
node bin/tokensqueeze.js -t "Your long text here..."

# Pipe from stdin
echo "text to compress" | node bin/tokensqueeze.js

# Show help
node bin/tokensqueeze.js --help
```

### Programmatic API

```javascript
const { compress, createEngine, createProxy } = require('./src');

// Quick compress
const result = compress('Your text here...');
console.log(`Saved ${result.tokensSaved} tokens (${result.compressionRatio}%)`);

// Advanced usage with options
const engine = createEngine({ mode: 'aggressive' });
const result = engine.compressFile(jsonContent, 'data.json');

// API Proxy middleware
const proxy = createProxy();
const compressed = proxy.compressOpenAIRequest(openAIRequest);
```

## 📖 Detailed Usage Guide

### Compression Modes

**Conservative Mode** (`--conservative`)
- Preserves maximum quality
- ~20-40% compression
- Best for: Critical business content, legal documents

**Balanced Mode** (`--balanced`, default)
- Good quality/compression balance
- ~40-70% compression
- Best for: General purpose, chat conversations

**Aggressive Mode** (`--aggressive`)
- Maximum compression
- ~60-95% compression
- Best for: Logs, large JSON, non-critical content

### Output Formats

```bash
# Text report (default)
node bin/tokensqueeze.js file.txt

# JSON report
node bin/tokensqueeze.js -f json file.txt

# Markdown report
node bin/tokensqueeze.js -f markdown file.txt
```

### Proxy Middleware Integration

```javascript
const { createProxy } = require('tokensqueeze');
const proxy = createProxy();

// Express middleware
app.use(proxy.createMiddleware({ provider: 'openai' }));

// Manual compression
const result = proxy.compressText(yourText);
console.log(proxy.getStats()); // Session statistics
```

## 💡 Design Philosophy

TokenCrunch was designed with three core principles:

1. **Zero Dependencies** - No security risks from third-party packages
2. **Format Intelligence** - Different content needs different strategies
3. **Transparency** - Always show what was compressed and how much was saved

### Tech Stack
- Pure Node.js (ES5 compatible)
- Zero external dependencies
- Built-in token estimation algorithm
- Modular strategy pattern

### Roadmap
- [ ] Web interface for visual compression
- [ ] VS Code extension
- [ ] More format support (YAML, XML, CSV)
- [ ] Custom compression rules
- [ ] Batch file processing

## 📦 Deployment

No build step required! TokenCrunch is ready to use immediately after cloning.

```bash
# Global installation (optional)
npm link

# Now use anywhere
tokensqueeze file.txt
tsq --aggressive log.txt
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `refactor:` Code refactoring
- `test:` Test additions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="简体中文"></a>
# 🇨🇳 简体中文

## 🎉 项目介绍

**TokenCrunch** 是一款轻量级、零依赖的 LLM 输入智能压缩引擎，灵感来源于 GitHub 热门项目 [headroom](https://github.com/chopratejas/headroom)。与 headroom 专注 Python 生态不同，TokenCrunch 的差异化亮点包括：

- **零依赖** - 纯 Node.js 实现，无需任何外部包
- **多格式智能识别** - 自动检测 JSON、Markdown、代码和日志格式
- **三种压缩模式** - 从保守到激进，灵活适配不同场景
- **代理中间件** - 一键接入 OpenAI/Anthropic API 压缩
- **可视化报告** - 精美的终端输出，压缩效果一目了然

### 💡 为什么需要 TokenCrunch？

LLM API 成本与 Token 用量直接挂钩。TokenCrunch 帮助你在**保持语义完整性的前提下减少 60-95% 的 Token 消耗**，直接转化为 OpenAI、Anthropic 等服务商的显著成本节省。

## ✨ 核心特性

| 特性 | 说明 |
|------|------|
| 🧠 **智能格式检测** | 自动识别 JSON、Markdown、代码和日志格式 |
| 📉 **三种压缩模式** | 保守模式 (20-40%)、平衡模式 (40-70%)、激进模式 (60-95%) |
| 🔧 **语义压缩** | 去除填充词、简化冗长短语、压缩数字表示 |
| 🏗️ **结构化压缩** | 折叠数组、删除注释、日志去重 |
| 🔌 **API 代理中间件** | 无缝集成 OpenAI 和 Anthropic API |
| 📊 **可视化报告** | 精美的终端输出，展示压缩统计信息 |
| 🚀 **零依赖** | 纯 Node.js，无需 npm install |
| ⚡ **高性能** | 毫秒级处理数千字文本 |

## 🚀 快速开始

### 环境要求
- **Node.js** >= 14.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/gitstq/TokenCrunch.git
cd TokenCrunch

# 无需 npm install - 零依赖！
```

### CLI 使用

```bash
# 压缩文件
node bin/tokensqueeze.js input.txt

# 激进压缩模式
node bin/tokensqueeze.js --aggressive logfile.log

# 保存输出到文件
node bin/tokensqueeze.js -o output.md input.md

# 压缩内联文本
node bin/tokensqueeze.js -t "你的长文本内容..."

# 从标准输入管道
echo "要压缩的文本" | node bin/tokensqueeze.js

# 显示帮助
node bin/tokensqueeze.js --help
```

### 编程 API

```javascript
const { compress, createEngine, createProxy } = require('./src');

// 快速压缩
const result = compress('你的文本内容...');
console.log(`节省 ${result.tokensSaved} 个 Token (${result.compressionRatio}%)`);

// 高级用法
const engine = createEngine({ mode: 'aggressive' });
const result = engine.compressFile(jsonContent, 'data.json');

// API 代理中间件
const proxy = createProxy();
const compressed = proxy.compressOpenAIRequest(openAIRequest);
```

## 📖 详细使用指南

### 压缩模式

**保守模式** (`--conservative`)
- 最大程度保留质量
- ~20-40% 压缩率
- 适用：关键业务内容、法律文档

**平衡模式** (`--balanced`，默认)
- 质量与压缩率的最佳平衡
- ~40-70% 压缩率
- 适用：通用场景、聊天对话

**激进模式** (`--aggressive`)
- 最大压缩率
- ~60-95% 压缩率
- 适用：日志、大型 JSON、非关键内容

### 输出格式

```bash
# 文本报告（默认）
node bin/tokensqueeze.js file.txt

# JSON 报告
node bin/tokensqueeze.js -f json file.txt

# Markdown 报告
node bin/tokensqueeze.js -f markdown file.txt
```

### 代理中间件集成

```javascript
const { createProxy } = require('tokensqueeze');
const proxy = createProxy();

// Express 中间件
app.use(proxy.createMiddleware({ provider: 'openai' }));

// 手动压缩
const result = proxy.compressText(yourText);
console.log(proxy.getStats()); // 会话统计
```

## 💡 设计思路

TokenCrunch 遵循三大核心设计原则：

1. **零依赖** - 杜绝第三方包带来的安全风险
2. **格式智能** - 不同内容需要不同压缩策略
3. **透明可控** - 始终展示压缩内容和节省比例

### 技术选型
- 纯 Node.js（兼容 ES5）
- 零外部依赖
- 内置 Token 估算算法
- 模块化策略模式

### 迭代规划
- [ ] Web 可视化压缩界面
- [ ] VS Code 扩展插件
- [ ] 更多格式支持（YAML、XML、CSV）
- [ ] 自定义压缩规则
- [ ] 批量文件处理

## 📦 打包与部署

无需构建步骤！克隆后即可直接使用。

```bash
# 全局安装（可选）
npm link

# 全局使用
tokensqueeze file.txt
tsq --aggressive log.txt
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下规范：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 发起 Pull Request

### 提交规范
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试补充

## 📄 开源协议

本项目基于 MIT 协议开源 - 详见 [LICENSE](LICENSE) 文件。

---

<a name="繁體中文"></a>
# 🇹🇼 繁體中文

## 🎉 專案介紹

**TokenCrunch** 是一款輕量級、零依賴的 LLM 輸入智能壓縮引擎，靈感來源於 GitHub 熱門專案 [headroom](https://github.com/chopratejas/headroom)。與 headroom 專注 Python 生態不同，TokenCrunch 的差異化亮點包括：

- **零依賴** - 純 Node.js 實現，無需任何外部套件
- **多格式智能識別** - 自動檢測 JSON、Markdown、程式碼和日誌格式
- **三種壓縮模式** - 從保守到激進，靈活適配不同場景
- **代理中介軟體** - 一鍵接入 OpenAI/Anthropic API 壓縮
- **可視化報告** - 精美的終端輸出，壓縮效果一目瞭然

### 💡 為什麼需要 TokenCrunch？

LLM API 成本與 Token 用量直接掛鉤。TokenCrunch 幫助你在**保持語義完整性的前提下減少 60-95% 的 Token 消耗**，直接轉化為 OpenAI、Anthropic 等服務商的顯著成本節省。

## ✨ 核心特性

| 特性 | 說明 |
|------|------|
| 🧠 **智能格式檢測** | 自動識別 JSON、Markdown、程式碼和日誌格式 |
| 📉 **三種壓縮模式** | 保守模式 (20-40%)、平衡模式 (40-70%)、激進模式 (60-95%) |
| 🔧 **語義壓縮** | 去除填充詞、簡化冗長短語、壓縮數字表示 |
| 🏗️ **結構化壓縮** | 折疊陣列、刪除註解、日誌去重 |
| 🔌 **API 代理中介軟體** | 無縫整合 OpenAI 和 Anthropic API |
| 📊 **可視化報告** | 精美的終端輸出，展示壓縮統計資訊 |
| 🚀 **零依賴** | 純 Node.js，無需 npm install |
| ⚡ **高效能** | 毫秒級處理數千字文本 |

## 🚀 快速開始

### 環境要求
- **Node.js** >= 14.0.0

### 安裝

```bash
# 克隆倉庫
git clone https://github.com/gitstq/TokenCrunch.git
cd TokenCrunch

# 無需 npm install - 零依賴！
```

### CLI 使用

```bash
# 壓縮檔案
node bin/tokensqueeze.js input.txt

# 激進壓縮模式
node bin/tokensqueeze.js --aggressive logfile.log

# 儲存輸出到檔案
node bin/tokensqueeze.js -o output.md input.md

# 壓縮內聯文本
node bin/tokensqueeze.js -t "你的長文本內容..."

# 從標準輸入管道
echo "要壓縮的文本" | node bin/tokensqueeze.js

# 顯示說明
node bin/tokensqueeze.js --help
```

### 程式設計 API

```javascript
const { compress, createEngine, createProxy } = require('./src');

// 快速壓縮
const result = compress('你的文本內容...');
console.log(`節省 ${result.tokensSaved} 個 Token (${result.compressionRatio}%)`);

// 進階用法
const engine = createEngine({ mode: 'aggressive' });
const result = engine.compressFile(jsonContent, 'data.json');

// API 代理中介軟體
const proxy = createProxy();
const compressed = proxy.compressOpenAIRequest(openAIRequest);
```

## 📖 詳細使用指南

### 壓縮模式

**保守模式** (`--conservative`)
- 最大程度保留品質
- ~20-40% 壓縮率
- 適用：關鍵業務內容、法律文件

**平衡模式** (`--balanced`，預設)
- 品質與壓縮率的最佳平衡
- ~40-70% 壓縮率
- 適用：通用場景、聊天對話

**激進模式** (`--aggressive`)
- 最大壓縮率
- ~60-95% 壓縮率
- 適用：日誌、大型 JSON、非關鍵內容

### 輸出格式

```bash
# 文本報告（預設）
node bin/tokensqueeze.js file.txt

# JSON 報告
node bin/tokensqueeze.js -f json file.txt

# Markdown 報告
node bin/tokensqueeze.js -f markdown file.txt
```

### 代理中介軟體整合

```javascript
const { createProxy } = require('tokensqueeze');
const proxy = createProxy();

// Express 中介軟體
app.use(proxy.createMiddleware({ provider: 'openai' }));

// 手動壓縮
const result = proxy.compressText(yourText);
console.log(proxy.getStats()); // 會話統計
```

## 💡 設計理念

TokenCrunch 遵循三大核心設計原則：

1. **零依賴** - 杜絕第三方套件帶來的安全風險
2. **格式智能** - 不同內容需要不同壓縮策略
3. **透明可控** - 始終展示壓縮內容和節省比例

### 技術選型
- 純 Node.js（相容 ES5）
- 零外部依賴
- 內建 Token 估算演算法
- 模組化策略模式

### 迭代規劃
- [ ] Web 可視化壓縮介面
- [ ] VS Code 擴充套件
- [ ] 更多格式支援（YAML、XML、CSV）
- [ ] 自訂壓縮規則
- [ ] 批次檔案處理

## 📦 打包與部署

無需建置步驟！克隆後即可直接使用。

```bash
# 全域安裝（可選）
npm link

# 全域使用
tokensqueeze file.txt
tsq --aggressive log.txt
```

## 🤝 貢獻指南

歡迎貢獻程式碼！請遵循以下規範：

1. Fork 本倉庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'feat: 新增功能'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 發起 Pull Request

### 提交規範
- `feat:` 新功能
- `fix:` 修復問題
- `docs:` 文件更新
- `refactor:` 程式碼重構
- `test:` 測試補充

## 📄 開源協議

本專案基於 MIT 協議開源 - 詳見 [LICENSE](LICENSE) 檔案。
