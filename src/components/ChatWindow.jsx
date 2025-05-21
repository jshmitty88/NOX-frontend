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
                      <ul style={{ margin: 0, padding: 0 }} className="list-disc pl-5 text-base font-normal">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ margin: 0, padding: 0 }} className="list-decimal pl-5 text-base font-normal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li style={{ margin: 0, padding: 0, lineHeight: '1.5' }} className="mb-0">
                        {children}
                      </li>
                    ),
                    h2: ({ children }) => (
                      <h2 style={{ margin: 0, padding: 0, fontWeight: 700 }}>{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 style={{ margin: 0, padding: 0, fontWeight: 700 }}>{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p style={{ margin: 0, padding: 0, lineHeight: '1.5' }}>{children}</p>
                    )
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