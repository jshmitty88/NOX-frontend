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
    <div className="flex flex-col justify-between px-4 py-6 rounded-[24px] border border-[#00E3FF]/40 bg-[#1E1E1E] min-h-[72px] gap-2">
      {/* Text input */}
      <textarea
        rows={2}
        placeholder="Type your message..."
        className="bg-transparent text-white placeholder-white text-base focus:outline-none resize-none w-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
      />

      {/* Buttons row */}
      <div className="flex items-end justify-between mt-6">
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-noxBlue/20 text-black text-xl font-bold leading-[1] hover:bg-noxBlue/30"
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

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-noxBlue/20 text-black text-xl font-bold leading-[1] hover:bg-noxBlue/30"
        >
          ↑
        </button>
      </div>
    </div>
  )
}

export default MessageInput