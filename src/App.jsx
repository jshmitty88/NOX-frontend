import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import './styles/index.css'
import 'highlight.js/styles/github-dark.css'

const storedUserId = localStorage.getItem('user_id') || prompt("Enter your user ID:")
localStorage.setItem('user_id', storedUserId)

function App() {
  const userId = localStorage.getItem('user_id')
    const [messages, setMessages] = useState(() => {
  const stored = localStorage.getItem('messages')
  return stored ? JSON.parse(stored) : [
    { role: 'assistant', content: 'Welcome to NOX, Netrevenue Operations eXpert! How can I help?' }
  ]
})
const classifyTags = async (message) => {
  try {
    const res = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    const data = await res.json()
    return data?.tags || {
      tag_platform: "unknown",
      tag_department: "general",
      tag_importance: "medium"
    }
  } catch (err) {
    console.error("❌ Failed to classify tags:", err)
    return {
      tag_platform: "unknown",
      tag_department: "general",
      tag_importance: "medium"
    }
  }
}
useEffect(() => {
  localStorage.setItem('messages', JSON.stringify(messages))
}, [messages])

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text }
    const shouldRemember = /remember|update/i.test(text)
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
  
    const recentHistory = updatedMessages.slice(-15).map(m => `${m.role}: ${m.content}`).join('\n')
  
    console.log("Sending chat history to backend:", {
      user_id: userId,
      messages: [
        { role: 'user', content: text },
        { role: 'assistant', content: data.message }
      ]
    })
  
    try {
      const response = await fetch('https://web-production-1f17.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_id: userId,
          history: recentHistory
        })
      })
  
      const data = await response.json()
      const assistantReply = { role: 'assistant', content: data.message }
        

const data = await response.json()
const assistantReply = { role: 'assistant', content: data.message }

// ✅ NEW: Log history after GPT reply is received
try {
  await fetch('https://web-production-1f17.up.railway.app/chat-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      messages: [
        { role: 'user', content: text },
        { role: 'assistant', content: data.message }
      ]
    })
  })
  console.log("✅ Chat history logged")
} catch (err) {
  console.error("❌ Failed to log chat history:", err)
}

// ⬅️ Then: update message state
setMessages((prev) => {
  const updated = [...prev, assistantReply]
  localStorage.setItem('messages', JSON.stringify(updated))
  return updated
})
  
      // Memory tagging and storage
      if (shouldRemember) {
        const tagRes = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.content })
        })
  
        const tagData = await tagRes.json()
        const tags = tagData.tags || {}
  
        await fetch('https://web-production-1f17.up.railway.app/remember', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            topic: "user-input",
            memory_type: "user_message",
            content: userMessage.content,
            tag_platform: tags.tag_platform || "unknown",
            tag_department: tags.tag_department || "general",
            tag_importance: tags.tag_importance || "medium",
            source_chat_id: "nox-ui"
          })
        })
  
        setMessages((prev) => [...prev, { role: 'system', content: 'memory updated (automatically)' }])
      }
    } catch (err) {
      console.error("❌ Error in sendMessage:", err)
      setMessages((prev) => [...prev, {
        role: 'system',
        content: 'Error reaching backend. Check logs for details.'
      }])
    }
  }

const handleReflect = async () => {
  try {
    const userId = localStorage.getItem('user_id')

    // Step 1: Get last reflection timestamp
    const latestRes = await fetch(`https://web-production-1f17.up.railway.app/reflect/latest?user_id=${userId}`)
    const latestData = await latestRes.json()
    const lastReflectedAt = latestData.timestamp ? new Date(latestData.timestamp) : null

    // Step 2: Filter messages after that time
    const recentMessages = lastReflectedAt
      ? messages.filter(m => m.createdAt && new Date(m.createdAt) > lastReflectedAt)
      : messages

    const chatText = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')

    // Step 3: Send to /reflect
const response = await fetch('https://web-production-1f17.up.railway.app/reflect', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    topic: 'reflection',
    content: chatText,
    source_chat_id: "nox-ui"
  })
})

    const data = await response.json()
    setMessages((prev) => [
      ...prev,
      { role: 'system', content: `Reflection complete — ${data.entries_stored || 0} entries saved.` }
    ])
  } catch (err) {
    console.error('Reflect failed:', err)
    setMessages((prev) => [
      ...prev,
      { role: 'system', content: 'Reflection failed. Check logs or try again.' }
    ])
  }
}

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <div className="flex-1 overflow-auto px-4 pt-6 flex flex-col items-center">
        <header className="sticky top-0 z-10 bg-black border-b border-[#00E3FF] px-4">
          <div className="flex items-center gap-3 py-3">
            <img src="/logo-symbol.jpg" alt="NOX icon" className="h-10 w-10" />
            <h1 className="text-[#00E3FF] text-xl font-extrabold tracking-widest">
              NOX
            </h1>
          </div>
        </header>
        <ChatWindow messages={messages} />
      </div>
      <div className="px-4 mb-4 space-y-3">
        <button
          onClick={handleReflect}
          className="bg-[#1E1E1E] border border-[#00E3FF] text-white px-4 py-2 rounded-[12px] text-sm font-semibold hover:bg-[#2a2a2a]"
        >
          Reflect
        </button>
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App