import { useRef, useState } from 'react'

function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (text.trim() === '') return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex items-center gap-2 rounded-[20px] border border-white px-3 py-2 bg-transparent">
      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/10"
      >
        +
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0]
          if (file) {
            alert('File selected: ' + file.name) // you can connect this to setImage
          }
        }}
      />

      {/* Message Input */}
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 bg-transparent text-white placeholder-white focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white hover:bg-white/10"
      >
        ↑
      </button>
    </div>
  )
}

export default MessageInput