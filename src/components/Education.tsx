import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  GraduationCap, School, Calendar, MapPin, Award,
  Star, TrendingUp, Sparkles, Cloud, Server, GitBranch,
  Cpu, Code, Terminal, Database, Shield, ChevronDown,
  Zap
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
   3D EXPERTISE CARD
═══════════════════════════════════════════ */
const ExpertCard: React.FC<{ area: any; index: number; inView: boolean }> = ({ area, index, inView }) => {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sp = { damping: 22, stiffness: 200 }
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), sp)
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), sp)
  const [hov, setHov] = useState(false)
  const [sx, setSx] = useState(50)
  const [sy, setSy] = useState(50)

  const COLORS = ['#22d3ee', '#818cf8', '#34d399', '#f472b6', '#fb923c', '#a78bfa', '#60a5fa', '#4ade80']
  const color = COLORS[index % COLORS.length]
  const levelColor = area.level === 'Expert' ? '#34d399' : area.level === 'Advanced' ? '#60a5fa' : '#f59e0b'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75, y: 40 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.07, type: 'spring', stiffness: 110 }}
      style={{ perspective: 700 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
        onMouseMove={e => {
          const el = ref.current
          if (!el) return
          const r = el.getBoundingClientRect()
          mx.set((e.clientX - r.left) / r.width - 0.5)
          my.set((e.clientY - r.top) / r.height - 0.5)
          setSx(((e.clientX - r.left) / r.width) * 100)
          setSy(((e.clientY - r.top) / r.height) * 100)
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => { mx.set(0); my.set(0); setHov(false) }}
        className="relative p-5 rounded-2xl text-center cursor-pointer overflow-hidden"
        // style={{
        //   background: 'rgba(8,12,22,0.88)',
        //   border: hov ? `1px solid ${color}45` : '1px solid rgba(255,255,255,0.07)',
        //   backdropFilter: 'blur(16px)',
        //   boxShadow: hov ? `0 24px 48px ${color}18,0 0 0 1px ${color}20` : '0 4px 24px rgba(0,0,0,0.4)',
        //   transition: 'border-color 0.35s, box-shadow 0.35s',
        // }}
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{ opacity: hov ? 1 : 0, background: `radial-gradient(120px circle at ${sx}% ${sy}%,${color}18,transparent 70%)` }} />

        <motion.div
          animate={hov ? { rotate: [0, -8, 8, -4, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-3 w-11 h-11 flex items-center justify-center rounded-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <area.icon size={22} style={{ color }} />
        </motion.div>

        <p className="text-xs font-black mb-2.5 text-white leading-tight" style={{ fontFamily: 'Syne,sans-serif' }}>{area.name}</p>

        <div className="flex flex-wrap gap-1 justify-center mb-3">
          {area.skills.map((s: string) => (
            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: `${color}0d`, color: `${color}bb`, border: `1px solid ${color}20` }}>{s}</span>
          ))}
        </div>

        <motion.span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
          style={{ color: levelColor }}
          animate={hov ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.4 }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: levelColor }} />
          {area.level}
        </motion.span>

        {/* FIX: removed duplicate transition-opacity class, kept pointer-events-none */}
        <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
          style={{ opacity: hov ? 0.6 : 0, transition: 'opacity 0.3s', background: `radial-gradient(circle at 100% 100%,${color}25,transparent 70%)` }} />
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   HOLOGRAPHIC EDUCATION CARD
═══════════════════════════════════════════ */
const EduCard: React.FC<{ edu: any; index: number; inView: boolean }> = ({ edu, index, inView }) => {
  const [expanded, setExpanded] = useState(false)
  const [hov, setHov] = useState(false)
  const [sx, setSx] = useState(50)
  const [sy, setSy] = useState(50)
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className={`relative flex mb-16 flex-col items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center`}
      initial={{ opacity: 0, x: isLeft ? -70 : 70, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={inView ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.2 + 0.35, type: 'spring' }}
        className="absolute left-8 md:left-1/2 md:-translate-x-1/2 z-20"
      >
        <div className="relative">
          {[1, 2].map(i => (
            <motion.div key={i} className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${edu.color}50` }}
              animate={{ scale: [1, 2.2 + i * 0.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
          <motion.div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${edu.color},${edu.colorAlt})`, boxShadow: `0 0 20px ${edu.color}70` }}
            animate={{ boxShadow: [`0 0 20px ${edu.color}70`, `0 0 40px ${edu.color}a0`, `0 0 20px ${edu.color}70`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <edu.icon size={14} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      <div className={`ml-20 md:ml-0 md:w-5/12 ${isLeft ? 'md:pr-14' : 'md:pl-14'}`}>
        <motion.div
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect()
            setSx(((e.clientX - r.left) / r.width) * 100)
            setSy(((e.clientY - r.top) / r.height) * 100)
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          whileHover={{ scale: 1.02, y: -6 }}
          className="relative overflow-hidden cursor-pointer"
          style={{
            background: 'rgba(6,10,20,0.90)',
            border: hov ? `1px solid ${edu.color}45` : `1px solid ${edu.color}18`,
            borderRadius: 24,
            backdropFilter: 'blur(24px)',
            boxShadow: hov ? `0 32px 64px ${edu.color}18,0 0 0 1px ${edu.color}20` : '0 8px 40px rgba(0,0,0,0.5)',
            transition: 'all 0.45s ease',
          }}
        >
          <motion.div className="absolute inset-0 rounded-[24px] pointer-events-none"
            animate={{ background: [
              `linear-gradient(135deg,${edu.color}30,${edu.colorAlt}15,transparent)`,
              `linear-gradient(225deg,${edu.colorAlt}30,${edu.color}15,transparent)`,
              `linear-gradient(315deg,${edu.color}25,${edu.colorAlt}20,transparent)`,
              `linear-gradient(135deg,${edu.color}30,${edu.colorAlt}15,transparent)`,
            ] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="absolute inset-0 rounded-[24px]"
            style={{ background: `linear-gradient(135deg,${edu.color}12 0%,${edu.colorAlt}06 100%)` }} />

          <div className="absolute inset-0 rounded-[24px] pointer-events-none transition-opacity duration-300"
            style={{ opacity: hov ? 1 : 0, background: `radial-gradient(250px circle at ${sx}% ${sy}%,${edu.color}14,transparent 70%)` }} />

          {/* FIX TS17001 — was two separate style props; merged into one */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[24px]"
            style={{
              background: 'linear-gradient(110deg,transparent 35%,rgba(255,255,255,0.05) 50%,transparent 65%)',
              borderRadius: 24,
            }}
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2 }}
          />

          <div className="relative z-10 p-7">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[10px] font-black uppercase tracking-widest"
              style={{ background: `${edu.color}18`, border: `1px solid ${edu.color}40`, color: edu.color }}
              animate={{ boxShadow: [`0 0 0px ${edu.color}00`, `0 0 14px ${edu.color}50`, `0 0 0px ${edu.color}00`] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles size={10} />
              {edu.type === 'university' ? 'University' : edu.type === 'college' ? 'College' : 'School'}
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: edu.color }} />
            </motion.div>

            <div className="flex gap-4 mb-5">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}
                className="flex-shrink-0 rounded-2xl flex items-center justify-center"
                style={{ background: `${edu.color}15`, border: `1px solid ${edu.color}35`, width: 52, height: 52 }}
              >
                <edu.icon size={26} style={{ color: edu.color }} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-sm leading-snug mb-1.5 text-white" style={{ fontFamily: 'Syne,sans-serif' }}>
                  {edu.degree}
                </h3>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
                  <Calendar size={11} style={{ color: edu.color }} />{edu.period}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#cbd5e1' }}>
                <School size={14} style={{ color: edu.color }} />{edu.institution}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
                <MapPin size={12} style={{ color: edu.colorAlt }} />{edu.location}
              </div>
            </div>

            <motion.div
              className="flex items-center gap-4 p-4 rounded-2xl mb-5"
              style={{ background: `${edu.color}0d`, border: `1px solid ${edu.color}22` }}
              whileHover={{ scale: 1.02 }}
            >
              {edu.cgpa ? <Award size={20} style={{ color: edu.color }} /> : <TrendingUp size={20} style={{ color: edu.color }} />}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: '#475569' }}>
                  {edu.cgpa ? 'CGPA' : 'Percentage'}
                </p>
                <p className="text-2xl font-black leading-none" style={{ color: edu.color, fontFamily: 'Syne,sans-serif' }}>
                  {edu.cgpa || edu.percentage}
                </p>
              </div>
              <div className="w-24">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg,${edu.color},${edu.colorAlt})`, boxShadow: `0 0 8px ${edu.color}` }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: edu.cgpa ? `${(parseFloat(edu.cgpa) / 10) * 100}%` : edu.percentage } : { width: 0 }}
                    transition={{ duration: 1.4, delay: index * 0.25 + 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            <div className="rounded-xl px-4 py-3 mb-5"
              style={{ background: 'rgba(255,255,255,0.025)', borderLeft: `3px solid ${edu.color}` }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: edu.color }}>🎯 Focus Area</p>
              <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>{edu.expertise}</p>
            </div>

            <div>
              <button onClick={() => setExpanded(v => !v)} className="w-full flex items-center justify-between py-2 transition-colors">
                <p className="text-[10px] uppercase tracking-widest font-black" style={{ color: '#475569' }}>Key Achievements</p>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={14} style={{ color: '#475569' }} />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                    <div className="flex flex-wrap gap-1.5 pb-2 pt-1">
                      {edu.achievements.map((a: string, i: number) => (
                        <motion.span key={a} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06, type: 'spring', stiffness: 150 }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{ background: `${edu.color}10`, border: `1px solid ${edu.color}25`, color: '#94a3b8' }}>
                          {a}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none rounded-br-[24px]"
            style={{ opacity: hov ? 0.7 : 0.2, transition: 'opacity 0.3s', background: `radial-gradient(circle at 100% 100%,${edu.color}25,transparent 70%)` }} />
        </motion.div>
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
  const [mainRef, mainInView] = useInView({ triggerOnce: true, threshold: 0.04 })
  const [activeTab, setActiveTab] = useState<'expertise' | 'timeline'>('expertise')
  const { scrollYProgress } = useScroll()
  const lineH = useSpring(useTransform(scrollYProgress, [0.2, 0.85], [0, 1]), { stiffness: 80, damping: 28 })

  const EDU_DATA = [
    {
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      institution: 'Lovely Professional University', location: 'Punjab, India',
      period: "Aug '23 – Present", cgpa: '7.2', icon: GraduationCap, type: 'university',
      color: '#3b82f6', colorAlt: '#06b6d4',
      achievements: ['Cloud Computing Specialization', 'DevOps Engineering Track', 'AWS Cloud Practitioner', 'Kubernetes & Docker Certified'],
      expertise: 'Cloud Engineer & DevOps Specialist',
    },
    {
      degree: 'Intermediate — Science Stream',
      institution: 'Araria College Araria', location: 'Araria, Bihar',
      period: "Apr '20 – Mar '22", percentage: '70.6%', icon: School, type: 'college',
      color: '#a855f7', colorAlt: '#ec4899',
      achievements: ['Science Stream', 'Mathematics Excellence', 'Computer Science Foundation'],
      expertise: 'Foundation in Computer Science',
    },
    {
      degree: 'Matriculation',
      institution: 'L.S. High School Palasi Pategna Araria', location: 'Araria, Bihar',
      period: "Apr '19 – Mar '20", percentage: '83.2%', icon: School, type: 'school',
      color: '#10b981', colorAlt: '#14b8a6',
      achievements: ['First Division', 'Science Background', 'Academic Excellence'],
      expertise: 'Strong Academic Foundation',
    },
  ]

  const EXPERTISE = [
    { name: 'Cloud Architecture', icon: Cloud, skills: ['AWS', 'Azure', 'GCP'], level: 'Expert' },
    { name: 'Container Orchestration', icon: Server, skills: ['Kubernetes', 'Docker', 'ECS'], level: 'Advanced' },
    { name: 'CI/CD Pipelines', icon: GitBranch, skills: ['Jenkins', 'GitHub Actions', 'GitLab CI'], level: 'Expert' },
    { name: 'IaC & Automation', icon: Code, skills: ['Terraform', 'Ansible', 'Pulumi'], level: 'Advanced' },
    { name: 'Monitoring & Logging', icon: Terminal, skills: ['Prometheus', 'Grafana', 'ELK'], level: 'Advanced' },
    { name: 'DevOps Tooling', icon: Cpu, skills: ['Helm', 'ArgoCD', 'Vault'], level: 'Expert' },
    { name: 'Cloud Security', icon: Shield, skills: ['IAM', 'WAF', 'Secrets'], level: 'Intermediate' },
    { name: 'Database Management', icon: Database, skills: ['RDS', 'DynamoDB', 'MongoDB'], level: 'Advanced' },
  ]

  const STATS = [
    { label: 'Years of Study', value: '4', suffix: '', icon: Calendar, color: '#3b82f6' },
    { label: 'Institutions', value: '3', suffix: '', icon: School, color: '#a855f7' },
    { label: 'Current CGPA', value: '7.2', suffix: '', icon: Star, color: '#f59e0b' },
    { label: 'Certifications', value: '5', suffix: '+', icon: Award, color: '#10b981' },
  ]

  const TABS = [
    { id: 'expertise' as const, label: 'Core Expertise', icon: Zap },
    { id: 'timeline' as const, label: 'Education', icon: GraduationCap },
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
            <span className="text-white block">Education</span>
            <span className="block text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg,#3b82f6,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 30px rgba(59,130,246,0.4))' }}>
              & Expertise
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

        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center gap-3 mb-12"
        >
          {TABS.map(tab => (
            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2 px-7 py-3 rounded-full text-sm font-black overflow-hidden"
              style={activeTab === tab.id ? {
                background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                color: '#fff', boxShadow: '0 0 24px rgba(59,130,246,0.45)', fontFamily: 'Syne,sans-serif'
              } : {
                background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.18)', color: '#475569', fontFamily: 'Syne,sans-serif'
              }}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="tabSlider" className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }} />
              )}
              <tab.icon size={14} className="relative" />
              <span className="relative">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <div ref={mainRef}>
          <AnimatePresence mode="wait">
            {activeTab === 'expertise' && (
              <motion.div key="exp"
                initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -25, filter: 'blur(6px)' }} transition={{ duration: 0.45 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              >
                {EXPERTISE.map((area, i) => <ExpertCard key={area.name} area={area} index={i} inView={mainInView} />)}
              </motion.div>
            )}

            {activeTab === 'timeline' && (
              <motion.div key="timeline"
                initial={{ opacity: 0, y: 25, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -25, filter: 'blur(6px)' }} transition={{ duration: 0.45 }}
                className="relative"
              >
                <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-20 w-px overflow-visible">
                  <motion.div className="w-full h-full rounded-full"
                    style={{ background: 'linear-gradient(180deg,#3b82f6,#06b6d4,#a855f7)', scaleY: lineH, transformOrigin: 'top' }}
                  />
                  <motion.div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full -translate-x-[7px]"
                    style={{ background: '#60a5fa', boxShadow: '0 0 16px #60a5fa', top: useTransform(lineH, [0, 1], ['0%', '100%']) }}
                  />
                </div>
                {EDU_DATA.map((edu, i) => <EduCard key={i} edu={edu} index={i} inView={mainInView} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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