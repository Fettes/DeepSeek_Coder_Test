# DeepSeek Coder Demo

一个用于调研和测试 DeepSeek Coder API 的前端 Demo 项目。

## 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS3** - 现代样式

## 功能特性

- 🎨 现代化的深色主题 UI
- 💬 与 DeepSeek Coder 进行对话
- ⚙️ 可配置的 API Key 和端点
- 📝 代码高亮显示
- 🔄 加载状态动画

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 配置 API

1. 获取 [DeepSeek API Key](https://platform.deepseek.com/)
2. 在页面上输入你的 API Key
3. 开始与 DeepSeek Coder 对话

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 项目结构

```
DeepSeek_Coder_Test/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx        # 主应用组件
│   ├── App.css        # 组件样式
│   ├── main.tsx       # 入口文件
│   ├── index.css      # 全局样式
│   └── vite-env.d.ts  # Vite 类型声明
├── index.html         # HTML 模板
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## DeepSeek API 说明

本 Demo 使用 DeepSeek 的 Chat Completions API，兼容 OpenAI 格式：

- **API 端点**: `https://api.deepseek.com/v1/chat/completions`
- **模型**: `deepseek-coder`
- **文档**: [DeepSeek API Docs](https://platform.deepseek.com/api-docs/)

## 注意事项

- 请妥善保管你的 API Key，不要将其提交到版本控制
- API 调用可能会产生费用，请注意使用量
- 建议在 `.env` 文件中存储敏感配置（生产环境）

## License

MIT
