import { useRef, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'

function MessageInput({ onSend }) {
  const [text, setText] = useState('')
  const [pendingImageBase64, setPendingImageBase64] = useState(null)
  const fileInputRef = useRef(null)

    // Send message (and image if one was uploaded)
  const handleSend = () => {
    if (text.trim() === '' && !pendingImageBase64) return
  
    if (pendingImageBase64) {
      const imageMarkdown = `![uploaded image](${pendingImageBase64})`
      const fullMessage = `${imageMarkdown}\n\n${text}`
      onSend(fullMessage)
    } else {
      onSend(text)
    }
  
    // Reset input and image
    setText('')
    setPendingImageBase64(null)
  }
  
    // Handle image upload and log selected filename
    const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    console.log("📸 Selected file:", file.name)
  
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result
      setPendingImageBase64(base64String) // store in state
      console.log("🖼️ Image ready to send with next message")
  
      try {
        const res = await fetch("https://web-production-1f17.up.railway.app/analyze_image_base64", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64: base64String,
            filename: file.name
          })
        })
  
        const data = await res.json()
        console.log("🧠 GPT Vision response:", data)
  
        if (data.result) {
          onSend(data.result)
        } else {
          onSend("⚠️ Image analysis failed.")
        }
  
      } catch (err) {
        console.error("❌ Upload failed:", err)
        onSend("⚠️ Failed to process the image. Please try again.")
      }
    }
  
    reader.readAsDataURL(file)
  }

  return (
    <div
  className="flex flex-col justify-between px-4 py-2 rounded-[20px] border border-[#00E3FF] bg-[#1E1E1E] gap-2">
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
          <PlusIcon className="w-7 h-7 text-black" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Send Button */}
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