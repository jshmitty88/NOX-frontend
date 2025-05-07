import { useState } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import ImageUploader from './components/ImageUploader'
import './styles/index.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to AnchorAI. How can I help?' }
  ])
  const [image, setImage] = useState(null)

  const sendMessage = async (text) => {
    const userMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])

    const response = await fetch('https://web-production-1f17.up.railway.app/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
    const data = await response.json()
    const assistantReply = { role: 'assistant', content: data.reply }

    setMessages((prev) => [...prev, assistantReply])
  }

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <div className="flex-1 overflow-auto px-4 pt-6">
        <ChatWindow messages={messages} />
      </div>
      <div className="border-t border-white p-4 bg-background">
        <ImageUploader image={image} setImage={setImage} />
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App