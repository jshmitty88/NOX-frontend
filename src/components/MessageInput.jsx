import { useState } from 'react'

function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (text.trim() === '') return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 p-2 rounded border border-white bg-white text-black"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
      >
        Send
      </button>
    </div>
  )
}

export default MessageInput