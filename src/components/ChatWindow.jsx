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
              className={`px-4 py-2 whitespace-pre-wrap text-white ${
                isUser
                  ? 'bg-black border border-noxBlue rounded-2xl max-w-[75%] shadow-sm'
                  : 'text-left max-w-[80%]'
              }`}
            >
              <ReactMarkdown
                  className="prose prose-invert text-white max-w-none"
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