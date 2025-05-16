import { useState } from 'react'

// MessageInput: Handles chat text entry and sending
function MessageInput({ onSend }) {
  const [text, setText] = useState('')

  // Triggered when user hits "send" button or presses Enter
  const handleSend = async () => {
    if (text.trim() === '') return // prevent empty messages
    onSend(text)
    setText('') // clear input after send
  }

  return (
    <div className="flex flex-col justify-between px-4 py-2 rounded-[20px] border border-[#00E3FF] bg-[#1E1E1E] gap-2">
      {/* Text input box */}
      <textarea
        rows={2}
        placeholder="Type your message..."
        className="bg-transparent text-white placeholder-white text-base focus:outline-none resize-none w-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={e => {
          // Ctrl+Enter or Cmd+Enter sends the message
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSend()
          }
        }}
      />

      {/* Send button */}
      <div className="flex items-end justify-end mt-6">
        <button
          onClick={handleSend}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-noxBlue"
        >
          <span className="text-black text-2xl font-extrabold leading-[1]">↑</span>
        </button>
      </div>
    </div>
  )
}

export default MessageInput