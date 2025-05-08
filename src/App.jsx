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

useEffect(() => {
  localStorage.setItem('messages', JSON.stringify(messages))
}, [messages])

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text }
    const shouldRemember = /remember|update/i.test(text)
    setMessages((prev) => [...prev, userMessage])
  
    try {
      const response = await fetch('https://web-production-1f17.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_id: userId
           })
      })
  
      const data = await response.json()
      const assistantReply = { role: 'assistant', content: data.message }
      setMessages((prev) => {
        const updated = [...prev, assistantReply]
        localStorage.setItem('messages', JSON.stringify(updated))
        return updated
      })
  
    if (shouldRemember) {
      await fetch('https://web-production-1f17.up.railway.app/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          topic: "chat-response",
          memory_type: "assistant_reply",
          content: assistantReply.content,
          tag_agent: "nox",
          tag_platform: "frontend",
          tag_department: "general",
          tag_urgency: "low",
          source_chat_id: "nox-ui"

      })
      })  // ✅ THIS is where the fetch() ends
      setMessages((prev) => {
        const updated = [...prev, { role: 'system', content: 'memory updated (automatically)' }]
        localStorage.setItem('messages', JSON.stringify(updated))
        return updated
}) // closes if (shouldRemember)
} // closes try block

}catch (err) {
      const errorReply = { role: 'assistant', content: 'Error reaching backend.' }
      setMessages((prev) => [...prev, errorReply])
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
        <img src="/logo.png" alt="NOX logo" className="h-36 mb-6" />
        <ChatWindow messages={messages} />
      </div>
      <div className="px-4 mb-4 space-y-3">
        <button
          onClick={handleReflect}
          className="bg-noxBlue/20 text-white px-4 py-2 rounded-md hover:bg-noxBlue/30"
        >
          Reflect
        </button>
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App