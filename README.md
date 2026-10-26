# 网页摘要工具

输入任意网址，AI 自动抓取网页正文并生成中文摘要（中文展示）。

## 项目结构

```
web-summary-tool/
├── backend/             # Node.js + Express 后端（本地开发用）
├── frontend/            # React + Vite 前端（含 Vercel 无服务器函数）
│   ├── api/
│   │   └── summarize.js # 云端部署用的后端函数
│   ├── src/
│   │   └── App.jsx      # 界面
│   └── vercel.json      # Vercel 函数配置
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

## 部署到 Vercel（推荐，免费、不需要信用卡）

前端和后端函数都部署在 Vercel，一个平台搞定。

### 1. 把代码推到 GitHub（已完成）

仓库：https://github.com/sid296114/web-summary-tool

### 2. 在 Vercel 部署

1. 打开 https://vercel.com ，用 GitHub 账号登录。
2. 点 **Add New → Project**，导入 `web-summary-tool` 仓库。
3. 关键配置：
   - **Framework Preset**：选择 `Vite`
   - **Root Directory**：点 Edit，选择 `frontend`
   - **Build Command**：`npm run build`（一般自动识别，不用改）
   - **Output Directory**：`dist`（一般自动识别）
4. 添加环境变量：
   - Key：`OPENAI_API_KEY`，Value：你的真实 OpenAI Key
   - （可选）`OPENAI_MODEL`：默认 `gpt-4o-mini`
5. 点 **Deploy**，等 1-2 分钟。
6. 部署完成后，访问 Vercel 给你的网址（形如 `https://xxx.vercel.app`）即可使用。

> 注意：Vercel 免费版（Hobby）单个函数最长运行 60 秒，已通过 `vercel.json` 里的 `maxDuration: 60` 配置好，抓网页 + 生成摘要够用。

## 部署到 Render（备选，后端需绑信用卡）

后端 Web Service 需绑定信用卡，前端 Static Site 不需要卡。

- **后端（Web Service）**：Root 选 `backend`，Start 命令 `node server.js`，环境变量 `OPENAI_API_KEY`
- **前端（Static Site）**：Root 选 `frontend`，Build 命令 `npm install && npm run build`，Publish 目录 `dist`，环境变量 `VITE_API_BASE_URL` 填后端网址

## 注意事项

- `.env` 已被 `.gitignore` 忽略，API Key 不会上传到 Git 仓库。
- 免费部署的服务器首次访问可能稍慢（冷启动），属正常现象。
