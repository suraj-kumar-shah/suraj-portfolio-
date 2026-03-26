import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Target, Award, Code, Cloud, Cpu, Rocket,
  GraduationCap, Quote, Sparkles, Heart, Zap,
  Star, CheckCircle2,
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
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    duration: Math.random() * 12 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.8, 1],
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
   Floating Orbs
───────────────────────────────────────── */
const FloatingOrbs = () => {
  const orbs = [
    { color: 'from-cyan-500/20 to-blue-500/10', size: 300, top: '-10%', left: '-5%', delay: 0 },
    { color: 'from-purple-500/20 to-pink-500/10', size: 250, bottom: '-10%', right: '-5%', delay: 2 },
    { color: 'from-emerald-500/20 to-teal-500/10', size: 200, top: '40%', right: '10%', delay: 4 },
  ]

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-r ${orb.color} blur-3xl`}
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            bottom: orb.bottom,
            right: orb.right,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: stat.delay, type: 'spring', stiffness: 120 }}
      whileHover={{ scale: 1.08, y: -8 }}
      className="relative group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border border-white/10 p-6 text-center backdrop-blur-sm shadow-xl`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative mx-auto mb-3 w-14 h-14 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${stat.iconBg} opacity-60 group-hover:scale-125 transition-transform duration-500`} />
          <stat.icon className="relative text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" size={28} />
        </div>

        <p className="text-4xl font-black text-white leading-none mb-1 tracking-tight">
          {isNumeric
            ? stat.suffix
              ? `${count}${stat.suffix}`
              : count % 1 !== 0
              ? stat.displayValue
              : count
            : stat.displayValue}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{stat.label}</p>

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
    <span className="text-cyan-400 font-bold">
      {displayed}
      <span className="animate-blink border-r-2 border-cyan-400 ml-0.5" />
    </span>
  )
}

/* ─────────────────────────────────────────
   Expertise Card
───────────────────────────────────────── */
const ExpertiseCard = ({ exp, index, inView }: { exp: any; index: number; inView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.5 + index * 0.1, type: 'spring', stiffness: 150 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="group relative p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/3 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
    <div className="relative flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
        <exp.icon className="text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
      </div>
      <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{exp.name}</span>
    </div>
    <span className={`relative text-[11px] font-bold px-2.5 py-1 rounded-full border ${getLevelBadge(exp.level)}`}>
      {exp.level}
    </span>
    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-colors" />
  </motion.div>
)

const getLevelBadge = (level: string) => {
  switch (level) {
    case 'Expert': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'Advanced': return 'bg-sky-500/20 text-sky-400 border-sky-500/30'
    case 'Intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

/* ─────────────────────────────────────────
   Interest Card
───────────────────────────────────────── */
const InterestCard = ({ interest, index, inView }: { interest: any; index: number; inView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
    whileHover={{ scale: 1.03, x: 5 }}
    className={`group relative flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${interest.color} border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer overflow-hidden`}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent" />
    <div className="relative p-2 rounded-lg bg-white/5 group-hover:bg-cyan-500/15 transition-colors">
      <interest.icon className="text-cyan-400 group-hover:scale-110 transition-transform" size={20} />
    </div>
    <div className="relative">
      <h4 className="font-bold text-gray-200 text-sm group-hover:text-white transition-colors">{interest.name}</h4>
      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{interest.description}</p>
    </div>
    <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-cyan-500/30 group-hover:bg-cyan-400 transition-colors" />
  </motion.div>
)

/* ─────────────────────────────────────────
   Main About Component
───────────────────────────────────────── */
const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  const stats = [
    {
      icon: GraduationCap, label: 'Academic Year', displayValue: '3rd Year', numericValue: '3',
      color: 'from-sky-900/80 to-blue-900/80',
      glow: 'from-sky-500 to-blue-500',
      iconBg: 'from-sky-400 to-blue-600',
      accent: 'from-sky-500 to-blue-500',
      delay: 0.2,
    },
    {
      icon: Award, label: 'CGPA', displayValue: '7.80', numericValue: '7.80', suffix: '',
      color: 'from-violet-900/80 to-purple-900/80',
      glow: 'from-violet-500 to-purple-500',
      iconBg: 'from-violet-400 to-purple-600',
      accent: 'from-violet-500 to-purple-500',
      delay: 0.3,
    },
    {
      icon: Code, label: 'Projects Built', displayValue: '8+', numericValue: '8', suffix: '+',
      color: 'from-emerald-900/80 to-green-900/80',
      glow: 'from-emerald-500 to-green-500',
      iconBg: 'from-emerald-400 to-green-600',
      accent: 'from-emerald-500 to-green-500',
      delay: 0.4,
    },
    {
      icon: Cloud, label: 'Certifications', displayValue: '6+', numericValue: '6', suffix: '+',
      color: 'from-orange-900/80 to-rose-900/80',
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
    { icon: Shield, name: 'Cloud Security', level: 'Advanced', color: 'from-sky-500/10 to-blue-500/5' },
    { icon: Database, name: 'Database Design', level: 'Expert', color: 'from-violet-500/10 to-purple-500/5' },
    { icon: Terminal, name: 'Shell Scripting', level: 'Advanced', color: 'from-emerald-500/10 to-green-500/5' },
    { icon: Layers, name: 'Microservices', level: 'Intermediate', color: 'from-orange-500/10 to-rose-500/5' },
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
      style={{ background: 'radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #050510 100%)' }}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        <FloatingOrbs />
        <ParticleField />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 shadow-lg shadow-cyan-500/20"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
              <Sparkles size={13} className="text-cyan-400" />
            </motion.div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">The Human Behind The Code</span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-5 leading-none">
            <span className="text-white">Who</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 animate-gradient">
              Am I?
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            A relentless builder who turns bold ideas into elegant, 
            <span className="text-white font-medium"> production-ready systems</span>.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500/60" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-2 h-2 border border-cyan-500/60 rotate-45"
            />
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500/60" />
          </div>
        </motion.div>

        <div ref={ref}>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-20">
            {stats.map(stat => <StatCard key={stat.label} stat={stat} inView={inView} />)}
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* LEFT column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Career Objective */}
              <div className="relative rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all duration-500 group overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />

                <div className="flex items-center gap-4 mb-7">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30"
                  >
                    <Target className="text-cyan-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Career Objective</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">What drives me forward</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-[15px] mb-4">
                  I'm on a mission to secure a transformative role as a{' '}
                  <TypewriterText words={roles} />{' '}
                  within a forward-thinking organization — where I can architect cloud-native solutions, 
                  craft robust backend systems, and turn first-principles thinking into scalable, 
                  <span className="text-cyan-400 font-medium"> deeply impactful technology</span>.
                </p>

                <p className="text-gray-400 leading-relaxed text-sm">
                  My goal isn't just to write code — it's to build systems that <em>outlive trends</em> and teams that grow stronger around them.
                </p>

                <div className="relative mt-6 p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/5 border border-cyan-500/20">
                  <Quote size={18} className="text-cyan-400/70 absolute top-3 left-3" />
                  <p className="text-gray-400 italic pl-5 text-sm leading-relaxed">
                    "The best engineers don't just solve today's problems — they design tomorrow's possibilities."
                  </p>
                </div>
              </div>

              {/* Core Expertise */}
              <div className="relative rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-violet-500/5" />

                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: -15, scale: 1.1 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30"
                  >
                    <Star className="text-violet-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Core Expertise</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Where I excel most</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {expertise.map((exp, i) => <ExpertiseCard key={exp.name} exp={exp} index={i} inView={inView} />)}
                </div>
              </div>
            </motion.div>

            {/* RIGHT column */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Areas of Interest */}
              <div className="relative rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30"
                  >
                    <Heart className="text-rose-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Areas of Passion</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Domains that light me up</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interests.map((item, i) => <InterestCard key={item.name} interest={item} index={i} inView={inView} />)}
                </div>
              </div>

              {/* Quick Facts */}
              <div className="relative rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
                  >
                    <Zap className="text-amber-400" size={26} />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Fast Facts</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Snapshot of who I am</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {quickFacts.map((fact, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.06 }}
                      whileHover={{ x: 5 }}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default"
                    >
                      <div className="relative flex-shrink-0 p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                        <fact.icon size={14} className="text-cyan-400" />
                      </div>
                      <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors leading-tight">{fact.text}</span>
                      <CheckCircle2 size={13} className="text-cyan-500/0 group-hover:text-cyan-500/60 transition-all ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          Philosophy Banner
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 group cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/80 via-violet-950/60 to-sky-950/80" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }} />
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              <div className="relative z-10 p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block mb-5"
                >
                  <Quote size={40} className="text-cyan-400/60 mx-auto" />
                </motion.div>

                <p className="text-white text-xl md:text-2xl leading-relaxed mb-7 font-light max-w-3xl mx-auto">
                  "I don't just write code — I craft{' '}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 animate-gradient">
                    living systems
                  </span>
                  {' '}that solve real problems, scale under pressure, and stand the test of time."
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/70" />
                  <span className="text-cyan-400 font-bold text-sm tracking-wide">— Suraj Kumar Sah</span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/70" />
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-gray-500">
                  {['Code.', 'Architect.', 'Innovate.', 'Impact.'].map((word, i) => (
                    <React.Fragment key={word}>
                      <span className="text-xs font-semibold uppercase tracking-widest hover:text-cyan-400 transition-colors cursor-default">{word}</span>
                      {i < 3 && <span className="text-cyan-800">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.9s step-end infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 5s ease infinite;
        }
      `}</style>
    </section>
  )
}

export default About