import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Mail, Phone, MapPin, Send, Github, Linkedin, Award,
  Code, MessageCircle, Sparkles, Clock, CheckCircle, Flame, Zap
} from 'lucide-react'

// Keep all your existing component code here...
// Make sure you have all your functions (MoltenLavaCanvas, EmberParticles, HolographicCard, etc.)

const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const whatsappNumber = '919508465909'
  const whatsappLink = `https://wa.me/${whatsappNumber}`

  // Add your contacts and socials arrays here
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    }, 1500)
  }

  return (
    <section id="contact" className="py-28 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 30% 20%, #052e16 0%, #051a0a 50%, #020c04 100%)' }}>
      <div className="container mx-auto px-6 relative z-10">
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
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#86efac' }}>Cloud · DevOps · Full Stack</span>
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
          {/* Left Column */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <MessageCircle size={20} style={{ color: '#4ade80' }} />
              </div>
              Contact Information
            </h3>

            <div className="space-y-3">
              {contacts.map((c, i) => (
                <div key={c.label} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <c.icon size={18} style={{ color: c.accent }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="text-sm hover:text-green-400">{c.value}</a>
                    ) : (
                      <p className="text-sm">{c.value}</p>
                    )}
                    {c.badge}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(34,197,94,0.15)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#5a8a5a' }}>Connect With Me</p>
              <div className="flex gap-3 flex-wrap">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-green-500/20 transition">
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
              <div className="p-2 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <Send size={20} style={{ color: '#86efac' }} />
              </div>
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  className="px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600" />
                <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  className="px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600" />
              </div>

              <textarea rows={4} placeholder="Your Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-green-900/30 focus:border-green-500 focus:outline-none transition-all text-gray-200 placeholder:text-gray-600 resize-none" />

              <div className="flex gap-3 pt-2">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>

                <button type="submit" disabled={sending || sent}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                  style={{ background: sent ? 'linear-gradient(135deg, #15803d, #22c55e)' : 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}>
                  {sent ? (
                    <><CheckCircle size={18} /> Sent!</>
                  ) : sending ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }}><Flame size={18} /></motion.div> Sending...</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-xs mt-5" style={{ color: '#5a8a5a' }}>
              I'll get back to you within 24 hours. For urgent inquiries, use WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact