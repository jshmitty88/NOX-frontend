import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

function ChatWindow({ messages }) {
  const containerRef = useRef(null)

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-auto flex flex-col space-y-2 pb-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user'

        return (
          <div
            key={index}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`px-4 py-2 whitespace-pre-wrap text-white overflow-x-auto max-w-full break-words ${
                isUser
                  ? 'bg-[#1E1E1E] rounded-2xl max-w-[75%] shadow-sm'
                  : 'text-left max-w-[80%]'
  }`}
>
              <ReactMarkdown
                // Applies Tailwind’s dark mode-friendly typography styles
                // `prose` = enable markdown formatting (headings, lists, etc.)
                // `prose-invert` = dark mode variant
                // `max-w-full` = keeps content inside the chat bubble
                className="prose prose-invert max-w-full"
                rehypePlugins={[rehypeHighlight]}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatWindow