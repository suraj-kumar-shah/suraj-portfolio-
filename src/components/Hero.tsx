import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  Github, Linkedin, Award, Mail, Phone, MapPin,
  Download, Code, Sparkles, ChevronRight, Terminal,
  Cloud, Cpu, GitBranch, Zap, ArrowDown
} from 'lucide-react'

/* ═══════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════ */
const useTypewriter = (words: string[], typeSpeed = 68, deleteSpeed = 38, pauseMs = 1700) => {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && text.length < current.length)
      t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
    else if (!deleting && text.length === current.length)
      t = setTimeout(() => setDeleting(true), pauseMs)
    else if (deleting && text.length > 0)
      t = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed)
    else {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }
    return () => clearTimeout(t)
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, pauseMs])

  return text
}

/* ═══════════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════════ */
const HeroParticles: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H }
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    window.addEventListener('mousemove', onMouse)

    const COLORS = ['#22d3ee','#818cf8','#34d399','#f472b6','#a78bfa']
    const pts = Array.from({ length: 100 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const { x: mx, y: my } = mouseRef.current

      pts.forEach(p => {
        const dx = p.x - mx, dy = p.y - my
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 110) { p.vx += (dx / d) * 0.35; p.vy += (dy / d) * 0.35 }
        p.vx *= 0.975; p.vy *= 0.975
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + '85'
        ctx.shadowColor = p.color; ctx.shadowBlur = 7
        ctx.fill(); ctx.shadowBlur = 0
      })

      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 90) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(34,211,238,${(1 - d / 90) * 0.14})`
            ctx.lineWidth = 0.6; ctx.stroke()
          }
        }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouse) }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.65 }} />
}

/* ═══════════════════════════════════════════
   GLITCH TEXT
═══════════════════════════════════════════ */
const GlitchName: React.FC<{ text: string }> = ({ text }) => (
  <>
    <span className="glitch-name" data-text={text}>{text}</span>
    <style>{`
      .glitch-name{position:relative;display:inline-block;}
      .glitch-name::before,.glitch-name::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;}
      .glitch-name::before{left:3px;text-shadow:-3px 0 #f472b6;clip-path:polygon(0 18%,100% 18%,100% 34%,0 34%);animation:gA 4.2s infinite linear alternate-reverse;}
      .glitch-name::after{left:-3px;text-shadow:3px 0 #22d3ee;clip-path:polygon(0 62%,100% 62%,100% 78%,0 78%);animation:gB 3.7s infinite linear alternate-reverse;}
      @keyframes gA{0%{clip-path:polygon(0 15%,100% 15%,100% 30%,0 30%);transform:translate(-2px,0)}45%{clip-path:polygon(0 65%,100% 65%,100% 78%,0 78%);transform:translate(2px,0)}100%{clip-path:polygon(0 40%,100% 40%,100% 55%,0 55%);transform:translate(0)}}
      @keyframes gB{0%{clip-path:polygon(0 72%,100% 72%,100% 84%,0 84%);transform:translate(2px,0)}50%{clip-path:polygon(0 8%,100% 8%,100% 20%,0 20%);transform:translate(-2px,0)}100%{clip-path:polygon(0 50%,100% 50%,100% 62%,0 62%);transform:translate(0)}}
    `}</style>
  </>
)

/* ═══════════════════════════════════════════
   ORBIT RING
═══════════════════════════════════════════ */
const OrbitItem: React.FC<{
  r: number; duration: number; delay?: number; reverse?: boolean
  color: string; IconComp: React.ElementType; iconSize?: number
}> = ({ r, duration, delay = 0, reverse, color, IconComp, iconSize = 16 }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
    style={{ width: r*2, height: r*2, marginLeft: -r, marginTop: -r, border: `1px dashed ${color}28` }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
  >
    <motion.div
      className="absolute -top-5 left-1/2 -translate-x-1/2 p-2 rounded-full"
      style={{ background: 'rgba(6,10,22,0.9)', border: `1px solid ${color}45`, backdropFilter: 'blur(8px)' }}
      animate={{ rotate: reverse ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <IconComp size={iconSize} style={{ color }} />
    </motion.div>
  </motion.div>
)

/* ═══════════════════════════════════════════
   PROFILE IMAGE (3D tilt + spotlight)
═══════════════════════════════════════════ */
const ProfileImage: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const spring = { damping: 20, stiffness: 130 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring)
  const [hov, setHov] = useState(false)
  const [sx, setSx] = useState(50); const [sy, setSy] = useState(50)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    setSx(((e.clientX - r.left) / r.width) * 100)
    setSy(((e.clientY - r.top) / r.height) * 100)
  }
  const onLeave = () => { mx.set(0); my.set(0); setHov(false) }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center"
      style={{ width: 340, height: 340 }}
    >
      {/* Orbit rings */}
      <OrbitItem r={138} duration={10}  color="#22d3ee" IconComp={Cloud}     iconSize={16} />
      <OrbitItem r={168} duration={14}  color="#818cf8" IconComp={Cpu}       iconSize={15} reverse />
      <OrbitItem r={198} duration={19}  color="#34d399" IconComp={GitBranch} iconSize={14} delay={1} />
      <OrbitItem r={228} duration={24}  color="#f472b6" IconComp={Terminal}  iconSize={13} reverse delay={0.5} />

      {/* Pulse halos */}
      {[1,2,3].map(i => (
        <motion.div key={i} className="absolute rounded-full border border-cyan-500/15"
          style={{ width: 285+i*22, height: 285+i*22 }}
          animate={{ scale:[1,1.06,1], opacity:[0.3,0.06,0.3] }}
          transition={{ duration:3.5, repeat:Infinity, delay:i*0.7, ease:'easeInOut' }}
        />
      ))}

      {/* 3D card */}
      <motion.div
        ref={ref}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle:'preserve-3d', perspective:900 }}
        onMouseMove={onMove} onMouseEnter={() => setHov(true)} onMouseLeave={onLeave}
        whileHover={{ scale: 1.04 }} transition={{ duration: 0.35 }}
        className="relative z-10"
      >
        {/* Glow ring */}
        <motion.div className="absolute -inset-1 rounded-full"
          animate={{ opacity: hov ? 1 : 0.55 }}
          style={{ background:'linear-gradient(135deg,#22d3ee,#818cf8,#f472b6)', filter:'blur(2px)' }}
        />

        <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden"
          style={{ border:'2.5px solid rgba(34,211,238,0.3)' }}>
          <img
            src="/src/assets/profile.jpeg" alt="Suraj Kumar Sah"
            className="w-full h-full object-cover"
            style={{ transform:`scale(${hov?1.06:1})`, transition:'transform 0.5s ease' }}
          />

          {/* Spotlight */}
          <div className="absolute inset-0 rounded-full transition-opacity duration-300"
            style={{ opacity:hov?1:0, background:`radial-gradient(circle at ${sx}% ${sy}%, rgba(34,211,238,0.18) 0%, transparent 65%)` }}
          />

          {/* Horizontal scan */}
          <motion.div className="absolute inset-x-0 h-px pointer-events-none"
            style={{ background:'linear-gradient(90deg,transparent,#22d3ee65,transparent)' }}
            animate={{ top:['0%','100%','0%'] }}
            transition={{ duration:4, repeat:Infinity, ease:'linear' }}
          />
        </div>

        {/* Available badge */}
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap"
          style={{ background:'rgba(6,10,22,0.92)', border:'1px solid rgba(52,211,153,0.35)', backdropFilter:'blur(12px)' }}
          animate={{ y:[0,-4,0] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 tracking-widest uppercase">Open to Work</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   INFO CARD
═══════════════════════════════════════════ */
const InfoCard: React.FC<{ icon: React.ElementType; label: string; value: string; href?: string; delay: number }> =
  ({ icon: Icon, label, value, href, delay }) => (
  <motion.div
    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
    transition={{ delay, duration:0.5, ease:[0.22,1,0.36,1] }}
    whileHover={{ scale:1.03, y:-2 }}
    className="group relative flex items-center gap-3 p-3.5 rounded-2xl overflow-hidden"
    style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background:'rgba(34,211,238,0.04)' }} />
    <div className="relative p-2 rounded-xl flex-shrink-0"
      style={{ background:'rgba(34,211,238,0.10)', border:'1px solid rgba(34,211,238,0.22)' }}>
      <Icon size={15} className="text-cyan-400" />
    </div>
    <div className="relative min-w-0">
      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-0.5">{label}</p>
      {href
        ? <a href={href} className="text-sm text-gray-300 hover:text-cyan-400 transition-colors truncate block font-medium">{value}</a>
        : <p className="text-sm text-gray-300 truncate font-medium">{value}</p>}
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
      style={{ background:'linear-gradient(90deg,#22d3ee,transparent)' }} />
  </motion.div>
)

/* ═══════════════════════════════════════════
   SOCIAL BUTTON
═══════════════════════════════════════════ */
const SocialBtn: React.FC<{ href: string; icon: React.ElementType; label: string; delay: number; color?: string }> =
  ({ href, icon: Icon, label, delay, color = '#22d3ee' }) => (
  <motion.a
    href={href} target="_blank" rel="noopener noreferrer" title={label}
    initial={{ opacity:0, scale:0, rotate:-20 }} animate={{ opacity:1, scale:1, rotate:0 }}
    transition={{ delay, type:'spring', stiffness:180 }}
    whileHover={{ scale:1.15, y:-4 }} whileTap={{ scale:0.92 }}
    className="group relative p-3 rounded-xl"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background:`${color}12`, border:`1px solid ${color}30` }} />
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-300"
      style={{ background:color }} />
    <Icon size={19} className="relative text-gray-500 group-hover:scale-110 transition-all duration-300"
      style={{ color:'rgba(156,163,175,1)' }} />
  </motion.a>
)

/* ═══════════════════════════════════════════
   TECH STRIP
═══════════════════════════════════════════ */
const BADGES = [
  { label:'AWS',       color:'#fb923c' },
  { label:'Docker',    color:'#22d3ee' },
  { label:'K8s',       color:'#818cf8' },
  { label:'React',     color:'#34d399' },
  { label:'Python',    color:'#f472b6' },
  { label:'Terraform', color:'#a78bfa' },
  { label:'Jenkins',   color:'#60a5fa' },
]

/* ═══════════════════════════════════════════
   MAIN HERO
═══════════════════════════════════════════ */
const ROLES = ['Cloud Engineer', 'DevOps Specialist', 'Full Stack Developer', 'System Architect', 'Problem Solver']

const Hero: React.FC = () => {
  const typedRole = useTypewriter(ROLES, 65, 38, 1800)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Particle canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroParticles />
      </div>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full"
          style={{ top:'-12%', left:'-12%', background:'#22d3ee', filter:'blur(140px)', opacity:0.055 }}
          animate={{ scale:[1,1.15,1], x:[0,35,0] }} transition={{ duration:13, repeat:Infinity, ease:'easeInOut' }}
        />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full"
          style={{ bottom:'-12%', right:'-12%', background:'#818cf8', filter:'blur(120px)', opacity:0.06 }}
          animate={{ scale:[1,1.1,1], y:[0,-35,0] }} transition={{ duration:11, repeat:Infinity, ease:'easeInOut', delay:3 }}
        />
        <motion.div className="absolute w-[350px] h-[350px] rounded-full"
          style={{ top:'38%', right:'18%', background:'#f472b6', filter:'blur(100px)', opacity:0.04 }}
          animate={{ scale:[1,1.2,1] }} transition={{ duration:9, repeat:Infinity, ease:'easeInOut', delay:6 }}
        />
      </div>

      {/* Horizontal scan */}
      <motion.div className="absolute inset-x-0 h-px pointer-events-none"
        style={{ background:'linear-gradient(90deg,transparent,#22d3ee45,transparent)' }}
        animate={{ top:['0%','100%'] }} transition={{ duration:9, repeat:Infinity, ease:'linear' }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* ── LEFT CONTENT ── */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">

            {/* Greeting pill */}
            <motion.div
              initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, delay:0.1, type:'spring', stiffness:110 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7"
              style={{ background:'rgba(34,211,238,0.07)', border:'1px solid rgba(34,211,238,0.2)' }}
            >
              <motion.div animate={{ rotate:[0,20,-20,0] }} transition={{ duration:3.5, repeat:Infinity }}>
                <Sparkles size={13} className="text-cyan-400" />
              </motion.div>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">Welcome · Portfolio 2025</span>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                animate={{ scale:[1,1.5,1], opacity:[1,0.4,1] }}
                transition={{ duration:1.5, repeat:Infinity }}
              />
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.9, delay:0.2, ease:[0.22,1,0.36,1] }}
            >
              <h1 className="font-black leading-[0.95] tracking-tight"
                style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(2.8rem,6.5vw,5.2rem)' }}>
                <span className="text-white block">Suraj Kumar</span>
                <span className="block mt-1">
                  <GlitchName text="Sah" />
                  <span className="text-transparent bg-clip-text animate-gradient ml-2"
                    style={{ backgroundImage:'linear-gradient(135deg,#22d3ee,#818cf8,#f472b6)', backgroundSize:'200% 200%' }}>
                    ·
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Typewriter role */}
            <motion.div
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.42, duration:0.6, ease:[0.22,1,0.36,1] }}
              className="flex items-center gap-3 mt-6 mb-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <Terminal size={15} className="text-cyan-400 flex-shrink-0" />
                <span className="text-gray-500 text-sm font-medium">I build as a</span>
                <span className="font-bold text-cyan-400 font-mono text-sm" style={{ minWidth:'15ch' }}>
                  {typedRole}
                  <motion.span
                    animate={{ opacity:[1,0] }} transition={{ duration:0.5, repeat:Infinity, repeatType:'reverse' }}
                    className="border-r-2 border-cyan-400 ml-0.5 inline-block align-middle"
                    style={{ height:'1em' }}
                  />
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.52, duration:0.7, ease:[0.22,1,0.36,1] }}
              className="text-[15px] text-gray-400 leading-relaxed mb-7 max-w-xl"
            >
              I architect{' '}<span className="text-gray-200 font-semibold">cloud-native systems</span>
              {' '}that scale, design{' '}<span className="text-gray-200 font-semibold">DevOps pipelines</span>
              {' '}that deliver, and craft{' '}<span className="text-gray-200 font-semibold">full-stack products</span>
              {' '}that users love — turning first-principles thinking into deeply{' '}
              <span className="text-cyan-400 font-medium">impactful technology</span>.
            </motion.p>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.62, duration:0.6 }}
              className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start"
            >
              {BADGES.map((b, i) => (
                <motion.span key={b.label}
                  initial={{ opacity:0, scale:0.6 }} animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.64 + i * 0.06, type:'spring', stiffness:160 }}
                  whileHover={{ scale:1.12, y:-2 }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono"
                  style={{ background:`${b.color}12`, border:`1px solid ${b.color}35`, color:b.color }}
                >
                  {b.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Contact info */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.68 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-8">
              <InfoCard icon={Mail}   label="Email"    value="surajshah72600@gmail.com" href="mailto:surajshah72600@gmail.com" delay={0.70} />
              <InfoCard icon={Phone}  label="Phone"    value="+91 9508465909"           href="tel:+919508465909"               delay={0.75} />
              <InfoCard icon={MapPin} label="Location" value="LPU, Jalandhar, Punjab"                                         delay={0.80} />
            </motion.div>

            {/* Socials + Resume */}
            <motion.div
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.88, duration:0.6 }}
              className="flex flex-wrap items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex gap-2">
                <SocialBtn href="https://github.com/suraj-kumar-shah?tab=repositories" icon={Github}   label="GitHub"     delay={0.90} color="#f1f5f9" />
                <SocialBtn href="https://www.linkedin.com/in/surajkumarsah77/"         icon={Linkedin}  label="LinkedIn"   delay={0.93} color="#60a5fa" />
                <SocialBtn href="https://leetcode.com/u/suraj-kumar-sah/"               icon={Code}      label="LeetCode"   delay={0.96} color="#fb923c" />
                <SocialBtn href="https://www.hackerrank.com/profile/surajshah72600"     icon={Award}     label="HackerRank" delay={0.99} color="#34d399" />
              </div>

              <motion.a href="/resume.pdf" download
                whileHover={{ scale:1.05, y:-3 }} whileTap={{ scale:0.96 }}
                className="relative group flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm overflow-hidden"
                style={{ background:'linear-gradient(135deg,rgba(34,211,238,0.18),rgba(129,140,248,0.15))', border:'1px solid rgba(34,211,238,0.35)', color:'#22d3ee' }}
              >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12" />
                <Download size={15} className="relative group-hover:scale-110 transition-transform" />
                <span className="relative">Download Resume</span>
                <motion.div className="relative" animate={{ x:[0,4,0] }} transition={{ duration:1.6, repeat:Infinity }}>
                  <ChevronRight size={14} />
                </motion.div>
              </motion.a>
            </motion.div>
          </div>

          {/* ── RIGHT: Profile ── */}
          <motion.div
            initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.9, delay:0.3, ease:[0.22,1,0.36,1] }}
            className="flex-shrink-0"
          >
            <ProfileImage />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gray-700">Scroll</span>
          <motion.div
            animate={{ y:[0,8,0] }} transition={{ duration:1.6, repeat:Infinity, ease:'easeInOut' }}
            className="p-2 rounded-full" style={{ border:'1px solid rgba(34,211,238,0.2)' }}
          >
            <ArrowDown size={13} className="text-cyan-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero