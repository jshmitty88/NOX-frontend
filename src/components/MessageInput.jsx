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
    <div
  className="flex flex-col justify-between px-4 py-4 rounded-[20px] border border-[#00E3FF] bg-[#1E1E1E] gap-2">
      {/* Text input */}
      <textarea
        rows={2}
        placeholder="Type your message..."
        className="bg-transparent text-white placeholder-white text-base focus:outline-none resize-none w-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          // Do nothing — always allow Enter or Shift+Enter to create a new line
          return
        }}
      />

      {/* Buttons row */}
      <div className="flex items-end justify-between mt-6">
        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-noxBlue text-black text-2x1 font-bold leading-[1] hover:bg-noxBlue/30"
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
          className="w-10 h-10 flex items-center justify-center rounded-full bg-noxBlue text-black text-xl font-bold leading-[1] hover:bg-noxBlue/30"
        >
          ↑
        </button>
      </div>
    </div>
  )
}

export default MessageInput