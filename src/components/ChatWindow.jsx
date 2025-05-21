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
    <div
  ref={containerRef}
  className="flex-1 overflow-y-auto px-4 pt-6 flex flex-col items-center w-full max-w-full"
>
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user'

        return (
          // Outer wrapper: aligns user to right, assistant to left
          <div
            key={index}
            className={`w-full flex mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {/* Message bubble */}
            <div
              className={`px-4 py-2 text-white break-words whitespace-pre-wrap max-w-[90%] ${
                isUser
                  ? 'bg-[#1E1E1E] rounded-2xl shadow-sm text-right min-w-[100px]'
                  : '' // assistant gets inline text
              }`}
            >
              {/* Markdown renderer */}
              <div className="overflow-x-auto">
                <ReactMarkdown
                  className="prose prose-invert max-w-full text-white leading-relaxed"
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 text-[15px] text-white m-0 font-normal">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 text-[15px] text-white m-0 font-normal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-tight mb-0 text-[15px] font-normal">{children}</li>
                    ),

                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )
    })}
  </div>
)
}

export default ChatWindow