# 参与贡献

感谢你对 **Design Software Icons** 的关注！以下是参与方式与基本规范。

## 如何贡献

1. **Fork** 本仓库并在本地创建分支（如 `feat/add-icons`、`fix/search-bug`）
2. 完成修改后运行：
   ```bash
   npm install
   npm run build
   ```
3. 提交 **Pull Request**，并填写 PR 模板中的说明与测试清单

## 可贡献的方向

- **图标数据**：新增主题分类、子分类或图标词条（可使用 `scripts/` 下生成脚本）
- **AI 模块**：优化提示词、生成模式、服务商预设
- **搜索与体验**：改进检索、侧栏交互、导出流程
- **文档**：完善 README、截图、多语言说明
- **Bug 修复**：附带复现步骤与修复说明

## 代码规范

- 保持改动范围聚焦，避免无关重构
- 遵循项目现有风格（React + TypeScript + Tailwind）
- 新增 Lucide 图标名须在 `lucide-react` 中存在（生成脚本会自动校验）

## Issue

- Bug 请使用 [Bug 报告](.github/ISSUE_TEMPLATE/bug_report.yml) 模板
- 功能建议请使用 [功能建议](.github/ISSUE_TEMPLATE/feature_request.yml) 模板

## 协议

提交 PR 即表示你同意你的贡献以 [MIT License](LICENSE) 授权给本项目。

更多说明见 [README.md](README.md)。
