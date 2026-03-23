import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  User, Target, BookOpen, Award, Code, Cloud, Cpu, Rocket,
  GraduationCap, MapPin, Calendar, Quote, Sparkles, Heart, Zap,
  Star, TrendingUp, Briefcase, Coffee, Smile, CheckCircle2,
  Layers, GitBranch, Terminal, Database, Shield, Users
} from 'lucide-react'

/* ─────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────── */
const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

/* ─────────────────────────────────────────
   Particle Field Background
───────────────────────────────────────── */
const ParticleField = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Stat Card with Counter
───────────────────────────────────────── */
const StatCard = ({ stat, inView }: { stat: any; inView: boolean }) => {
  const isNumeric = !isNaN(parseFloat(stat.numericValue))
  const count = useCounter(parseFloat(stat.numericValue) || 0, 2200, inView)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: stat.delay, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.08, y: -8, rotateY: 5 }}
      className="relative group cursor-pointer"
      style={{ perspective: 800 }}
    >
      {/* Glow ring */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${stat.glow} rounded-2xl opacity-0 group-hover:opacity-60 blur-sm transition-all duration-500`} />

      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5 p-6 text-center backdrop-blur-sm`}>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12" />

        {/* Icon halo */}
        <div className="relative mx-auto mb-3 w-14 h-14 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.iconBg} opacity-40 group-hover:scale-125 transition-transform duration-500`} />
          <stat.icon className="relative text-primary-300 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" size={28} />
        </div>

        {/* Value */}
        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-primary-300 leading-none mb-1 tracking-tight">
          {isNumeric
            ? stat.suffix
              ? `${count}${stat.suffix}`
              : count % 1 !== 0
              ? stat.displayValue
              : count
            : stat.displayValue}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">{stat.label}</p>

        {/* Bottom accent bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Typewriter Text
───────────────────────────────────────── */
const TypewriterText = ({ words }: { words: string[] }) => {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWord]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setCurrentWord((currentWord + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, currentWord, words])

  return (
    <span className="text-primary-400 font-bold">
      {displayed}
      <span className="animate-blink border-r-2 border-primary-400 ml-0.5" />
    </span>
  )
}

/* ─────────────────────────────────────────
   Skill Orb
───────────────────────────────────────── */
const SkillOrb = ({ exp, index, inView }: { exp: any; index: number; inView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -20 }}
    animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.5 + index * 0.12, type: 'spring', stiffness: 150 }}
    whileHover={{ scale: 1.06, rotateZ: 2 }}
    className="group relative p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-primary-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
    <div className="relative flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors">
        <exp.icon className="text-primary-400 group-hover:scale-110 transition-transform" size={17} />
      </div>
      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{exp.name}</span>
    </div>
    <span className={`relative text-[11px] font-bold px-2.5 py-1 rounded-full border ${getLevelBadge(exp.level)}`}>
      {exp.level}
    </span>

    {/* Corner accent */}
    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary-500/40 group-hover:bg-primary-400 transition-colors" />
  </motion.div>
)

const getLevelBadge = (level: string) => {
  switch (level) {
    case 'Expert': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
    case 'Advanced': return 'bg-sky-500/15 text-sky-400 border-sky-500/25'
    case 'Intermediate': return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
    default: return 'bg-gray-500/15 text-gray-400 border-gray-500/25'
  }
}

/* ─────────────────────────────────────────
   Main About Component
───────────────────────────────────────── */
const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.06 })
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])
  const smoothParallax = useSpring(parallaxY, { stiffness: 40, damping: 20 })

  const stats = [
    {
      icon: GraduationCap, label: 'Academic Year', displayValue: '3rd Year', numericValue: '3',
      color: 'from-sky-950/80 to-blue-950/60',
      glow: 'from-sky-500 to-blue-500',
      iconBg: 'from-sky-400 to-blue-600',
      accent: 'from-sky-500 to-blue-500',
      delay: 0.2,
    },
    {
      icon: Award, label: 'CGPA', displayValue: '7.80', numericValue: '7.80', suffix: '',
      color: 'from-violet-950/80 to-purple-950/60',
      glow: 'from-violet-500 to-purple-500',
      iconBg: 'from-violet-400 to-purple-600',
      accent: 'from-violet-500 to-purple-500',
      delay: 0.3,
    },
    {
      icon: Code, label: 'Projects Built', displayValue: '8+', numericValue: '8', suffix: '+',
      color: 'from-emerald-950/80 to-green-950/60',
      glow: 'from-emerald-500 to-green-500',
      iconBg: 'from-emerald-400 to-green-600',
      accent: 'from-emerald-500 to-green-500',
      delay: 0.4,
    },
    {
      icon: Cloud, label: 'Certifications', displayValue: '6+', numericValue: '6', suffix: '+',
      color: 'from-orange-950/80 to-rose-950/60',
      glow: 'from-orange-500 to-rose-500',
      iconBg: 'from-orange-400 to-rose-600',
      accent: 'from-orange-500 to-rose-500',
      delay: 0.5,
    },
  ]

  const interests = [
    { icon: Cloud, name: 'Cloud Computing', description: 'AWS · Azure · GCP', color: 'from-sky-500/10 to-blue-500/5' },
    { icon: Cpu, name: 'AI / ML Engineering', description: 'Deep Learning · LLMs', color: 'from-violet-500/10 to-purple-500/5' },
    { icon: Rocket, name: 'System Design', description: 'Scalable Architecture', color: 'from-orange-500/10 to-rose-500/5' },
    { icon: GitBranch, name: 'DevOps & CI/CD', description: 'Docker · Kubernetes', color: 'from-emerald-500/10 to-green-500/5' },
  ]

  const expertise = [
    { icon: Shield, name: 'Cloud Security', level: 'Advanced', color: 'from-sky-500/8 to-blue-500/4' },
    { icon: Database, name: 'Database Design', level: 'Expert', color: 'from-violet-500/8 to-purple-500/4' },
    { icon: Terminal, name: 'Shell Scripting', level: 'Advanced', color: 'from-emerald-500/8 to-green-500/4' },
    { icon: Layers, name: 'Microservices', level: 'Intermediate', color: 'from-orange-500/8 to-rose-500/4' },
  ]

  const quickFacts = [
    { text: 'Obsessed with cloud architecture & distributed systems', icon: Cloud },
    { text: 'Full-stack craftsman — from pixels to pipelines', icon: Code },
    { text: 'Relentless problem-solver with an engineer\'s mind', icon: Zap },
    { text: 'Collaborative by nature, independent by discipline', icon: Users },
    { text: 'Active open-source contributor & community builder', icon: GitBranch },
    { text: 'Technology visionary chasing meaningful impact', icon: Sparkles },
  ]

  const roles = ['Cloud Engineer', 'Full Stack Developer', 'System Architect', 'DevOps Engineer']

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-28 relative overflow-hidden"
    >
      {/* ── Global styles ── */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .animate-blink { animation: blink 0.9s step-end infinite; }
        @keyframes floatA { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-28px) rotate(4deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-18px) rotate(-3deg)} }
        @keyframes orbPulse { 0%,100%{transform:scale(1);opacity:0.06} 50%{transform:scale(1.15);opacity:0.12} }
        .float-a { animation: floatA 8s ease-in-out infinite; }
        .float-b { animation: floatB 11s ease-in-out infinite; }
        .orb-pulse { animation: orbPulse 6s ease-in-out infinite; }
        @keyframes gradientShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { background-size: 200% 200%; animation: gradientShift 5s ease infinite; }
        .glass-card {
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .noise-overlay::before {
          content:'';
          position:absolute;inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;opacity:0.4;border-radius:inherit;
        }
      `}</style>

      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Orbs */}
        <div className="absolute top-1/4 left-8 w-[500px] h-[500px] rounded-full bg-primary-600 orb-pulse blur-[120px]" />
        <div className="absolute bottom-1/4 right-8 w-[400px] h-[400px] rounded-full bg-violet-700 orb-pulse blur-[100px]" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-sky-700 orb-pulse blur-[80px]" style={{ animationDelay: '1.5s' }} />

        {/* Particles */}
        <ParticleField />

        {/* Scanline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          {/* Pill badge */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 160 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary-500/25 bg-primary-500/8 mb-6 shadow-lg shadow-primary-500/10"
          >
            <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Sparkles size={13} className="text-primary-400" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-400">The Human Behind The Code</span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-5 leading-none">
            <span className="text-white">Who</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-violet-400 to-sky-400 animate-gradient">
              Am I?
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed font-light">
            A relentless builder who turns bold ideas into elegant, 
            <span className="text-gray-200 font-medium"> production-ready systems</span>.
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary-500/60" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-2 h-2 border border-primary-500/60 rotate-45"
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary-500/60" />
          </div>
        </motion.div>

        <div ref={ref}>
          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20">
            {stats.map(stat => <StatCard key={stat.label} stat={stat} inView={inView} />)}
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* ── LEFT column ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Career Objective */}
              <div className="glass-card noise-overlay relative rounded-3xl p-8 hover:border-primary-500/20 transition-all duration-500 group overflow-hidden">
                {/* Floating icon bg */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors float-a" />

                <div className="flex items-center gap-4 mb-7">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/20"
                  >
                    <Target className="text-primary-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Career Objective</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">What drives me forward</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-[15px] mb-2">
                  I'm on a mission to secure a transformative role as a{' '}
                  <TypewriterText words={roles} />{' '}
                  within a forward-thinking organization — where I can architect cloud-native solutions, 
                  craft robust backend systems, and turn first-principles thinking into scalable, 
                  <span className="text-primary-400 font-medium"> deeply impactful technology</span>.
                </p>

                <p className="text-gray-400 leading-relaxed text-sm mt-4">
                  My goal isn't just to write code — it's to build systems that <em>outlive trends</em> and teams that grow stronger around them.
                </p>

                {/* Quote box */}
                <div className="relative mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary-500/6 to-violet-500/4 border border-primary-500/12">
                  <Quote size={18} className="text-primary-400/50 absolute top-3 left-3" />
                  <p className="text-gray-400 italic pl-5 text-sm leading-relaxed">
                    "The best engineers don't just solve today's problems — they design tomorrow's possibilities."
                  </p>
                </div>
              </div>

              {/* Core Expertise */}
              <div className="glass-card noise-overlay relative rounded-3xl p-8 hover:border-primary-500/20 transition-all duration-500 overflow-hidden">
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-500/5 float-b" />

                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: -15 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/20"
                  >
                    <Star className="text-violet-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Core Expertise</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Where I excel most</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {expertise.map((exp, i) => <SkillOrb key={exp.name} exp={exp} index={i} inView={inView} />)}
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT column ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Areas of Interest */}
              <div className="glass-card noise-overlay relative rounded-3xl p-8 hover:border-primary-500/20 transition-all duration-500 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/20"
                  >
                    <Heart className="text-rose-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Areas of Passion</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Domains that light me up</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                      whileHover={{ scale: 1.04, y: -3 }}
                      className={`group relative flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br ${item.color} border border-white/6 hover:border-primary-500/30 transition-all cursor-pointer overflow-hidden`}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/3 to-transparent" />
                      <div className="relative p-2 rounded-xl bg-white/5 group-hover:bg-primary-500/15 transition-colors">
                        <item.icon className="text-primary-400 group-hover:scale-110 transition-transform" size={19} />
                      </div>
                      <div className="relative">
                        <h4 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{item.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{item.description}</p>
                      </div>
                      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-primary-500/30 group-hover:bg-primary-400 transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Facts */}
              <div className="glass-card noise-overlay relative rounded-3xl p-8 hover:border-primary-500/20 transition-all duration-500 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/20"
                  >
                    <Zap className="text-amber-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Fast Facts</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Snapshot of who I am</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {quickFacts.map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -25 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.45, delay: 0.7 + i * 0.06 }}
                      whileHover={{ x: 4 }}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/4 transition-all cursor-default"
                    >
                      {/* Icon dot */}
                      <div className="relative flex-shrink-0 p-1.5 rounded-lg bg-primary-500/8 group-hover:bg-primary-500/18 transition-colors">
                        <fact.icon size={14} className="text-primary-400" />
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">{fact.text}</span>
                      <CheckCircle2 size={13} className="text-primary-500/0 group-hover:text-primary-500/60 transition-all ml-auto flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Philosophy Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-3xl border border-primary-500/15 group cursor-default">
              {/* Gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-violet-950/60 to-sky-950/80" />

              {/* Animated mesh */}
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.25) 0%, transparent 60%)' }} />

              {/* Shimmer on hover */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Decorative circles */}
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-primary-500/10 float-a" />
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-violet-500/10 float-b" />

              {/* Content */}
              <div className="relative z-10 p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block mb-5"
                >
                  <Quote size={36} className="text-primary-400/60 mx-auto" />
                </motion.div>

                <p className="text-gray-100 text-xl md:text-2xl leading-relaxed mb-7 font-light max-w-3xl mx-auto">
                  "I don't just write code — I craft{' '}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-violet-400 animate-gradient">
                    living systems
                  </span>
                  {' '}that solve real problems, scale under pressure, and stand the test of time."
                </p>

                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    className="h-px w-16 bg-gradient-to-r from-transparent to-primary-500/70"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  />
                  <span className="text-primary-400 font-bold text-sm tracking-wide">— Suraj Kumar Sah</span>
                  <motion.div
                    className="h-px w-16 bg-gradient-to-l from-transparent to-primary-500/70"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  />
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-gray-600">
                  {['Code.', 'Architect.', 'Innovate.', 'Impact.'].map((word, i) => (
                    <React.Fragment key={word}>
                      <span className="text-xs font-semibold uppercase tracking-widest hover:text-primary-400 transition-colors cursor-default">{word}</span>
                      {i < 3 && <span className="text-primary-800">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About