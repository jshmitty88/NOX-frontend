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
                className="prose prose-invert max-w-full text-white leading-relaxed"
                rehypePlugins={[rehypeHighlight]}
                components={{
                  li: ({ children }) => (
                    <li className="mb-2 text-sm leading-normal text-white list-disc list-inside">
                      {children}
                    </li>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc list-inside pl-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal list-inside pl-0">
                      {children}
                    </ol>
                  )
                }}
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