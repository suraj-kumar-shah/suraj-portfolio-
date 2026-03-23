import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [message, setMessage] = useState('')

  // Your WhatsApp number (without + or spaces, with country code)
  const phoneNumber = "919508465909" // Replace with your actual WhatsApp number
  const whatsappLink = `https://wa.me/${phoneNumber}`

  // Predefined quick messages
  const quickMessages = [
    "Hi! I'm interested in your portfolio",
    "I'd like to discuss a project opportunity",
    "Can we connect for a job opportunity?",
    "I have a question about your skills",
    "Let's collaborate on a project"
  ]

  // Handle scroll to hide/show button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleSendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message)
      window.open(`${whatsappLink}?text=${encodedMessage}`, '_blank')
      setMessage('')
      setIsOpen(false)
    }
  }

  const handleQuickMessage = (msg: string) => {
    const encodedMessage = encodeURIComponent(msg)
    window.open(`${whatsappLink}?text=${encodedMessage}`, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* WhatsApp Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isVisible ? 1 : 0, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group"
        >
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
          
          {/* Main button */}
          <div className="relative bg-gradient-to-r from-green-500 to-green-600 rounded-full p-4 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300">
            {isOpen ? (
              <X size={28} className="text-white" />
            ) : (
              <MessageCircle size={28} className="text-white" />
            )}
          </div>
          
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
        </motion.button>

        {/* Chat Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-0 w-80 md:w-96 bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Chat with Suraj</h3>
                      <p className="text-xs text-green-100">Typically replies within minutes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minimize2 size={16} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-sm text-gray-300 mb-4">
                  👋 Hi! I'm Suraj. Feel free to reach out to me on WhatsApp. I'd love to connect with you!
                </p>

                {/* Quick Messages */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickMessages.map((msg, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickMessage(msg)}
                        className="text-xs px-3 py-1.5 bg-slate-700/50 hover:bg-green-500/20 rounded-full text-gray-300 hover:text-green-400 transition-all border border-slate-600 hover:border-green-500"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="px-3 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <Send size={18} className="text-white" />
                  </button>
                </div>

                {/* Direct Link */}
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    <MessageCircle size={14} />
                    <span>Open WhatsApp directly</span>
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-900/50 p-3 text-center">
                <p className="text-xs text-gray-500">Powered by WhatsApp | Response within 24h</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

export default WhatsAppButton