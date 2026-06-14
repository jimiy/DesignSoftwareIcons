# Design Software Icons

一款面向应用与软件场景的 **图标浏览、定制与生成** 工具。内置数百个分类图标（Lucide 矢量 + 渐变圆角背景），支持手绘草图转图标、多格式导出，并接入 **OpenAI 兼容的大模型 API**，用自然语言描述即可智能生成图标。

---

## 功能概览

| 模块 | 说明 |
|------|------|
| 主题分类 | 12 个大类、50+ 子分类，可折叠侧栏浏览 |
| 图标库 | 每个子分类 10 个预设图标，支持 Lucide 矢量渲染 |
| 外观配置 | 渐变 / 纯色 / 透明背景，预设渐变色，可选徽标文字 |
| 草图绘制 | 画布手绘，一键转为 SVG 图标 |
| 关键词生成 | 本地词典匹配、Lucide 模糊搜索、程序化抽象图形 |
| **图标库搜索** | 全库实时搜索：名称、描述、Lucide 名、分类名，支持多关键词 |
| **AI 生成** | 接入用户自配 API，支持匹配 / SVG / 绘图多种模式 |
| 导出 | PNG、JPEG、SVG、ICO，多种分辨率 |

---

## 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm / yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

构建产物输出至 `dist/`，可用任意静态服务器托管。

### 搜索图标库

左侧栏顶部（或隐藏侧栏时主内容区标题旁）有 **「搜索图标库」** 输入框：

- **实时搜索**：输入即在全库 500+ 图标中检索，无需按回车
- **匹配范围**：图标名称、描述、Lucide 英文名、所属分类名
- **多关键词**：空格分隔多个词，需同时命中（如 `文件 蓝色`）
- **侧栏联动**：搜索时自动展开含结果的大类，并过滤无关子分类
- **点击结果**：跳转到对应分类并选中该图标，搜索框自动清空
- 按 `Esc` 或点击 ✕ 清除搜索

顶部输入框仍用于 **AI / 本地生成** 新图标，与图标库搜索相互独立。

---

## AI 生成模块

AI 模块允许你使用 **自己的 API Key 和接口地址**，对接 OpenAI、DeepSeek 及各类 **OpenAI 兼容中转网关**，无需在本项目中部署后端服务。

### 配置入口

1. 启动应用后，在右侧栏顶部找到 **「AI 生成配置」** 面板。
2. 打开 **启用** 开关。
3. 选择服务商或填写自定义 **API 地址 (Base URL)**。
4. 填入 **API Key**（仅保存在浏览器 `localStorage`，不会上传到本项目服务器）。
5. 按需修改 **对话模型**、**图像模型**（绘图模式需要）。
6. 点击 **「测试 API 连接」** 确认可用。
7. 在顶部搜索框输入描述，点击 **「✨ AI 生成」**。

### 生成模式

| 模式 | 说明 | 依赖接口 |
|------|------|----------|
| **智能自动** | 根据描述长度自动选择下方策略 | 对话 / 图像 API |
| **图标匹配** | AI 返回 Lucide 图标名、中文名称、渐变配色与可选徽标 | `POST /v1/chat/completions` |
| **原创 SVG** | AI 直接生成 52×52 视图内的 SVG 内层元素 | `POST /v1/chat/completions` |
| **AI 绘图** | 调用图像模型生成 1024×1024 位图图标 | `POST /v1/images/generations` |

**智能自动** 策略简述：

- 较短描述 → 图标匹配（快速、风格统一）
- 中等长度 → 原创 SVG（更自由的造型）
- 较长描述且已配置图像模型 → AI 绘图（位图效果）

可在配置面板中固定使用某一种模式，覆盖自动策略。

### 预设服务商

| 服务商 | 默认 Base URL | 默认对话模型 | 默认图像模型 |
|--------|---------------|--------------|--------------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` | `dall-e-3` |
| DeepSeek | `https://api.deepseek.com/v1` | `deepseek-chat` | — |
| Anthropic（兼容网关） | `https://api.anthropic.com/v1` | `claude-3-5-sonnet-20241022` | — |
| 自定义 | 自行填写 | 自行填写 | 自行填写 |

使用 **自定义** 时，请填写兼容 OpenAI 格式的网关地址，例如：

```text
https://your-gateway.example.com/v1
```

系统会自动规范化 URL（补全 `/v1`、去除多余的 `/chat/completions` 路径）。

### 风格提示

「风格提示」为可选字段，内容会附加到每次 AI 生成的提示词中，用于统一视觉风格，例如：

```text
现代扁平化应用图标，圆角矩形背景，居中白色线条图标
游戏赛博朋克风格，霓虹渐变
```

### 失败与回退

- AI 请求失败时，界面会显示错误原因，并 **自动回退** 到本地生成逻辑（词典匹配 / Lucide 搜索 / 程序化图形）。
- 图标匹配模式下，若 AI 未返回有效 Lucide 名称，会尝试本地解析或生成抽象 SVG。

### 安全说明

- API Key 存储键名：`icon-generator-ai-settings-v1`（`localStorage`）。
- 密钥 **不会** 经过本项目任何服务端；请求直接从浏览器发往你所配置的 API 地址。
- 请勿在公共设备上保存 Key；生产环境建议通过企业网关管控密钥与用量。

---

## 项目结构

```text
src/
├── main.tsx                          # 应用入口
├── app/
│   ├── App.tsx                       # 根组件
│   └── components/
│       ├── IconGenerator.tsx         # 主界面：侧栏、生成、导出、手绘
│       ├── iconData.ts               # 主题分类与图标数据聚合
│       ├── iconDataExpanded.ts       # 拓展主题数据（动物、建筑等）
│       ├── iconDataSocialCreative.ts # 社交 / 创意拓展数据
│       ├── ToolIcons.tsx             # SVG 构建与下载工具
│       ├── sketchUtils.ts            # 草图平滑、SVG 路径、程序化图形
│       ├── iconSearch.ts             # 图标库全库搜索与评分排序
│       └── ai/                       # AI 模块
│           ├── aiSettings.ts         # 配置类型、预设、本地存储
│           ├── aiIconService.ts        # OpenAI 兼容 API 调用与生成逻辑
│           └── AiSettingsPanel.tsx   # AI 配置 UI
scripts/
├── generate-expanded-themes.mjs      # 批量生成拓展主题数据
└── generate-social-creative-themes.mjs
```

### 核心模块说明

**IconGenerator**  
整合主题浏览、搜索/AI 生成、外观调节、草图板与导出。AI 启用时优先调用 `generateIconWithAi`，否则走 `handleLocalGenerate`。

**iconData**  
定义 `Theme`、`ThemeIcon` 类型，`themesData` 合并基础库与拓展数据；`themeGroups` 控制侧栏大类折叠结构。

**aiIconService**  
- `generateIconWithAi()` — 统一生成入口  
- `generateSmartIcon()` — 对话 JSON 模式，解析 Lucide 名与配色  
- `generateSvgIcon()` — 对话 JSON 模式，解析自定义 SVG  
- `generateImageIcon()` — 图像生成 API，返回 base64 位图  
- `testAiConnection()` — 连接测试  
- `normalizeBaseUrl()` — URL 规范化  

**AiSettingsPanel**  
服务商选择、Key/地址/模型配置、模式切换、风格提示、连接测试。

---

## 图标数据扩展

可通过脚本批量生成主题 JSON，再导入数据文件：

```bash
node scripts/generate-expanded-themes.mjs
node scripts/generate-social-creative-themes.mjs
```

生成结果分别写入 `iconDataExpanded.ts`、`iconDataSocialCreative.ts`，由 `iconData.ts` 自动合并。

---

## 技术栈

- **React 18** + **Vite 6**
- **Tailwind CSS 4**
- **lucide-react** — 矢量图标源
- **Radix UI** — 部分 UI  primitives

---

## 常见问题

**Q：点击 AI 生成没有反应？**  
确认已开启「启用」、填写 API Key 与 Base URL，且顶部按钮显示为「✨ AI 生成」。

**Q：图像模式报错？**  
需配置图像模型（如 `dall-e-3`），且网关需支持 `images/generations` 接口。

**Q：DeepSeek 能用绘图吗？**  
DeepSeek 预设未包含图像模型；可使用对话模式（图标匹配 / 原创 SVG），或经支持 OpenAI 图像接口的网关转发。

**Q：如何清空 AI 配置？**  
在浏览器开发者工具中清除 `localStorage` 项 `icon-generator-ai-settings-v1`，或删除 API Key 后关闭启用开关。

---

## 许可证

本项目为私有项目（`package.json` 中 `private: true`）。使用第三方 API 时须遵守对应服务商的使用条款与计费规则。
