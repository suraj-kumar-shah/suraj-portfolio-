import React, { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useScroll, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Code2, Cloud, Database, Wrench, Server, Terminal, Globe, Box,
  Shield, GitBranch, Layers, Cpu, Zap, Sparkles,
  Star, Coffee,
  TrendingUp, Award, Rocket, Brain, Flame
} from 'lucide-react'

/* ══════════════════════════════════════════════════
   MOLTEN GREEN HEX CANVAS BACKGROUND
══════════════════════════════════════════════════ */
const GreenHexCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    let t = 0, id: number
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
    resize(); window.addEventListener('resize', resize)

    const hexPath = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6
        i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
      }
      ctx.closePath()
    }

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      const R = 42, rows = Math.ceil(c.height / (R * 1.73)) + 2
      const cols = Math.ceil(c.width / (R * 2)) + 2

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * R * 2 + (row % 2) * R + R
          const cy = row * R * 1.73
          const wave = Math.sin(t * 0.6 + col * 0.4 + row * 0.3) * 0.5 + 0.5
          const pulse = Math.abs(Math.sin(t * 0.4 + col * 0.2 - row * 0.15))
          const alpha = wave * 0.045 + 0.008

          hexPath(cx, cy, R - 2)
          ctx.strokeStyle = `rgba(74, 222, 128, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()

          if (pulse > 0.92) {
            hexPath(cx, cy, R - 2)
            ctx.fillStyle = `rgba(34, 197, 94, ${(pulse - 0.92) * 0.8})`
            ctx.fill()
          }
        }
      }

      for (let s = 0; s < 5; s++) {
        const sx = (c.width * 0.15 * s + t * 28 * (s % 2 === 0 ? 1 : -1)) % (c.width + 200) - 100
        const gr = ctx.createLinearGradient(sx - 80, 0, sx + 80, c.height)
        gr.addColorStop(0, 'rgba(34, 197, 94, 0)')
        gr.addColorStop(0.5, `rgba(34, 197, 94, 0.05)`)
        gr.addColorStop(1, 'rgba(74, 222, 128, 0)')
        ctx.fillStyle = gr
        ctx.fillRect(sx - 80, 0, 160, c.height)
      }

      t += 0.012
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.9 }} />
}

/* ══════════════════════════════════════════════════
   3D CARD WRAPPER
══════════════════════════════════════════════════ */
const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  glowColor?: string
  intensity?: number
}> = ({ children, className, style, glowColor = 'rgba(34, 197, 94, 0.25)', intensity = 12 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [intensity, -intensity]), { stiffness: 200, damping: 22 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-intensity, intensity]), { stiffness: 200, damping: 22 })
  const glowX = useTransform(mx, [-1, 1], ['0%', '100%'])
  const glowY = useTransform(my, [-1, 1], ['0%', '100%'])
  const [hov, setHov] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }
  const onLeave = () => { mx.set(0); my.set(0); setHov(false) }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 900, ...style }}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={onLeave}
      className={className}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
        style={{
          background: hov
            ? `radial-gradient(ellipse at ${glowX} ${glowY}, ${glowColor} 0%, transparent 55%)`
            : 'transparent',
          transition: 'background 0.05s',
        }}
      />
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   SKILL BADGE - Modern pill design
══════════════════════════════════════════════════ */
const SkillBadge: React.FC<{ skill: any; index: number; inView: boolean }> = ({ skill, index, inView }) => {
  const [hov, setHov] = useState(false)
  
  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'Expert': return '🏆'
      case 'Advanced': return '⚡'
      case 'Intermediate': return '📚'
      default: return '🌱'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.05, y: -3 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="group cursor-pointer"
    >
      <div
        className="relative p-4 rounded-xl border transition-all duration-300"
        style={{
          background: hov ? `linear-gradient(135deg, ${skill.glow}20, ${skill.glow}10)` : 'rgba(10,40,10,0.6)',
          borderColor: hov ? skill.glow : 'rgba(34,197,94,0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: hov ? `0 0 20px ${skill.glow}30` : 'none',
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
            <skill.icon size={20} style={{ color: skill.glow }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-200">{skill.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs">{getLevelIcon(skill.level)}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: `${skill.glow}20`,
                color: skill.glow,
                border: `1px solid ${skill.glow}40`
              }}>
                {skill.level}
              </span>
            </div>
          </div>
        </div>
        
        {/* Visual indicator bars instead of percentages */}
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: '25%',
                background: i <= (skill.level === 'Expert' ? 4 : skill.level === 'Advanced' ? 3 : skill.level === 'Intermediate' ? 2 : 1)
                  ? skill.glow
                  : 'rgba(255,255,255,0.1)',
                boxShadow: i <= (skill.level === 'Expert' ? 4 : skill.level === 'Advanced' ? 3 : skill.level === 'Intermediate' ? 2 : 1)
                  ? `0 0 4px ${skill.glow}`
                  : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TOOL CARD - Modern design
══════════════════════════════════════════════════ */
const ToolCard: React.FC<{ tool: any; index: number; inView: boolean }> = ({ tool, index, inView }) => {
  const [hov, setHov] = useState(false)
  
  const levelColors = {
    'Expert': '#86efac',
    'Advanced': '#4ade80',
    'Intermediate': '#22c55e',
    'Learning': '#15803d',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -3 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="cursor-pointer"
    >
      <div
        className="p-4 rounded-xl border transition-all duration-300"
        style={{
          background: hov ? `linear-gradient(135deg, ${levelColors[tool.level]}15, transparent)` : 'rgba(10,40,10,0.5)',
          borderColor: hov ? levelColors[tool.level] : 'rgba(34,197,94,0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <tool.icon size={18} style={{ color: levelColors[tool.level] }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-200">{tool.name}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{
            background: `${levelColors[tool.level]}20`,
            color: levelColors[tool.level],
          }}>
            {tool.level}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all"
              style={{
                width: '25%',
                background: i <= (tool.level === 'Expert' ? 4 : tool.level === 'Advanced' ? 3 : tool.level === 'Intermediate' ? 2 : 1)
                  ? levelColors[tool.level]
                  : 'rgba(255,255,255,0.1)'
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   STRENGTH CARD
══════════════════════════════════════════════════ */
const StrengthCard: React.FC<{ strength: any; index: number; inView: boolean }> = ({ strength, index, inView }) => {
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="cursor-pointer"
    >
      <div
        className="p-6 rounded-2xl text-center border transition-all duration-300"
        style={{
          background: hov ? `linear-gradient(135deg, ${strength.accent}15, transparent)` : 'rgba(10,40,10,0.6)',
          borderColor: hov ? strength.accent : 'rgba(34,197,94,0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="inline-flex p-3 rounded-xl mb-3" style={{
          background: `${strength.accent}20`,
          border: `1px solid ${strength.accent}40`
        }}>
          <strength.icon size={28} style={{ color: strength.accent }} />
        </div>
        <h4 className="font-bold text-white mb-1">{strength.name}</h4>
        <p className="text-xs text-gray-400">{strength.description}</p>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   ANIMATED STAT COUNTER
══════════════════════════════════════════════════ */
const Counter: React.FC<{ to: string; suffix?: string; color: string; inView: boolean; delay: number }> = ({ to, suffix = '', color, inView, delay }) => {
  const [count, setCount] = useState(0)
  const num = parseFloat(to)
  const isFloat = to.includes('.')

  useEffect(() => {
    if (!inView) return
    let cur = 0
    const frames = 60
    const timer = setInterval(() => {
      cur += num / frames
      if (cur >= num) { setCount(num); clearInterval(timer) }
      else setCount(isFloat ? parseFloat(cur.toFixed(1)) : Math.floor(cur))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, num])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay }}
      style={{ color, fontFamily: "'Syne', sans-serif" }}
      className="text-3xl font-black"
    >
      {count}{suffix}
    </motion.span>
  )
}

/* ══════════════════════════════════════════════════
   MAIN SKILLS COMPONENT
══════════════════════════════════════════════════ */
const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const containerRef = useRef<HTMLDivElement>(null)

  const technicalSkills = [
    { name: 'Python', icon: Code2, level: 'Expert', glow: '#86efac' },
    { name: 'Java', icon: Coffee, level: 'Advanced', glow: '#4ade80' },
    { name: 'C++', icon: Code2, level: 'Advanced', glow: '#22c55e' },
    { name: 'HTML/CSS', icon: Globe, level: 'Expert', glow: '#86efac' },
    { name: 'JavaScript', icon: Code2, level: 'Advanced', glow: '#4ade80' },
    { name: 'AWS', icon: Cloud, level: 'Advanced', glow: '#22c55e' },
    { name: 'MySQL', icon: Database, level: 'Advanced', glow: '#4ade80' },
    { name: 'DBMS', icon: Database, level: 'Expert', glow: '#86efac' },
    { name: 'Data Structures', icon: Server, level: 'Advanced', glow: '#4ade80' },
    { name: 'Operating Systems', icon: Terminal, level: 'Intermediate', glow: '#15803d' },
    { name: 'Computer Networks', icon: Globe, level: 'Advanced', glow: '#22c55e' },
    { name: 'OOP', icon: Box, level: 'Expert', glow: '#86efac' },
  ]

  const tools = [
    { name: 'Git & GitHub', icon: GitBranch, level: 'Expert' },
    { name: 'Docker', icon: Box, level: 'Intermediate' },
    { name: 'Linux', icon: Terminal, level: 'Advanced' },
    { name: 'UTM Virtualization', icon: Cpu, level: 'Advanced' },
    { name: 'Kubernetes', icon: Layers, level: 'Learning' },
    { name: 'Jenkins', icon: Zap, level: 'Intermediate' },
    { name: 'Terraform', icon: Shield, level: 'Learning' },
    { name: 'React', icon: Code2, level: 'Advanced' },
  ]

  const coreStrengths = [
    { name: 'Cloud Architecture', icon: Cloud, description: 'Designing scalable cloud solutions', accent: '#4ade80' },
    { name: 'System Design', icon: Server, description: 'Building robust distributed systems', accent: '#86efac' },
    { name: 'DevOps Practices', icon: GitBranch, description: 'CI/CD, automation, monitoring', accent: '#22c55e' },
    { name: 'Problem Solving', icon: Sparkles, description: 'Algorithmic thinking & optimization', accent: '#bef264' },
  ]

  const stats = [
    { icon: Award, label: 'Expert Skills', value: '4', suffix: '', color: '#86efac' },
    { icon: TrendingUp, label: 'Advanced', value: '8', suffix: '', color: '#4ade80' },
    { icon: Rocket, label: 'Learning', value: '3', suffix: '', color: '#22c55e' },
    { icon: Brain, label: 'Total Skills', value: '20', suffix: '+', color: '#bef264' },
  ]

  const subjects = ['Data Structures', 'Operating Systems', 'Computer Networks', 'OOP', 'DBMS', 'Cloud Architecture', 'DevOps', 'System Design']

  return (
    <section
      id="skills"
      ref={containerRef}
      className="py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 25% 0%, #052e16 0%, #051a0a 35%, #020c04 65%, #000000 100%)',
        minHeight: '100vh',
      }}
    >
      <GreenHexCanvas />

      {/* Ambient orbs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 600, height: 600, top: '-10%', left: '-10%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 65%)', filter: 'blur(60px)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: 500, height: 500, bottom: '5%', right: '-8%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.10), transparent 65%)', filter: 'blur(60px)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.45 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-7"
            style={{
              background: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.28)',
              boxShadow: '0 0 30px rgba(34,197,94,0.2)',
            }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={15} style={{ color: '#4ade80' }} />
            </motion.div>
            <span className="text-sm font-black uppercase tracking-widest" style={{ color: '#4ade80' }}>Technical Arsenal</span>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#22c55e' }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          </motion.div>

          <div style={{ fontFamily: "'Syne', sans-serif" }}>
            <div className="overflow-hidden mb-1">
              <motion.div
                initial={{ y: 80 }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 70 }}
                className="text-6xl md:text-8xl font-black leading-none"
                style={{ color: '#f0fae6', letterSpacing: '-0.03em' }}
              >
                Skills &amp;
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: 80 }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.18, type: 'spring', stiffness: 70 }}
                className="text-6xl md:text-8xl font-black leading-none"
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #22c55e 30%, #4ade80 60%, #86efac 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  letterSpacing: '-0.03em',
                  filter: 'drop-shadow(0 0 40px rgba(34,197,94,0.45))',
                }}
              >
                Expertise
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg mt-5 max-w-xl mx-auto"
            style={{ color: '#5a8a5a' }}
          >
            Technical proficiency &amp; tools powering the work
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-auto mt-6 h-1 max-w-[160px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac, #bef264)',
              boxShadow: '0 0 16px rgba(34,197,94,0.5)',
            }}
          />
        </motion.div>

        <div ref={ref}>
          {/* Core Strengths */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {coreStrengths.map((s, i) => (
              <StrengthCard key={s.name} strength={s} index={i} inView={inView} />
            ))}
          </div>

          {/* Technical Skills Grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 relative overflow-hidden rounded-3xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(10,40,10,0.90) 0%, rgba(5,20,5,0.95) 100%)',
              border: '1px solid rgba(34,197,94,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.5),rgba(74,222,128,0.4),transparent)' }} />

            <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ fontFamily: "'Syne',sans-serif", color: '#e0f2e0' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="p-2 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <Flame size={18} style={{ color: '#4ade80' }} />
              </motion.div>
              Technical Proficiency
              <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.22)', color: '#4ade80' }}>
                hover to inspect
              </span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {technicalSkills.map((skill, i) => (
                <SkillBadge key={skill.name} skill={skill} index={i} inView={inView} />
              ))}
            </div>
          </motion.div>

          {/* Tools & Core Subjects */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="relative overflow-hidden rounded-3xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(10,40,10,0.90) 0%, rgba(5,20,5,0.95) 100%)',
                border: '1px solid rgba(34,197,94,0.15)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.5),transparent)' }} />

              <h3 className="text-xl font-black mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne',sans-serif", color: '#e0f2e0' }}>
                <motion.div
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="p-2 rounded-xl"
                  style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.25)' }}
                >
                  <Wrench size={18} style={{ color: '#86efac' }} />
                </motion.div>
                Tools &amp; Technologies
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map((tool, i) => (
                  <ToolCard key={tool.name} tool={tool} index={i} inView={inView} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="relative overflow-hidden rounded-3xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(10,40,10,0.90) 0%, rgba(5,20,5,0.95) 100%)',
                border: '1px solid rgba(34,197,94,0.15)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(74,222,128,0.5),transparent)' }} />

              <h3 className="text-xl font-black mb-6 flex items-center gap-3" style={{ fontFamily: "'Syne',sans-serif", color: '#e0f2e0' }}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="p-2 rounded-xl"
                  style={{ background: 'rgba(134,239,172,0.14)', border: '1px solid rgba(134,239,172,0.25)' }}
                >
                  <Star size={18} style={{ color: '#86efac' }} />
                </motion.div>
                Core Subjects
              </h3>

              <div className="flex flex-wrap gap-2.5 mb-8">
                {subjects.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.03, type: 'spring' }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold cursor-default"
                    style={{
                      background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.25)',
                      color: '#86efac',
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>

              {/* Skills Progress Bars - Clean visual indicator */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Skill Proficiency</h4>
                {[
                  { name: 'Cloud & DevOps', level: 'Advanced', color: '#4ade80' },
                  { name: 'System Design', level: 'Advanced', color: '#86efac' },
                  { name: 'Algorithms', level: 'Expert', color: '#bef264' },
                  { name: 'Networking', level: 'Intermediate', color: '#22c55e' },
                ].map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">{item.name}</span>
                      <span className="text-xs font-semibold" style={{ color: item.color }}>{item.level}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 rounded-full flex-1 transition-all"
                          style={{
                            background: i <= (item.level === 'Expert' ? 4 : item.level === 'Advanced' ? 3 : item.level === 'Intermediate' ? 2 : 1)
                              ? item.color
                              : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <Card3D key={stat.label} glowColor={`${stat.color}30`} intensity={10}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 24 }}
                  animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: 0.85 + i * 0.1, type: 'spring' }}
                  className="relative text-center overflow-hidden rounded-2xl p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(10,40,10,0.92) 0%, rgba(5,20,5,0.97) 100%)',
                    border: `1px solid ${stat.color}20`,
                    boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 0.5px ${stat.color}10`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${stat.color}12, transparent 65%)` }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3 + i, repeat: Infinity }}
                  />
                  <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
                    background: `linear-gradient(90deg,transparent,${stat.color}60,transparent)` }} />

                  <motion.div
                    className="inline-flex p-3 rounded-2xl mb-3"
                    style={{ background: `${stat.color}14`, border: `1px solid ${stat.color}28` }}
                    animate={{ boxShadow: [`0 0 0px ${stat.color}00`, `0 0 18px ${stat.color}50`, `0 0 0px ${stat.color}00`] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    <stat.icon size={22} style={{ color: stat.color }} />
                  </motion.div>

                  <Counter to={stat.value} suffix={stat.suffix} color={stat.color} inView={inView} delay={0.9 + i * 0.1} />
                  <p className="text-xs mt-1" style={{ color: '#3a6a3a' }}>{stat.label}</p>
                </motion.div>
              </Card3D>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills