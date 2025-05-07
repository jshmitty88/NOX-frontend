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
        className="flex-1 p-2 rounded-xl border border-white bg-transparent text-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="border border-white rounded-full w-10 h-10 flex items-center justify-center bg-transparent hover:bg-white/10"
      >
        ↑
      </button>
    </div>
  )
}

export default MessageInput