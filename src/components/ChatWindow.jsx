function ChatWindow({ messages }) {
  return (
    <div className="flex flex-col space-y-2">
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
                  ? 'bg-userBubble rounded-2xl max-w-[75%] shadow-sm'
                  : 'text-left'
              }`}
            >
              {msg.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatWindow