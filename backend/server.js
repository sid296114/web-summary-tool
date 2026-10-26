import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 允许前端跨域请求
app.use(cors());
app.use(express.json());

// 初始化 OpenAI 客户端（仅在配置了 API Key 时）
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * 从网页 HTML 中提取正文文本
 */
function extractText(html) {
  const $ = cheerio.load(html);

  // 移除导航、广告、脚本、样式等无关元素
  $(
    'script, style, nav, footer, header, aside, .advertisement, .ads, .sidebar, [role="banner"], [role="navigation"]'
  ).remove();

  // 优先尝试提取 article 或 main 里的内容
  let text = $('article, main, .content, .post, .entry').first().text();

  // 如果没找到主要内容区域，就取 body 里的文字
  if (!text || text.trim().length < 50) {
    text = $('body').text();
  }

  // 清洗空白字符，并限制长度
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000);
}

/**
 * 调用 OpenAI 生成中文摘要
 */
async function summarizeWithAI(text) {
  // 如果没有配置 API Key，返回模拟摘要（方便先跑通界面）
  if (!process.env.OPENAI_API_KEY) {
    return '（当前未配置 OpenAI API Key，这是模拟摘要）\n\n' +
      '这段内容主要讲的是：用户输入了一个网址，系统抓取网页后用 AI 进行总结。' +
      '本工具支持中英文网页，摘要会用中文展示。';
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          '你是一位擅长总结文章的助手。请用 3-5 句话的中文概括用户提供的网页正文，要求简洁、准确、突出重点。如果原文是英文，也请用中文输出摘要。',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

/**
 * 摘要接口
 */
app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;

    // 简单校验 URL
    if (!url || !url.trim()) {
      return res.status(400).json({ error: '请输入网址' });
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    // 抓取网页
    const { data: html } = await axios.get(targetUrl, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      maxRedirects: 5,
    });

    // 提取正文
    const text = extractText(html);

    if (!text || text.length < 30) {
      return res.status(400).json({ error: '未能从该网页提取到有效内容，请尝试其他网址' });
    }

    // 生成摘要
    const summary = await summarizeWithAI(text);

    if (!summary) {
      return res.status(500).json({ error: 'AI 未能生成摘要，请稍后重试' });
    }

    res.json({ summary });
  } catch (error) {
    console.error('总结失败:', error.message);

    if (error.response) {
      return res.status(500).json({ error: `网页请求失败：${error.response.status}` });
    }

    if (error.code === 'ECONNABORTED') {
      return res.status(500).json({ error: '请求网页超时，请检查网址是否正确' });
    }

    res.status(500).json({
      error: error.message || '服务器内部错误，请稍后重试',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
});
