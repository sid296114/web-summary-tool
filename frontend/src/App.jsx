import { useState } from 'react'

// 后端 API 地址：
// - 本地开发时留空（走 Vite 代理）
// - 上线时在部署平台配置成后端地址，例如 https://你的后端.onrender.com
const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

function App() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('请输入网址')
      return
    }

    setLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await fetch(`${API_BASE}/api/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '请求失败')
      }

      setSummary(data.summary)
    } catch (err) {
      setError(err.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
          网页摘要工具
        </h1>
        <p className="text-purple-700 text-lg">
          输入任意网址，AI 自动抓取内容并生成中文摘要
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-purple-200/50 p-6 md:p-8 border border-purple-100">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-5 py-3.5 rounded-xl border border-purple-200 bg-purple-50/50 text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '总结中...' : '生成摘要'}
          </button>
        </form>

        {error && (
          <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 flex flex-col items-center justify-center text-purple-600">
            <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm">正在抓取网页并生成摘要，请稍候...</p>
          </div>
        )}

        {summary && !loading && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
              摘要结果
            </h2>
            <div className="p-5 rounded-xl bg-purple-50/70 border border-purple-100 text-purple-900 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-purple-400 text-sm">
        支持中英文网页 · 摘要用中文展示
      </p>
    </div>
  )
}

export default App
