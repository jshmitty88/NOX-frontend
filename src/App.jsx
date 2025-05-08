import { useState } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import './styles/index.css'
import 'highlight.js/styles/github-dark.css'

const storedUserId = localStorage.getItem('user_id') || prompt("Enter your user ID:")
localStorage.setItem('user_id', storedUserId)

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to NOX, Netrevenue Operations eXpert! How can I help?' }
  ])

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
          user_id: localStorage.getItem('user_id')
           })
      })
  
      const data = await response.json()
      const assistantReply = { role: 'assistant', content: data.message }
      setMessages((prev) => [...prev, assistantReply])
  
    if (shouldRemember) {
      await fetch('https://web-production-1f17.up.railway.app/remember', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          topic: "chat-response",
          memory_type: "assistant_reply",
          content: assistantReply.content,
          tag_agent: "nox",
          tag_platform: "frontend",
          tag_department: "general",
          tag_urgency: "low",
          source_chat_id: "nox-ui"
        })
      })
      
      setMessages((prev) => [
    ...prev,
    { role: 'system', content: 'memory updated (automatically)' }
  ])
  } // closes if (shouldRemember)

    }catch (err) {
      const errorReply = { role: 'assistant', content: 'Error reaching backend.' }
      setMessages((prev) => [...prev, errorReply])
    }
  }


  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <div className="flex-1 overflow-auto px-4 pt-6 flex flex-col items-center">
        <img src="/logo.png" alt="NOX logo" className="h-36 mb-6" />
        <ChatWindow messages={messages} />
      </div>
      <div className="px-4 mb-4">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App