import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  GraduationCap, School, Calendar, MapPin, Award,
  Star, TrendingUp, Sparkles, ChevronDown, Cloud
} from 'lucide-react'

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
const ParticleNet: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const mouse = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')!

    const resize = () => {
      c.width = c.offsetWidth
      c.height = c.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onM = (e: MouseEvent) => {
      const r = c.getBoundingClientRect()
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    window.addEventListener('mousemove', onM)

    const COLS = ['#22d3ee', '#818cf8', '#34d399', '#f472b6', '#a78bfa', '#60a5fa']
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.5,
      color: COLS[Math.floor(Math.random() * COLS.length)],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      const { x: mx, y: my } = mouse.current

      pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) {
          p.vx += (dx / d) * 0.25
          p.vy += (dy / d) * 0.25
        }
        p.vx *= 0.978
        p.vy *= 0.978
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = c.width
        if (p.x > c.width) p.x = 0
        if (p.y < 0) p.y = c.height
        if (p.y > c.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '70'
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 85) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 85) * 0.11})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onM)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════ */
const Counter: React.FC<{ to: string; active: boolean }> = ({ to, active }) => {
  const [val, setVal] = useState(0)
  const num = parseFloat(to)
  const isFloat = to.includes('.')

  useEffect(() => {
    if (!active) return
    let s = 0
    const step = num / (1.5 * 60)
    const t = setInterval(() => {
      s += step
      if (s >= num) {
        setVal(num)
        clearInterval(t)
      } else {
        setVal(isFloat ? parseFloat(s.toFixed(1)) : Math.floor(s))
      }
    }, 1000 / 60)
    return () => clearInterval(t)
  }, [active, num, isFloat])

  return <>{val}</>
}

/* ═══════════════════════════════════════════
   EDUCATION CARD
═══════════════════════════════════════════ */
const EduCard: React.FC<{ edu: any; index: number; inView: boolean }> = ({ edu, index, inView }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className="mb-6 last:mb-0"
    >
      <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all duration-500 group"
        style={{
          background: 'rgba(8,12,22,0.85)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <edu.icon size={24} style={{ color: edu.color }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {edu.degree}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Calendar size={14} />
                  <span>{edu.period}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {edu.cgpa ? (
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                  <span className="text-green-400 font-semibold">CGPA: {edu.cgpa}</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30">
                  <span className="text-blue-400 font-semibold">Percentage: {edu.percentage}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <School size={16} className="text-cyan-400" />
              <span>{edu.institution}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={16} className="text-cyan-400" />
              <span>{edu.location}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-cyan-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">🎯 Focus Area</p>
            </div>
            <p className="text-sm text-gray-300">{edu.expertise}</p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{expanded ? 'Show less' : 'View achievements'}</span>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-3 border-t border-white/10"
            >
              <div className="flex flex-wrap gap-2">
                {edu.achievements.map((a: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}30`, color: '#94a3b8' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════ */
const StatCard: React.FC<{ stat: any; index: number; inView: boolean }> = ({ stat, index, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.85 }}
    animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.6, delay: 0.05 + index * 0.1, type: 'spring', stiffness: 110 }}
    whileHover={{ scale: 1.07, y: -5 }}
    className="relative text-center overflow-hidden cursor-default group"
    style={{ background: 'rgba(8,12,22,0.85)', border: `1px solid ${stat.color}22`, borderRadius: 18, padding: '22px 14px', backdropFilter: 'blur(14px)' }}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle at 50% 0%,${stat.color}15,transparent 70%)` }} />

    <motion.div
      className="mx-auto mb-3 w-11 h-11 flex items-center justify-center rounded-xl"
      style={{ background: `${stat.color}12`, border: `1px solid ${stat.color}28` }}
      animate={{ boxShadow: [`0 0 0px ${stat.color}00`, `0 0 18px ${stat.color}40`, `0 0 0px ${stat.color}00`] }}
      transition={{ duration: 3.5, repeat: Infinity, delay: index * 0.5 }}
    >
      <stat.icon size={20} style={{ color: stat.color }} />
    </motion.div>

    <p className="text-3xl font-black mb-1 leading-none" style={{ color: stat.color, fontFamily: 'Syne,sans-serif' }}>
      <Counter to={stat.value} active={inView} />{stat.suffix}
    </p>
    <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{stat.label}</p>

    <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
      style={{ background: `linear-gradient(90deg,${stat.color},transparent)` }} />
  </motion.div>
)

/* ═══════════════════════════════════════════
   MAIN EDUCATION COMPONENT
═══════════════════════════════════════════ */
const Education: React.FC = () => {
  const [mainRef, mainInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const EDU_DATA = [
    {
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      institution: 'Lovely Professional University',
      location: 'Punjab, India',
      period: "Aug '23 – Present",
      cgpa: '7.2',
      icon: GraduationCap,
      type: 'university',
      color: '#3b82f6',
      colorAlt: '#06b6d4',
      achievements: ['Cloud Computing Specialization', 'DevOps Engineering Track', 'AWS Cloud Practitioner', 'Kubernetes & Docker Certified'],
      expertise: 'Cloud Engineer & DevOps Specialist',
    },
    {
      degree: 'Intermediate — Science Stream',
      institution: 'Araria College Araria',
      location: 'Araria, Bihar',
      period: "Apr '20 – Mar '22",
      percentage: '70.6%',
      icon: School,
      type: 'college',
      color: '#a855f7',
      colorAlt: '#ec4899',
      achievements: ['Science Stream', 'Mathematics Excellence', 'Computer Science Foundation'],
      expertise: 'Foundation in Computer Science',
    },
    {
      degree: 'Matriculation',
      institution: 'L.S. High School Palasi Pategna Araria',
      location: 'Araria, Bihar',
      period: "Apr '19 – Mar '20",
      percentage: '83.2%',
      icon: School,
      type: 'school',
      color: '#10b981',
      colorAlt: '#14b8a6',
      achievements: ['First Division', 'Science Background', 'Academic Excellence'],
      expertise: 'Strong Academic Foundation',
    },
  ]

  const STATS = [
    { label: 'Years of Study', value: '4', suffix: '', icon: Calendar, color: '#3b82f6' },
    { label: 'Institutions', value: '3', suffix: '', icon: School, color: '#a855f7' },
    { label: 'Current CGPA', value: '7.2', suffix: '', icon: Star, color: '#f59e0b' },
    { label: 'Certifications', value: '5', suffix: '+', icon: Award, color: '#10b981' },
  ]

  const TECH_BADGES = ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'ArgoCD', 'Prometheus', 'Helm']

  return (
    <section id="education" className="relative py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#020817 0%,#04101e 50%,#020817 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"><ParticleNet /></div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { c: '#3b82f6', t: '-10%', l: '-10%', s: 600, d: 0 },
          { c: '#a855f7', b: '-10%', r: '-10%', s: 500, d: 4 },
          { c: '#06b6d4', T: '40%', L: '35%', s: 400, d: 8 },
        ].map((o, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: o.s, height: o.s, top: o.t || o.T, bottom: o.b, left: o.l || o.L, right: o.r, background: o.c, filter: 'blur(130px)', opacity: 0.06 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.11, 0.06] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: o.d }}
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,1) 1px,transparent 1px)',
        backgroundSize: '65px 65px'
      }} />

      <motion.div className="absolute inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg,transparent,#3b82f660,#06b6d480,#3b82f660,transparent)' }}
        animate={{ top: ['0%', '100%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1, type: 'spring', stiffness: 170 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={13} className="text-blue-400" />
            </motion.div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">Cloud Engineer · DevOps Specialist</span>
            <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </motion.div>

          <h2 className="font-black tracking-tight leading-none mb-5"
            style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(3rem,7vw,5.5rem)' }}>
            <span className="text-white block">Educations</span>
            <span className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#3b82f6,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.4))' }}>
            </span>
          </h2>

          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Computer Science Engineering — specialised in{' '}
            <span className="text-gray-300 font-semibold">Cloud Computing & DevOps</span>
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.7 }}
              className="h-px" style={{ background: 'linear-gradient(90deg,transparent,#3b82f6)' }} />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-2 h-2 border border-blue-500/50 rotate-45" />
            <motion.div initial={{ width: 0 }} whileInView={{ width: 60 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.7 }}
              className="h-px" style={{ background: 'linear-gradient(270deg,transparent,#a855f7)' }} />
          </div>
        </motion.div>

        {/* Tech Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-14 relative overflow-hidden rounded-2xl"
          style={{ background: 'rgba(8,12,22,0.80)', border: '1px solid rgba(59,130,246,0.18)', backdropFilter: 'blur(20px)' }}
        >
          <motion.div className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg,rgba(59,130,246,0.07),rgba(6,182,212,0.04),rgba(59,130,246,0.07))' }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative z-10 p-5 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <motion.div className="p-3 rounded-2xl"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}
                animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 28px rgba(59,130,246,0.55)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ duration: 2.8, repeat: Infinity }}
              >
                <Cloud size={28} className="text-blue-400" />
              </motion.div>
              <div>
                <p className="font-black text-lg text-blue-400" style={{ fontFamily: 'Syne,sans-serif' }}>Cloud Engineer & DevOps Expert</p>
                <p className="text-sm text-gray-500">Building scalable, resilient cloud-native infrastructure</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {TECH_BADGES.map((tech, i) => (
                <motion.span key={tech}
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.22)', color: '#93c5fd' }}
                  whileHover={{ scale: 1.1, background: 'rgba(59,130,246,0.20)' }}
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.18 }}
                >{tech}</motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Education Cards */}
        <div ref={mainRef} className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-white">Academic Journey</h3>
          {EDU_DATA.map((edu, i) => (
            <EduCard key={i} edu={edu} index={i} inView={mainInView} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} inView={mainInView} />)}
        </motion.div>
      </div>
    </section>
  )
}

export default Education