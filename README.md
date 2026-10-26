# 网页摘要工具

输入任意网址，AI 自动抓取网页正文并生成中文摘要。

## 项目结构

```
web-summary-tool/
├── backend/    # Node.js + Express 后端（抓网页 + 调 OpenAI）
└── frontend/   # React + Vite 前端（界面）
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

## 部署到云端（Render 免费方案）

推荐把前后端都部署到 [Render](https://render.com)，一个平台搞定。

### 1. 先把代码推到 GitHub

```bash
cd web-summary-tool
git init
git add .
git commit -m "网页摘要工具"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 部署后端（Render Web Service）

1. 打开 Render，点 **New → Web Service**，连接你的 GitHub 仓库。
2. 配置：
   - **Root Directory**：`backend`
   - **Build Command**：`npm install`
   - **Start Command**：`node server.js`
3. 添加环境变量：
   - `OPENAI_API_KEY` = 你的真实 Key
4. 点 **Create Web Service**，等部署完成，记下给你的网址，例如 `https://xxx.onrender.com`。

### 3. 部署前端（Render Static Site）

1. Render 里点 **New → Static Site**，连接同一个仓库。
2. 配置：
   - **Root Directory**：`frontend`
   - **Build Command**：`npm install && npm run build`
   - **Publish Directory**：`dist`
3. 添加环境变量：
   - `VITE_API_BASE_URL` = 第 2 步得到的后端网址（例如 `https://xxx.onrender.com`）
4. 点 **Create Static Site**，等部署完成，访问它给你的网址即可。

> 前端也可以部署到 Vercel / Netlify，配置方式类似：把 `VITE_API_BASE_URL` 设成后端地址即可。

## 注意事项

- `.env` 已被 `.gitignore` 忽略，API Key 不会上传到 Git 仓库。
- 后端 `cors()` 默认允许所有来源，正式上线可改成只允许你的前端域名。
