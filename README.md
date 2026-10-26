# 网页摘要工具

输入任意网址，AI 自动抓取网页正文并生成中文摘要（中文展示）。

## 项目结构

```
web-summary-tool/
├── backend/             # Node.js + Express 后端（本地开发用）
├── frontend/            # React + Vite 前端（含 Netlify 无服务器函数）
│   ├── netlify/
│   │   └── functions/
│   │       └── summarize.js  # 云端部署用的后端函数
│   ├── src/
│   │   └── App.jsx      # 界面
│   └── netlify.toml     # Netlify 构建与函数配置
└── .gitignore
```

## 本地运行

需要同时开两个终端：

```bash
# 终端 1：后端（端口 3000）
cd backend
npm install
node server.js

# 终端 2：前端（端口 5173）
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173

## 配置 OpenAI API Key

在 `backend` 目录新建 `.env` 文件：

```
OPENAI_API_KEY=sk-你的真实key
```

不填 Key 时会显示模拟摘要（用于先跑通界面）。

## 部署到 Netlify（推荐，免费、不需要信用卡、国内可访问）

前端和后端函数都部署在 Netlify，一个平台搞定。

### 1. 把代码推到 GitHub（已完成）

仓库：https://github.com/sid296114/web-summary-tool

### 2. 在 Netlify 部署

1. 打开 https://app.netlify.com ，用 GitHub 账号登录。
2. 点 **Add new site → Import an existing project**，选择 GitHub，导入 `web-summary-tool` 仓库。
3. 关键配置（Netlify 一般会自动读取 `netlify.toml`，通常不用改）：
   - **Base directory**：填 `frontend`
   - **Build command**：`npm run build`
   - **Publish directory**：`dist`
4. 添加环境变量（Site settings → Environment variables）：
   - Key：`OPENAI_API_KEY`，Value：你的真实 OpenAI Key
   - （可选）`OPENAI_MODEL`：默认 `gpt-4o-mini`
5. 点 **Deploy site**，等 1-2 分钟。
6. 部署完成后，访问 Netlify 给你的网址（形如 `https://xxx.netlify.app`）即可使用。

> `netlify.app` 域名在国内通常可以访问。若个别地区访问慢，可考虑绑定自定义域名。

## 部署到 Vercel（备选，国内常被墙）

Vercel 部署方式类似，但 `vercel.app` 域名在国内经常无法访问，不推荐国内使用。

## 部署到 Render（备选，后端需绑信用卡）

后端 Web Service 需绑定信用卡，前端 Static Site 不需要卡。

## 注意事项

- `.env` 已被 `.gitignore` 忽略，API Key 不会上传到 Git 仓库。
- 免费部署的服务器首次访问可能稍慢（冷启动），属正常现象。
