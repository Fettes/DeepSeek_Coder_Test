import { useState, useRef, useEffect } from 'react'
import './App.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const API_KEY = 'sk-c1a9502d63404898bff2806caf42e312'
const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions'

const MODELS = {
  chat: { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '通用对话，速度快' },
  coder: { id: 'deepseek-coder', name: 'DeepSeek Coder', description: '代码专用' },
}

function App() {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [coderMessages, setCoderMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [coderLoading, setCoderLoading] = useState(false)
  
  const chatRef = useRef<HTMLDivElement>(null)
  const coderRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages, chatLoading])

  useEffect(() => {
    if (coderRef.current) {
      coderRef.current.scrollTop = coderRef.current.scrollHeight
    }
  }, [coderMessages, coderLoading])

  const sendToModel = async (
    modelId: string,
    messages: Message[],
    userMessage: Message,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true)
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: modelId,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.choices[0].message.content,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `错误: ${data.error.message}` }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: `请求失败: ${error}` }])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim()) return

    const userMessage: Message = { role: 'user', content: messageContent }
    
    // 同时添加用户消息到两个对话
    setChatMessages(prev => [...prev, userMessage])
    setCoderMessages(prev => [...prev, userMessage])
    setInput('')

    // 同时向两个模型发送请求
    sendToModel(MODELS.chat.id, chatMessages, userMessage, setChatMessages, setChatLoading)
    sendToModel(MODELS.coder.id, coderMessages, userMessage, setCoderMessages, setCoderLoading)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setChatMessages([])
    setCoderMessages([])
  }

  const isLoading = chatLoading || coderLoading

  const examplePrompts = [
    '用 Python 写一个快速排序算法',
    '解释 React hooks 的工作原理',
    '帮我写一个 TypeScript 的工具函数',
  ]

  const renderMessages = (
    messages: Message[],
    loading: boolean,
    ref: React.RefObject<HTMLDivElement>
  ) => (
    <div className="messages" ref={ref}>
      {messages.length === 0 && !loading ? (
        <div className="empty-hint">等待输入...</div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <pre>{message.content}</pre>
            </div>
          </div>
        ))
      )}
      {loading && (
        <div className="message assistant">
          <div className="message-avatar">🤖</div>
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 DeepSeek 模型对比</h1>
        <p>同时对比 Chat 和 Coder 模型的回答</p>
      </header>

      {chatMessages.length === 0 && coderMessages.length === 0 && (
        <div className="welcome-section">
          <p>点击以下提示词快速开始：</p>
          <div className="prompt-list">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-btn"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="compare-container">
        <div className="chat-panel">
          <div className="panel-header chat-header">
            <span className="panel-icon">💬</span>
            <span className="panel-title">{MODELS.chat.name}</span>
            <span className="panel-desc">{MODELS.chat.description}</span>
          </div>
          {renderMessages(chatMessages, chatLoading, chatRef)}
        </div>

        <div className="chat-panel">
          <div className="panel-header coder-header">
            <span className="panel-icon">👨‍💻</span>
            <span className="panel-title">{MODELS.coder.name}</span>
            <span className="panel-desc">{MODELS.coder.description}</span>
          </div>
          {renderMessages(coderMessages, coderLoading, coderRef)}
        </div>
      </div>

      <div className="input-section">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入你的问题，同时发送给两个模型..."
          disabled={isLoading}
          rows={3}
        />
        <div className="button-group">
          <button 
            onClick={clearChat} 
            className="clear-btn" 
            disabled={chatMessages.length === 0 && coderMessages.length === 0}
          >
            清空对话
          </button>
          <button onClick={() => sendMessage()} disabled={isLoading || !input.trim()}>
            {isLoading ? '发送中...' : '同时发送'}
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>DeepSeek 模型对比 Demo - 调研 Chat 与 Coder 模型差异</p>
      </footer>
    </div>
  )
}

export default App
