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
    <div className="flex items-end gap-2 px-4 py-8 rounded-[24px] bg-[#16283c] min-h-[72px]">
      {/* Plus Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-xl font-bold hover:bg-white/20"
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
            alert('File selected: ' + file.name)
          }
        }}
      />

      {/* Text input */}
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 bg-transparent text-white placeholder-white text-base focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white text-xl font-bold hover:bg-white/20"
      >
        ↑
      </button>
    </div>
  )
}

export default MessageInput
