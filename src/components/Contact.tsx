import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Mail, Phone, MapPin, Send, Github, Linkedin, Award,
  Code, MessageCircle, Sparkles, Clock, CheckCircle, Flame, Zap, X
} from 'lucide-react'

// EmailJS configuration - For demo, using localStorage fallback
// To enable real email sending, sign up at https://www.emailjs.com/
const USE_EMAILJS = false // Set to true after configuring EmailJS

const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const whatsappNumber = '919508465909'
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    // Validate form
    if (!form.name.trim()) {
      setError('Please enter your name')
      setSending(false)
      return
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError('Please enter a valid email address')
      setSending(false)
      return
    }
    if (!form.message.trim()) {
      setError('Please enter your message')
      setSending(false)
      return
    }

    try {
      // Store in localStorage (works without EmailJS)
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
      messages.push({
        ...form,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('contact_messages', JSON.stringify(messages))

      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSent(true)
      setShowSuccessPopup(true)
      setForm({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        setSent(false)
        setTimeout(() => setShowSuccessPopup(false), 3000)
      }, 2000)
    } catch (err) {
      setError('Failed to send message. Please try again or contact via WhatsApp.')
      console.error('Message sending failed:', err)
    } finally {
      setSending(false)
    }
  }

  const contacts = [
    { icon: Mail, label: 'Email', value: 'surajshah72600@gmail.com', href: 'mailto:surajshah72600@gmail.com', accent: '#4ade80' },
    { icon: Phone, label: 'Phone', value: '+91 9508465909', href: 'tel:+919508465909', accent: '#22c55e' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+91 9508465909', href: whatsappLink, accent: '#86efac', badge: <span className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: '#86efac' }}><CheckCircle size={8} /> Available</span> },
    { icon: MapPin, label: 'Location', value: 'LPU, Jalandhar, Punjab', accent: '#bef264' },
    { icon: Clock, label: 'Response Time', value: 'Within 24 hours', accent: '#22c55e' },
  ]

  const socials = [
    { href: 'https://github.com/suraj-kumar-shah?tab=repositories', icon: Github, label: 'GitHub', color: '#4ade80' },
    { href: 'https://www.linkedin.com/in/surajkumarsah77/', icon: Linkedin, label: 'LinkedIn', color: '#22c55e' },
    { href: 'https://leetcode.com/u/suraj-kumar-sah/', icon: Code, label: 'LeetCode', color: '#86efac' },
    { href: 'https://www.hackerrank.com/profile/surajshah72600', icon: Award, label: 'HackerRank', color: '#bef264' },
    { href: whatsappLink, icon: MessageCircle, label: 'WhatsApp', color: '#4ade80' },
  ]

  // 3D Tilt Effect Component
  const TiltCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 22 })
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 22 })
    
    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = cardRef.current!.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      x.set(nx)
      y.set(ny)
    }
    
    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }
    
    return (
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <section id="contact" className="py-28 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 30% 20%, #052e16 0%, #051a0a 50%, #020c04 100%)' }}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-green-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-20 right-6 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 shadow-2xl shadow-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-white" />
                <div>
                  <p className="text-white font-bold">Message Sent!</p>
                  <p className="text-white/80 text-sm">I'll get back to you soon</p>
                </div>
                <button onClick={() => setShowSuccessPopup(false)} className="text-white/70 hover:text-white">
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(74,222,128,0.05))', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={14} style={{ color: '#4ade80' }} />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#86efac' }}>Let's Connect</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="text-white block">Get In</span>
            <span className="block" style={{ background: 'linear-gradient(135deg, #15803d, #22c55e, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.4))' }}>
              Touch
            </span>
          </h1>

          <p className="text-lg max-w-xl mx-auto mt-4" style={{ color: '#8aae8a' }}>
            Have a project in mind? Let's collaborate and build something extraordinary together.
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 120 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-0.5 mx-auto mt-6 rounded-full"
            style={{ background: 'linear-gradient(90deg, #15803d, #4ade80)' }}
          />
        </motion.div>

        <div ref={ref} className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Contact Info */}
          <TiltCard>
            <div className="p-6 rounded-2xl h-full" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <MessageCircle size={20} style={{ color: '#4ade80' }} />
                </div>
                Contact Information
              </h3>

              <div className="space-y-3">
                {contacts.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-all">
                      <c.icon size={18} style={{ color: c.accent }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm hover:text-green-400 transition-colors">{c.value}</a>
                      ) : (
                        <p className="text-sm">{c.value}</p>
                      )}
                      {c.badge}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(34,197,94,0.15)' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#5a8a5a' }}>Connect With Me</p>
                <div className="flex gap-3 flex-wrap">
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="p-3 rounded-xl bg-white/5 hover:bg-green-500/20 transition-all duration-300 group"
                    >
                      <s.icon size={18} className="group-hover:scale-110 transition-transform" style={{ color: s.color }} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-green-400 font-semibold">Available for opportunities</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Usually responds within 24 hours</p>
              </motion.div>
            </div>
          </TiltCard>

          {/* Right Column - Contact Form */}
          <TiltCard>
            <div className="p-6 rounded-2xl h-full" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <Send size={20} style={{ color: '#86efac' }} />
                </div>
                Send a Message
              </h3>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600"
                  />
                  <motion.input
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.35 }}
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600"
                  />
                </div>

                <motion.textarea
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  rows={4}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600 resize-none"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.45 }}
                  className="flex gap-3 pt-2"
                >
                  <motion.a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                    style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}
                  >
                    <MessageCircle size={18} />
                    <span>Chat on WhatsApp</span>
                  </motion.a>

                  <motion.button
                    type="submit"
                    disabled={sending || sent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: sent ? 'linear-gradient(135deg, #15803d, #22c55e)' : 'linear-gradient(135deg, #15803d, #22c55e)',
                      boxShadow: '0 0 15px rgba(34,197,94,0.3)',
                    }}
                  >
                    {sent ? (
                      <><CheckCircle size={18} /> Sent!</>
                    ) : sending ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }}><Flame size={18} /></motion.div> Sending...</>
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </motion.button>
                </motion.div>
              </form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="text-center text-xs mt-5"
                style={{ color: '#5a8a5a' }}
              >
                <Mail size={12} className="inline mr-1" /> I'll get back to you within 24 hours. For urgent inquiries, use WhatsApp.
              </motion.p>
            </div>
          </TiltCard>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

export default Contact