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
                  className="chat-markdown max-w-full text-white text-base font-normal leading-relaxed"
                   className="max-w-full text-white text-base font-normal leading-relaxed"
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 space-y-1 text-white text-base leading-snug">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 space-y-1 text-white text-base leading-snug">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="ml-1">{children}</li>
                      ),
                      
                      h1: ({ children }) => (
                        <h1 style={{ margin: 0, padding: 0, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.2 }}>{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 style={{ margin: 0, padding: 0, fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.25 }}>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{ margin: 0, padding: 0, fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3 }}>{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p style={{ margin: 0, padding: 0, lineHeight: 1.5 }}>{children}</p>
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