// App.jsx
// Main entry point for NOX frontend (image/file upload logic removed and fully functional)

import { useState, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import MessageInput from './components/MessageInput'
import './styles/index.css'
import 'highlight.js/styles/github-dark.css'

// Initialize user_id for session persistence (prompt if not already set)
const storedUserId = localStorage.getItem('user_id') || prompt("Enter your user ID:")
localStorage.setItem('user_id', storedUserId)


function sanitizeMessageContent(content) {
  // Remove base64 images or very large messages
  if (!content) return '';
  if (
    content.includes('data:image') ||   // catches base64 images
    content.length > 2000               // catches huge messages
  ) {
    return '[File upload or large content removed for safety]';
  }
  return content;
}

function App() {
  const userId = localStorage.getItem('user_id')

  // Logs backend routing for debugging
  const logRoute = (label, details) => {
    console.log(`📡 ROUTING: ${label}`, details)
  }

  // State for chat messages (loads from localStorage if present)
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem('messages')
    return stored
      ? JSON.parse(stored)
      : [{ role: 'assistant', content: 'Welcome to NOX, Netrevenue Operations eXpert! How can I help?' }]
  })

  // Persist messages to localStorage on every change
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  // GPT-powered dynamic tag classifier for memory/recall logic
  const classifyTags = async (message) => {
    try {
      const res = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      
      return data?.tags || {
        tag_platform: "unknown",
        tag_department: "general",
        tag_importance: "medium"
      }
    } catch (err) {
      console.error("❌ I Failed to classify tags:", err)
      return {
        tag_platform: "unknown",
        tag_department: "general",
        tag_importance: "medium"
      }
    }
  }

  console.log("Deploying updated build...")

  // Sends a user message to backend and updates UI/messages state
  const sendMessage = async (text) => {
    
    console.log("👤 Loaded user_id:", userId)
    console.log("✉️ Message received:", text)

    const userMessage = { role: 'user', content: text }
    const shouldRemember = /\bremember\b/i.test(text) // only triggers for “remember”  
    const isOfferUpdate = /^update\s+\w+/i.test(text)
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    const recentHistory = updatedMessages
    .slice(-15)
    .map(m => `${m.role}: ${sanitizeMessageContent(m.content)}`)
    .join('\n')

    // --- Routing for special commands ---
    const trimmedText = text.trim()
    const command = trimmedText.split(" ")[0].toLowerCase()
    const cleanedText = trimmedText.toLowerCase()

    // Search offer info route
    if (command === "/search") {
      const searchQuery = trimmedText.slice(7).trim()
      setMessages((prev) => [...prev, {
        role: 'system',
        content: `🔍 Routing to /search_offer_info for: _${searchQuery}_`
      }])
      logRoute("/search_offer_info", { trigger: "/search", query: searchQuery })
    
      try {
        const res = await fetch('https://web-production-1f17.up.railway.app/search_offer_info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        })
        
        const result = await res.json()
        console.log("✅ /search_offer_info result:", result)
        
        if (result.error?.includes("not found")) {
          setMessages((prev) => [...prev, {
            role: 'system',
            content: `⚠️ No matching client found. Make sure this client is in your client list before updating offer info.`
          }])
          return
        }
        
        // Handle successful search result
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: result.summary || 'Search completed successfully.'
        }])
        
      } catch (err) {
        console.error("❌ Failed to search offer info:", err)
        setMessages((prev) => [...prev, {
          role: 'system',
          content: 'Error searching offer info. Check logs.'
        }])
      }
      return
    }
    
    // Route "remember this..." directly to /remember
      if (text.toLowerCase().startsWith("remember this")) {
        try {
          const tagRes = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          });
          const tagData = await tagRes.json();
          const tags = tagData.tags || {};
      
          await fetch('https://web-production-1f17.up.railway.app/remember', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              topic: "user-input",
              memory_type: "user_message",
              content: text,
              tag_platform: tags.tag_platform || "unknown",
              tag_department: tags.tag_department || "general",
              tag_importance: tags.tag_importance || "medium",
              source_chat_id: "nox-ui"
            })
          });
      
          setMessages((prev) => [...prev, {
            role: 'system',
            content: 'memory updated (automatically)'
          }]);
      
          return; // prevent fallback to /chat or /creative_intent
        } catch (err) {
          console.error("❌ Failed to remember message:", err);
          setMessages((prev) => [...prev, {
            role: 'system',
            content: '❌ Failed to store memory.'
          }]);
          return;
        }
      }
    
    // -- Routes to /offer_info_update if user says "update [client name]: "
    if (isOfferUpdate) {
      try {
        const res = await fetch('https://web-production-1f17.up.railway.app/update_offer_info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            message: text
          })
        });
    
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: 'system',
          content: data.message || "✅ Offer info updated successfully."
        }]);
      } catch (err) {
        console.error("❌ Failed to update offer info:", err);
        setMessages(prev => [...prev, {
          role: 'system',
          content: '❌ Failed to update offer info.'
        }]);
      }
    
      return; // prevent fallback to /chat
  }

 
    // --- Route to /creative_intent if user is asking for marketing/sales copy ---
    if (
      /revise|rewrite|resend|remove|edit|write|landing page|email|vsl|ad copy/i.test(text)
    ) {
      try {
        const response = await fetch('https://web-production-1f17.up.railway.app/creative_intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            user_id: userId,
            history: recentHistory
          })
        });
    
        const data = await response.json();
        const messageText = typeof data.message === 'string' && data.message.trim()
          ? data.message
          : "⚠️ No creative generated (check logs).";
    
        const assistantReply = {
          role: 'assistant',
          content: messageText
        };
    
        setMessages((prev) => {
          const updated = [...prev, assistantReply];
          localStorage.setItem('messages', JSON.stringify(updated));
          return updated;
        });
        
        // Add confirmation prompt
        setMessages((prev) => [...prev, {
          role: 'system',
          content: 'Would you like to save this to offer info or generate a Google Doc?',
          actions: ['Save to Offer Info', 'Generate Google Doc', 'No Thanks']
        }]);
        // Log to chat-history table
        try {
          await fetch('https://web-production-1f17.up.railway.app/chat-history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              messages: [
                { role: 'user', content: text },
                { role: 'assistant', content: messageText }
              ]
            })
          });
        } catch (err) {
          console.error("❌ Failed to log /creative_intent to chat-history:", err);
        }
        
        // Optional: tag + remember the creative update
        try {
          const tagRes = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
          });
          const tagData = await tagRes.json();
          const tags = tagData.tags || {};
        
          await fetch('https://web-production-1f17.up.railway.app/remember', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              topic: "creative_intent",
              memory_type: "creative",
              content: text,
              tag_platform: tags.tag_platform || "unknown",
              tag_department: tags.tag_department || "general",
              tag_importance: tags.tag_importance || "high",
              source_chat_id: "nox-ui"
            })
          });
        } catch (err) {
          console.error("❌ Failed to tag or remember creative message:", err);
        }
        return;
      } catch (err) {
        console.error("❌ Failed to call /creative_intent:", err);
        setMessages((prev) => [...prev, {
          role: 'system',
          content: 'Error generating creative. Check logs for details.'
        }]);
        return;
      }
    }

    //handle URL and video summary 
    const url = text.trim();
    const isYouTubeOrVimeo = /https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
    const isGenericUrl = /https?:\/\/[^\s]+/i.test(url);
    
    if (isYouTubeOrVimeo || isGenericUrl) {
      try {
        const response = await fetch('https://web-production-1f17.up.railway.app/summarize_url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
    
        const result = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.summary || '✅ URL processed, but no summary was returned.'
        }]);
      } catch (err) {
        console.error("❌ Error summarizing URL:", err);
        setMessages(prev => [...prev, {
          role: 'system',
          content: "❌ Failed to summarize the URL. Please try again later."
        }]);
      }
      return;
    }
  
    if (isUrl) {
      try {
        const response = await fetch('https://web-production-1f17.up.railway.app/summarize_url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: text.trim() })
        });
    
        const result = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: result.summary || '✅ URL processed, but no summary was returned.'
        }]);
      } catch (err) {
        console.error("❌ Error summarizing URL:", err);
        setMessages(prev => [...prev, {
          role: 'system',
          content: "❌ Failed to summarize the URL. Please try again later."
        }]);
      }
      return;
  }

    // --- Fallback to /chat route (standard chat logic) ---
    try {
      const response = await fetch('https://web-production-1f17.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          user_id: userId,
          history: recentHistory
        })
      });
      
      const raw = await response.text();
      console.log("RAW RESPONSE:", raw);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${raw}`);
      }
      
      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse backend response as JSON:", e, raw);
        throw new Error("Invalid JSON from backend");
      }
      console.log("🧠 Raw data from /chat response:", data);
      
      const messageText = typeof data.message === 'string' && data.message.trim()
        ? data.message
        : "⚠️ No reply received from backend (check logs).";
        
        if (!messageText || messageText.startsWith("⚠️")) {
          setMessages((prev) => [...prev, {
            role: 'system',
            content: "NOX is live, but couldn't find any memory to answer your message. Try rephrasing or asking something more specific."
          }]);
          return;
        }
      
      const assistantReply = {
        role: 'assistant',
        content: messageText
      };
      
console.log("🧠 Assistant reply:", assistantReply.content);
    
      logRoute("/chat-history", {
        user_id: userId,
        chat_id: "nox-ui",
        user_message: text,
        assistant_reply: messageText
      });
    
      try {
        await fetch('https://web-production-1f17.up.railway.app/chat-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            messages: [
              { role: 'user', content: text },
              { role: 'assistant', content: messageText }
            ]
          })
        });
      } catch (err) {
        console.error("❌ Failed to save chat history:", err);
        // Don't block the user experience, just log the error
      }
    
      setMessages((prev) => {
        const updated = [...prev, assistantReply];
        localStorage.setItem('messages', JSON.stringify(updated));
        return updated;
      });
    
      // Optional: trigger memory logic if relevant
      if (shouldRemember) {
        const tagRes = await fetch('https://web-production-1f17.up.railway.app/classify_tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.content })
        });
        const tagData = await tagRes.json();
        const tags = tagData.tags || {};
    
        await fetch('https://web-production-1f17.up.railway.app/remember', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            topic: "user-input",
            memory_type: "user_message",
            content: userMessage.content,
            tag_platform: tags.tag_platform || "unknown",
            tag_department: tags.tag_department || "general",
            tag_importance: tags.tag_importance || "medium",
            source_chat_id: "nox-ui"
          })
        });
    
        setMessages((prev) => [...prev, { role: 'system', content: 'memory updated (automatically)' }]);
      }
    
    } catch (err) {
      console.error("❌ Error in sendMessage:", err);
      setMessages((prev) => [...prev, {
        role: 'system',
        content: 'Error reaching backend. Check logs for details.'
      }]);
    }
    return
  }

  // Handler for manual "Reflect" button
  const handleReflect = async () => {
    try {
      const userId = localStorage.getItem('user_id')
      // Get last reflection timestamp
      const latestRes = await fetch(`https://web-production-1f17.up.railway.app/reflect/latest?user_id=${userId}`)
      const latestData = await latestRes.json()
      const lastReflectedAt = latestData.timestamp ? new Date(latestData.timestamp) : null

      // Filter messages after that time (if available)
      const recentMessages = lastReflectedAt
        ? messages.filter(m => m.createdAt && new Date(m.createdAt) > lastReflectedAt)
        : messages

      const chatText = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n')

      // Send to /reflect
      const response = await fetch('https://web-production-1f17.up.railway.app/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          topic: 'reflection',
          content: chatText,
          source_chat_id: "nox-ui"
        })
      })

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: `Reflection complete — ${data.entries_stored || 0} entries saved.` }
      ])
    } catch (err) {
      console.error('Reflect failed:', err)
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: 'Reflection failed. Check logs or try again.' }
      ])
    }
  }

  // --- UI Layout and Rendering ---
  return (
    <div className="flex flex-col h-screen bg-background text-white">
      <div className="flex-1 overflow-auto px-4 pt-6 flex flex-col items-center">
        <header className="sticky top-0 z-10 bg-black border-b border-[#00E3FF] px-4">
          <div className="flex items-center gap-3 py-3">
            <img src="/logo-symbol.jpg" alt="NOX icon" className="h-10 w-10" />
            <h1 className="text-[#00E3FF] text-xl font-extrabold tracking-widest">
              NOX
            </h1>
          </div>
        </header>
        <ChatWindow messages={messages} />
      </div>
      <div className="px-4 mb-4 space-y-3">
        <button
          onClick={handleReflect}
          className="bg-[#1E1E1E] border border-[#00E3FF] text-white px-4 py-2 rounded-[12px] text-sm font-semibold hover:bg-[#2a2a2a]"
        >
          Reflect
        </button>
        {/* No image upload button below */}
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  )
}

export default App