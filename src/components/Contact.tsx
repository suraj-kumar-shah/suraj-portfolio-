import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Mail, Phone, MapPin, Send, Github, Linkedin, Award,
  Code, MessageCircle, Sparkles, Clock, CheckCircle, Flame, Zap, Cloud, Server
} from 'lucide-react'

/* ════════════════════════════════════════════════════════════
   EFFECT 1: GREEN MOLTEN LAVA FLOW CANVAS
════════════════════════════════════════════════════════════ */
const MoltenLavaCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drawLava = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Multiple flowing lava rivers (green)
      for (let i = 0; i < 8; i++) {
        ctx.beginPath()
        const yBase = canvas.height * (0.1 + i * 0.12)
        for (let x = 0; x <= canvas.width; x += 15) {
          const y = yBase + Math.sin((x / canvas.width) * Math.PI * 4 + time * 1.2 + i) * 25
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(0, yBase - 20, 0, yBase + 20)
        gradient.addColorStop(0, `rgba(34, 197, 94, 0.08)`)
        gradient.addColorStop(0.5, `rgba(74, 222, 128, 0.15)`)
        gradient.addColorStop(1, `rgba(22, 163, 74, 0.05)`)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 3 + Math.sin(time * 0.8 + i) * 1.5
        ctx.stroke()
      }

      // Lava pools (glowing green spots)
      for (let i = 0; i < 12; i++) {
        const x = canvas.width * (0.1 + (i * 0.08) + Math.sin(time * 0.5 + i) * 0.05)
        const y = canvas.height * (0.2 + Math.sin(time * 0.7 + i) * 0.15)
        const radius = 40 + Math.sin(time * 1.2 + i) * 15
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(34, 197, 94, 0.12)`)
        gradient.addColorStop(0.7, `rgba(74, 222, 128, 0.06)`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      time += 0.018
      animationId = requestAnimationFrame(drawLava)
    }

    drawLava()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.7 }} />
}

/* ════════════════════════════════════════════════════════════
   EFFECT 2: FLOATING GREEN EMBER PARTICLES
════════════════════════════════════════════════════════════ */
const EmberParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const embers = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 10,
    }))
    setParticles(embers)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, #22c55e, #15803d)`,
            boxShadow: `0 0 ${ember.size * 2}px #22c55e`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 150],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.8, 0.6, 0],
            scale: [1, 1.2, 0.8, 0],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   EFFECT 3: 3D HOLOGRAPHIC CARD TILT (Green Glow)
════════════════════════════════════════════════════════════ */
const HolographicCard: React.FC<{
  children: React.ReactNode
  className?: string
  glowColor?: string
}> = ({ children, className = '', glowColor = '#22c55e' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 22 })
  
  const [hover, setHover] = useState(false)
  const [mouseX, setMouseX] = useState(50)
  const [mouseY, setMouseY] = useState(50)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const rx = (e.clientX - rect.left) / rect.width - 0.5
    const ry = (e.clientY - rect.top) / rect.height - 0.5
    x.set(rx)
    y.set(ry)
    setMouseX(((e.clientX - rect.left) / rect.width) * 100)
    setMouseY(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
        setHover(false)
      }}
      className={`relative ${className}`}
    >
      {/* Holographic glow overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hover ? 0.8 : 0,
          background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, ${glowColor}20, transparent 70%)`,
        }}
      />
      {/* Border shine */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          border: hover ? `1px solid ${glowColor}60` : '1px solid transparent',
          transition: 'border 0.3s',
        }}
      />
      {children}
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════════
   CONTACT ROW COMPONENT (Green Theme)
════════════════════════════════════════════════════════════ */
const ContactRow: React.FC<{
  icon: any
  label: string
  value: string
  href?: string
  accent: string
  delay: number
  inView: boolean
  badge?: React.ReactNode
}> = ({ icon: Icon, label, value, href, accent, delay, inView, badge }) => {
  const [hover, setHover] = useState(false)

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -30, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ x: 8 }}
      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300"
      style={{
        background: hover ? `linear-gradient(135deg, ${accent}10, transparent)` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hover ? accent + '40' : 'rgba(34,197,94,0.12)'}`,
        boxShadow: hover ? `0 0 20px ${accent}20` : 'none',
      }}
    >
      <div className="relative">
        <motion.div
          animate={hover ? { scale: 1.1, rotate: [0, -5, 5, 0] } : { scale: 1 }}
          className="p-2.5 rounded-lg"
          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </motion.div>
        {hover && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{ border: `1px solid ${accent}` }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#5a8a5a' }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: hover ? accent : '#8aae8a' }}>{value}</p>
        {badge}
      </div>
      {hover && <Zap size={14} style={{ color: accent }} />}
    </motion.div>
  )

  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      {content}
    </a>
  ) : (
    content
  )
}

/* ════════════════════════════════════════════════════════════
   SOCIAL BUTTON (Green Theme)
════════════════════════════════════════════════════════════ */
const SocialButton: React.FC<{
  href: string
  icon: any
  label: string
  color: string
  delay: number
  inView: boolean
}> = ({ href, icon: Icon, label, color, delay, inView }) => {
  const [hover, setHover] = useState(false)

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0, rotate: -45 }}
      animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ duration: 0.4, delay, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.15, y: -3 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative p-3 rounded-xl flex items-center justify-center transition-all"
      style={{
        background: hover ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hover ? color + '50' : 'rgba(34,197,94,0.15)'}`,
        boxShadow: hover ? `0 0 20px ${color}30` : 'none',
      }}
    >
      <Icon size={18} style={{ color: hover ? color : '#8aae8a' }} />
      {hover && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: -25 }}
          className="absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
          style={{ background: '#052e16', border: `1px solid ${color}40`, color }}
        >
          {label}
        </motion.div>
      )}
    </motion.a>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN CONTACT COMPONENT (Green & Black Theme)
════════════════════════════════════════════════════════════ */
const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const whatsappNumber = '919508465909'
  const whatsappLink = `https://wa.me/${whatsappNumber}`

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
    <section
      id="contact"
      className="py-28 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #052e16 0%, #051a0a 50%, #020c04 100%)',
      }}
    >
      {/* EFFECT 1: Green Molten Lava Canvas */}
      <MoltenLavaCanvas />

      {/* EFFECT 2: Floating Green Ember Particles */}
      <EmberParticles />

      {/* Additional ambient green glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%)', filter: 'blur(80px)' }} />
      </div>

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
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(74,222,128,0.05))',
              border: '1px solid rgba(34,197,94,0.3)',
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={14} style={{ color: '#4ade80' }} />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#86efac' }}>Cloud · DevOps · Full Stack</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="text-white block">Get In</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #15803d, #22c55e, #4ade80, #86efac)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.4))',
              }}
            >
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

        {/* Main Grid */}
        <div ref={ref} className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Column - Contact Info with 3D Effect */}
          <HolographicCard glowColor="#22c55e">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <MessageCircle size={20} style={{ color: '#4ade80' }} />
                </div>
                Contact Information
              </h3>

              <div className="space-y-3">
                {contacts.map((c, i) => (
                  <ContactRow key={c.label} {...c} delay={0.2 + i * 0.08} inView={inView} />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(34,197,94,0.15)' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#5a8a5a' }}>Connect With Me</p>
                <div className="flex gap-3 flex-wrap">
                  {socials.map((s, i) => (
                    <SocialButton key={s.label} {...s} delay={0.5 + i * 0.07} inView={inView} />
                  ))}
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* Right Column - Contact Form with 3D Effect */}
          <HolographicCard glowColor="#4ade80">
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(5,30,10,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif", color: '#86efac' }}>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <Send size={20} style={{ color: '#86efac' }} />
                </div>
                Send a Message
              </h3>

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
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #15803d, #22c55e)',
                      boxShadow: '0 0 15px rgba(34,197,94,0.3)',
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <motion.button
                    type="submit"
                    disabled={sending || sent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                    style={{
                      background: sent
                        ? 'linear-gradient(135deg, #15803d, #22c55e)'
                        : 'linear-gradient(135deg, #15803d, #22c55e)',
                      boxShadow: sent ? '0 0 15px rgba(34,197,94,0.3)' : '0 0 15px rgba(34,197,94,0.3)',
                    }}
                  >
                    {sent ? (
                      <>
                        <CheckCircle size={18} /> Sent!
                      </>
                    ) : sending ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }}>
                          <Flame size={18} />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
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
                I'll get back to you within 24 hours. For urgent inquiries, use WhatsApp.
              </motion.p>
            </div>
          </HolographicCard>
        </div>
      </div>
    </section>
  )
}

export default Contact