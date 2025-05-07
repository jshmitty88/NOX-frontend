function ChatWindow({ messages }) {
  return (
    <div className="flex flex-col space-y-2">
      {messages.map((msg, index) => (
        <div key={index} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
          <p className={`whitespace-pre-wrap ${msg.role === 'user' ? 'bg-userBubble text-white p-2 rounded' : 'p-2 text-white'}`}>
            {msg.content}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ChatWindow