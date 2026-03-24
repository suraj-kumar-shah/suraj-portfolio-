import React, { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useScroll, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Code2, Cloud, Database, Wrench, Server, Terminal, Globe, Box,
  Shield, GitBranch, Layers, Cpu, Zap, Sparkles,
  ChevronRight, CheckCircle2, Star, Coffee,
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

      // Flowing data streams (green)
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
   3D CARD WRAPPER — full tilt physics (green glow)
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
   SKILL ORBS — circular radar chart per skill (green)
══════════════════════════════════════════════════ */
const SkillOrb: React.FC<{ skill: any; index: number; inView: boolean }> = ({ skill, index, inView }) => {
  const [hov, setHov] = useState(false)
  const circumference = 2 * Math.PI * 28
  const dash = (skill.progress / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotateY: -90 }}
      animate={inView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.065, type: 'spring', stiffness: 90, damping: 14 }}
      whileHover={{ scale: 1.12, z: 30 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="relative flex flex-col items-center group cursor-default"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80, height: 80,
          background: `radial-gradient(circle, ${skill.glow}30, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{ scale: hov ? [1, 1.3, 1] : 1, opacity: hov ? [0.6, 1, 0.6] : 0.3 }}
        transition={{ duration: 1.5, repeat: hov ? Infinity : 0 }}
      />

      <div className="relative" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <motion.circle
            cx="36" cy="36" r="28"
            fill="none"
            stroke={`url(#orb-grad-${index})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference - dash } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.4, delay: index * 0.065 + 0.3, ease: [0.34, 1.1, 0.64, 1] }}
            style={{ filter: `drop-shadow(0 0 4px ${skill.glow})` }}
          />
          <defs>
            <linearGradient id={`orb-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={skill.glow} stopOpacity="0.5" />
              <stop offset="100%" stopColor={skill.glow} />
            </linearGradient>
          </defs>
        </svg>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={hov ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div
            className="p-2 rounded-full"
            style={{
              background: `${skill.glow}18`,
              border: `1px solid ${skill.glow}35`,
              boxShadow: hov ? `0 0 14px ${skill.glow}60` : 'none',
              transition: 'box-shadow 0.3s',
            }}
          >
            <skill.icon size={18} style={{ color: skill.glow }} />
          </div>
        </motion.div>
      </div>

      <motion.div className="mt-2 text-center" animate={hov ? { y: -2 } : { y: 0 }}>
        <p className="text-xs font-bold leading-tight" style={{ color: hov ? skill.glow : '#8a9a6a' }}>
          {skill.name}
        </p>
        <motion.p
          className="text-[10px] font-black"
          style={{ color: skill.glow }}
          animate={hov ? { textShadow: `0 0 8px ${skill.glow}` } : { textShadow: 'none' }}
        >
          {skill.progress}%
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {hov && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap z-30"
            style={{
              background: 'rgba(10,20,2,0.95)',
              border: `1px solid ${skill.glow}40`,
              color: skill.glow,
              boxShadow: `0 0 12px ${skill.glow}30`,
            }}
          >
            {skill.level}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   TOOL CARD — 3D flip (green theme)
══════════════════════════════════════════════════ */
const ToolCard3D: React.FC<{ tool: any; index: number; inView: boolean }> = ({ tool, index, inView }) => {
  const [flipped, setFlipped] = useState(false)

  const barGradients: Record<string, string> = {
    'Expert':       'linear-gradient(90deg,#15803d,#16a34a,#22c55e)',
    'Advanced':     'linear-gradient(90deg,#16a34a,#22c55e,#4ade80)',
    'Intermediate': 'linear-gradient(90deg,#22c55e,#4ade80,#86efac)',
    'Learning':     'linear-gradient(90deg,#14532d,#15803d,#16a34a)',
  }
  const barGlow: Record<string, string> = {
    'Expert': 'rgba(34,197,94,0.6)', 'Advanced': 'rgba(34,197,94,0.5)',
    'Intermediate': 'rgba(74,222,128,0.5)', 'Learning': 'rgba(21,128,61,0.5)',
  }
  const levelColor: Record<string, string> = {
    'Expert': '#86efac', 'Advanced': '#4ade80', 'Intermediate': '#22c55e', 'Learning': '#15803d',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, rotateX: -20 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.07, type: 'spring', stiffness: 100 }}
      style={{ perspective: 800, height: 120 }}
      className="relative cursor-pointer"
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90, damping: 16 }}
        style={{ transformStyle: 'preserve-3d', height: '100%', position: 'relative' }}
      >
        {/* FRONT */}
        <div style={{
          backfaceVisibility: 'hidden', position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(20,60,20,0.85) 0%, rgba(10,30,10,0.95) 100%)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 16, padding: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.5),transparent)' }} />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: index * 0.3 }}
                className="p-1.5 rounded-lg"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <tool.icon size={15} style={{ color: '#4ade80' }} />
              </motion.div>
              <span className="text-sm font-bold" style={{ color: '#bef264' }}>{tool.name}</span>
            </div>
            <span className="text-xs font-black" style={{ color: levelColor[tool.level] || '#22c55e' }}>
              {tool.progress}%
            </span>
          </div>

          <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${tool.progress}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: index * 0.07 + 0.4, ease: [0.34, 1.1, 0.64, 1] }}
              className="h-full rounded-full"
              style={{
                background: barGradients[tool.level] || barGradients['Advanced'],
                boxShadow: `0 0 8px ${barGlow[tool.level] || 'rgba(34,197,94,0.5)'}`,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ color: levelColor[tool.level], background: `${levelColor[tool.level]}12`, border: `1px solid ${levelColor[tool.level]}25` }}>
              {tool.level}
            </span>
            <span className="text-[9px]" style={{ color: '#3a6a3a' }}>tap to flip →</span>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${levelColor[tool.level]}18 0%, rgba(10,20,10,0.97) 100%)`,
          border: `1px solid ${levelColor[tool.level]}30`,
          borderRadius: 16, padding: 16,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <p className="text-xs font-black mb-2" style={{ color: levelColor[tool.level] }}>
            {tool.name.toUpperCase()}
          </p>
          <div className="flex items-center gap-2 mb-2">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{ background: i < Math.round(tool.progress / 10) ? levelColor[tool.level] : 'rgba(255,255,255,0.06)' }}
                initial={{ scaleY: 0 }}
                animate={flipped ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ delay: i * 0.04 + 0.1, duration: 0.3 }}
              />
            ))}
          </div>
          <p className="text-[10px]" style={{ color: '#5a8a5a' }}>
            Proficiency: <span style={{ color: levelColor[tool.level], fontWeight: 700 }}>{tool.progress}/100</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   STRENGTH CARD — 3D holographic (green)
══════════════════════════════════════════════════ */
const StrengthCard3D: React.FC<{ strength: any; index: number; inView: boolean }> = ({ strength, index, inView }) => {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [14, -14]), { stiffness: 250, damping: 20 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 250, damping: 20 })
  const [hov, setHov] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.12, type: 'spring', stiffness: 90 }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', perspective: 600 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { mx.set(0); my.set(0); setHov(false) }}
      whileHover={{ z: 20 }}
      className="relative cursor-default overflow-hidden"
      // style={{
      //   background: 'linear-gradient(135deg, rgba(20,60,20,0.9) 0%, rgba(10,30,10,0.95) 100%)',
      //   border: `1px solid ${hov ? strength.accent + '50' : 'rgba(34,197,94,0.15)'}`,
      //   borderRadius: 20,
      //   padding: '24px 20px',
      //   textAlign: 'center',
      //   transition: 'border-color 0.3s',
      //   boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${strength.accent}20` : '0 8px 32px rgba(0,0,0,0.3)',
      // }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          background: hov
            ? `linear-gradient(105deg, ${strength.accent}08 0%, rgba(34,197,94,0.06) 40%, ${strength.accent}04 100%)`
            : 'transparent',
          transition: 'background 0.3s',
        }}
      />

      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[20px]"
        style={{ background: `linear-gradient(90deg, transparent, ${strength.accent}, transparent)` }}
        animate={{ opacity: hov ? 1 : 0.35 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80, height: 80,
          top: '10%', left: '50%', marginLeft: -40,
          background: `radial-gradient(circle, ${strength.accent}15, transparent 70%)`,
          filter: 'blur(16px)',
        }}
        animate={{ scale: hov ? 1.4 : 1, opacity: hov ? 0.9 : 0.4 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        animate={hov
          ? { y: -6, rotateZ: [0, -8, 8, 0], scale: 1.15 }
          : { y: [0, -4, 0], scale: 1 }}
        transition={hov
          ? { duration: 0.5 }
          : { duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        className="mb-4 inline-flex p-3.5 rounded-2xl"
        style={{
          background: `${strength.accent}15`,
          border: `1px solid ${strength.accent}30`,
          boxShadow: hov ? `0 0 20px ${strength.accent}50, 0 0 40px ${strength.accent}20` : 'none',
          transition: 'box-shadow 0.3s',
          transform: 'translateZ(20px)',
        }}
      >
        <strength.icon size={30} style={{ color: strength.accent }} />
      </motion.div>

      <h4 className="font-black text-sm mb-1.5" style={{
        color: '#d9f99d', fontFamily: "'Syne', sans-serif",
        transform: 'translateZ(10px)',
      }}>
        {strength.name}
      </h4>
      <p className="text-xs" style={{ color: '#6a9a6a' }}>{strength.description}</p>

      {[['top-2 left-2','border-t border-l'],['top-2 right-2','border-t border-r']].map(([pos, border], i) => (
        <motion.div
          key={i}
          className={`absolute w-3 h-3 ${pos}`}
          style={{
            borderColor: strength.accent, borderWidth: 1, opacity: hov ? 0.6 : 0,
            borderTopStyle: border.includes('border-t') ? 'solid' : 'none',
            borderLeftStyle: border.includes('border-l') ? 'solid' : 'none',
            borderRightStyle: border.includes('border-r') ? 'solid' : 'none',
          }}
          animate={{ opacity: hov ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        />
      ))}
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
      className="text-4xl font-black tabular-nums"
    >
      {count}{suffix}
    </motion.span>
  )
}

/* ══════════════════════════════════════════════════
   MAIN SKILLS COMPONENT (Green & Black Theme)
══════════════════════════════════════════════════ */
const Skills: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })

  const technicalSkills = [
    { name: 'Python',            icon: Code2,    level: 'Expert',       progress: 95, glow: '#86efac' },
    { name: 'Java',              icon: Coffee,   level: 'Advanced',     progress: 85, glow: '#4ade80' },
    { name: 'C++',               icon: Code2,    level: 'Advanced',     progress: 82, glow: '#22c55e' },
    { name: 'HTML/CSS',          icon: Globe,    level: 'Expert',       progress: 92, glow: '#86efac' },
    { name: 'JavaScript',        icon: Code2,    level: 'Advanced',     progress: 88, glow: '#4ade80' },
    { name: 'AWS',               icon: Cloud,    level: 'Advanced',     progress: 85, glow: '#22c55e' },
    { name: 'MySQL',             icon: Database, level: 'Advanced',     progress: 87, glow: '#4ade80' },
    { name: 'DBMS',              icon: Database, level: 'Expert',       progress: 90, glow: '#86efac' },
    { name: 'Data Structures',   icon: Server,   level: 'Advanced',     progress: 86, glow: '#4ade80' },
    { name: 'OS',                icon: Terminal, level: 'Intermediate', progress: 75, glow: '#15803d' },
    { name: 'Networks',          icon: Globe,    level: 'Advanced',     progress: 82, glow: '#22c55e' },
    { name: 'OOP',               icon: Box,      level: 'Expert',       progress: 93, glow: '#86efac' },
  ]

  const tools = [
    { name: 'Git & GitHub',        icon: GitBranch, level: 'Expert',       progress: 90 },
    { name: 'Docker',              icon: Box,       level: 'Intermediate', progress: 70 },
    { name: 'Linux',               icon: Terminal,  level: 'Advanced',     progress: 85 },
    { name: 'UTM Virtualization',  icon: Cpu,       level: 'Advanced',     progress: 80 },
    { name: 'Kubernetes',          icon: Layers,    level: 'Learning',     progress: 65 },
    { name: 'Jenkins',             icon: Zap,       level: 'Intermediate', progress: 72 },
    { name: 'Terraform',           icon: Shield,    level: 'Learning',     progress: 60 },
    { name: 'React',               icon: Code2,     level: 'Advanced',     progress: 88 },
  ]

  const coreStrengths = [
    { name: 'Cloud Architecture', icon: Cloud,     description: 'Designing scalable cloud solutions',  accent: '#4ade80' },
    { name: 'System Design',      icon: Server,    description: 'Building robust distributed systems', accent: '#86efac' },
    { name: 'DevOps Practices',   icon: GitBranch, description: 'CI/CD, automation, monitoring',       accent: '#22c55e' },
    { name: 'Problem Solving',    icon: Sparkles,  description: 'Algorithmic thinking & optimization', accent: '#bef264' },
  ]

  const stats = [
    { icon: Award,      label: 'Expert Skills',  value: '4',   suffix: '',  color: '#86efac' },
    { icon: TrendingUp, label: 'Advanced',       value: '8',   suffix: '',  color: '#4ade80' },
    { icon: Rocket,     label: 'Learning',       value: '3',   suffix: '',  color: '#22c55e' },
    { icon: Brain,      label: 'Total Skills',   value: '20',  suffix: '+', color: '#bef264' },
  ]

  const subjects = ['Data Structures','Operating Systems','Computer Networks','OOP','DBMS','Cloud Architecture','DevOps','System Design']

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

      {/* Green ambient orbs */}
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

      {/* Floating ember sparks (green) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 1.5 + (i % 3) * 1.2, height: 1.5 + (i % 3) * 1.2,
            left: `${(i * 5.1) % 100}%`, bottom: 0,
            background: ['#22c55e','#4ade80','#86efac','#bef264','#15803d'][i % 5],
            boxShadow: `0 0 4px ${['#22c55e','#4ade80','#86efac','#bef264','#15803d'][i % 5]}`,
          }}
          animate={{ y: [0, -(180 + i * 22)], opacity: [0, 0.8, 0.5, 0], x: [0, (i % 2 === 0 ? 1 : -1) * 20] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
        />
      ))}

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
            // animate={{ boxShadow: ['0 0 30px rgba(34,197,94,0.2)', '0 0 50px rgba(34,197,94,0.38)', '0 0 30px rgba(34,197,94,0.2)'] }}
            // transition={{ duration: 3, repeat: Infinity }}
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

        {/* Rest of the component remains the same structure with green theme */}
        <div ref={ref}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {coreStrengths.map((s, i) => (
              <StrengthCard3D key={s.name} strength={s} index={i} inView={inView} />
            ))}
          </div>

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

            <motion.div
              className="absolute inset-x-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.3),transparent)' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />

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

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-x-4 gap-y-8">
              {technicalSkills.map((skill, i) => (
                <div key={skill.name} className="col-span-2 sm:col-span-2 flex justify-center">
                  <SkillOrb skill={skill} index={i} inView={inView} />
                </div>
              ))}
            </div>
          </motion.div>

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
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
                  style={{ color: '#5a8a5a', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>
                  tap to flip
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map((tool, i) => (
                  <ToolCard3D key={tool.name} tool={tool} index={i} inView={inView} />
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
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.06, type: 'spring' }}
                    whileHover={{ scale: 1.12, y: -3, boxShadow: '0 0 18px rgba(74,222,128,0.45)' }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold cursor-default"
                    style={{
                      background: 'rgba(34,197,94,0.10)',
                      border: '1px solid rgba(34,197,94,0.22)',
                      color: '#86efac',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.18)'
                      e.currentTarget.style.color = '#bef264'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.10)'
                      e.currentTarget.style.color = '#86efac'
                    }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Cloud & DevOps', pct: 85, color: '#4ade80' },
                  { name: 'System Design',  pct: 82, color: '#86efac' },
                  { name: 'Algorithms',     pct: 88, color: '#bef264' },
                  { name: 'Networking',     pct: 78, color: '#22c55e' },
                ].map((item, i) => (
                  <div key={item.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#8aae8a' }}>{item.name}</span>
                      <span className="text-xs font-black" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                          boxShadow: `0 0 8px ${item.color}50`,
                        }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${item.pct}%` } : { width: 0 }}
                        transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: [0.34, 1.1, 0.64, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

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