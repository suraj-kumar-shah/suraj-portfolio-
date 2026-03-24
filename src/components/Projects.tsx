import React, { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Github, ExternalLink, Brain, Home, GraduationCap,
  Users, Shield, BarChart3, Sparkles, Star, Zap,
  ChevronRight, ArrowUpRight, Code2, Layers
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 0,
    title: 'Google Play Store Insights',
    subtitle: 'ML Prediction Engine',
    description: 'Engineered a predictive framework analyzing app success factors. Random Forest algorithms achieved 94% accuracy in performance forecasting across 2M+ data points.',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop',
    tech: ['Python', 'Random Forest', 'Scikit-learn', 'Pandas'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: '94% Accuracy',
    badgeColor: '#34d399',
    accent: '#a78bfa',
    accentAlt: '#f472b6',
    tag: 'Machine Learning',
  },
  {
    id: 1,
    title: 'Real Estate AI Chatbot',
    subtitle: 'NLP Analytics Platform',
    description: 'AI-driven conversational agent providing real-time market insights and property valuation trends through advanced natural language processing and semantic search.',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
    tech: ['Python', 'Dialogflow', 'NLP', 'FastAPI'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: 'AI Powered',
    badgeColor: '#22d3ee',
    accent: '#22d3ee',
    accentAlt: '#818cf8',
    tag: 'Artificial Intelligence',
  },
  {
    id: 2,
    title: 'Padhega – EdTech Platform',
    subtitle: 'Full Stack Education App',
    description: 'Student-centric educational platform with interactive learning modules, real-time analytics, and personalized adaptive authentication serving 5000+ active learners.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop',
    tech: ['React', 'Firebase', 'Node.js', 'MongoDB'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: '5000+ Users',
    badgeColor: '#4ade80',
    accent: '#4ade80',
    accentAlt: '#22d3ee',
    tag: 'Full Stack',
  },
  {
    id: 3,
    title: 'Human Action Classifier',
    subtitle: 'Smart Home AI System',
    description: 'Detection system for smart home environments classifying human behavior patterns with 92% precision using multivariate sensor fusion and supervised learning.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=500&fit=crop',
    tech: ['Python', 'TensorFlow', 'Sensor Fusion', 'SVM'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: '92% Precision',
    badgeColor: '#fb923c',
    accent: '#fb923c',
    accentAlt: '#f472b6',
    tag: 'Deep Learning',
  },
  {
    id: 4,
    title: 'Payment Fraud Detector',
    subtitle: 'XGBoost REST API',
    description: 'High-performance ML API using XGBoost to identify fraudulent transaction patterns in real time, reducing financial exposure by 35% for enterprise clients.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=500&fit=crop',
    tech: ['XGBoost', 'FastAPI', 'Docker', 'Redis'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: '35% Risk Reduction',
    badgeColor: '#f472b6',
    accent: '#f472b6',
    accentAlt: '#818cf8',
    tag: 'FinTech · Security',
  },
  {
    id: 5,
    title: 'Unemployment Dashboard',
    subtitle: 'Real-time Data Viz',
    description: 'Comprehensive D3.js-powered dashboard tracking unemployment metrics and demographic trends across 50+ regions with live data pipeline and interactive filters.',
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    tech: ['React', 'D3.js', 'Python', 'Tableau'],
    github: 'https://github.com/suraj-kumar-shah',
    live: '#',
    badge: 'Real-time',
    badgeColor: '#818cf8',
    accent: '#818cf8',
    accentAlt: '#60a5fa',
    tag: 'Data Visualization',
  },
]

/* ─────────────────────────────────────────────
   Magnetic 3D Card
───────────────────────────────────────────── */
interface CardProps { project: typeof PROJECTS[0]; index: number; inView: boolean }

const ProjectCard: React.FC<CardProps> = ({ project, index, inView }) => {
  const cardRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [spotX,   setSpotX]   = useState(50)
  const [spotY,   setSpotY]   = useState(50)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { damping: 22, stiffness: 180 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), spring)
  const shineX = useSpring(useTransform(mx, [-0.5, 0.5], [-40, 40]), spring)
  const shineY = useSpring(useTransform(my, [-0.5, 0.5], [-40, 40]), spring)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width  - 0.5
    const ny = (e.clientY - rect.top)  / rect.height - 0.5
    mx.set(nx); my.set(ny)
    setSpotX(((e.clientX - rect.left) / rect.width)  * 100)
    setSpotY(((e.clientY - rect.top)  / rect.height) * 100)
  }, [mx, my])

  const onMouseLeave = useCallback(() => {
    mx.set(0); my.set(0)
    setHovered(false)
  }, [mx, my])

  const Icon = project.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
      className="relative"
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        whileHover={{ z: 30 }}
      >
        {/* ── Glow border ── */}
        <div
          className="absolute -inset-px rounded-2xl transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: `linear-gradient(135deg, ${project.accent}60, ${project.accentAlt}40)`,
            filter: 'blur(1px)',
          }}
        />

        {/* ── Card body ── */}
        <div
          className="relative rounded-2xl overflow-hidden border"
          style={{
            background: 'rgba(10,15,28,0.85)',
            backdropFilter: 'blur(20px)',
            borderColor: hovered ? `${project.accent}40` : 'rgba(255,255,255,0.07)',
            boxShadow: hovered
              ? `0 30px 60px ${project.accent}20, 0 0 0 1px ${project.accent}20`
              : '0 4px 24px rgba(0,0,0,0.4)',
            transition: 'border-color 0.4s, box-shadow 0.4s',
          }}
        >
          {/* Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(280px circle at ${spotX}% ${spotY}%, ${project.accent}18, transparent 70%)`,
            }}
          />

          {/* ── Image area ── */}
          <div className="relative overflow-hidden h-52">
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{ scale: hovered ? 1.08 : 1, transition: 'scale 0.6s ease' }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, transparent 30%, rgba(10,15,28,0.95) 100%)` }}
            />

            {/* Shine layer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
                x: shineX, y: shineY,
                opacity: hovered ? 1 : 0,
              }}
            />

            {/* Tag pill */}
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: `${project.accent}20`,
                border: `1px solid ${project.accent}40`,
                color: project.accent,
                backdropFilter: 'blur(8px)',
              }}
            >
              {project.tag}
            </div>

            {/* Floating icon */}
            <motion.div
              className="absolute top-3 right-3 p-2.5 rounded-xl"
              style={{
                background: 'rgba(10,15,28,0.75)',
                border: `1px solid ${project.accent}30`,
                backdropFilter: 'blur(8px)',
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
            >
              <Icon size={18} style={{ color: project.accent }} />
            </motion.div>

            {/* Badge */}
            <motion.div
              className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${project.badgeColor}18`,
                border: `1px solid ${project.badgeColor}40`,
                color: project.badgeColor,
                backdropFilter: 'blur(8px)',
              }}
              animate={hovered ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap size={10} style={{ color: project.badgeColor }} />
              {project.badge}
            </motion.div>
          </div>

          {/* ── Content ── */}
          <div className="p-6">
            {/* Title row */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1"
                  style={{ color: project.accent + 'aa' }}
                >
                  {project.subtitle}
                </p>
                <h3
                  className="text-xl font-black leading-tight transition-colors duration-300"
                  style={{ color: hovered ? project.accent : '#f1f5f9', fontFamily: 'Syne,sans-serif' }}
                >
                  {project.title}
                </h3>
              </div>

              <motion.div
                animate={{ rotate: hovered ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-1.5 rounded-lg flex-shrink-0 mt-1"
                style={{ background: `${project.accent}15`, border: `1px solid ${project.accent}25` }}
              >
                <ArrowUpRight size={14} style={{ color: project.accent }} />
              </motion.div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + i * 0.04, duration: 0.3, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -1 }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono transition-all"
                  style={{
                    background: `${project.accent}10`,
                    border: `1px solid ${project.accent}25`,
                    color: project.accent + 'cc',
                  }}
                >
                  {t}
                </motion.span>
              ))}
            </div>

            {/* Divider */}
            <div
              className="h-px mb-4 transition-all duration-500"
              style={{
                background: hovered
                  ? `linear-gradient(90deg, ${project.accent}60, ${project.accentAlt}40, transparent)`
                  : 'rgba(255,255,255,0.06)',
              }}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: `${project.accent}12`,
                  border: `1px solid ${project.accent}25`,
                  color: project.accent,
                }}
              >
                <Github size={13} />
                Source Code
              </motion.a>

              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: `${project.accentAlt}12`,
                  border: `1px solid ${project.accentAlt}25`,
                  color: project.accentAlt,
                }}
              >
                <ExternalLink size={13} />
                Live Demo
                <ChevronRight size={11} className="opacity-60" />
              </motion.a>

              {/* Star */}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                className="ml-auto p-2 rounded-xl transition-all"
                style={{ background: 'rgba(255,200,50,0.08)', border: '1px solid rgba(255,200,50,0.15)' }}
              >
                <Star size={14} className="text-yellow-400" />
              </motion.button>
            </div>
          </div>

          {/* Corner accent */}
          <div
            className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none transition-opacity duration-500"
            style={{
              opacity: hovered ? 0.6 : 0,
              background: `radial-gradient(circle at 100% 100%, ${project.accent}25, transparent 70%)`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Featured wide card (first project)
───────────────────────────────────────────── */
const FeaturedCard: React.FC<{ project: typeof PROJECTS[0]; inView: boolean }> = ({ project, inView }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [spotX, setSpotX] = useState(50)
  const [spotY, setSpotY] = useState(50)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { damping: 22, stiffness: 150 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), spring)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), spring)
  const Icon = project.icon

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
    setSpotX(((e.clientX - rect.left) / rect.width) * 100)
    setSpotY(((e.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000, gridColumn: '1 / -1' }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { mx.set(0); my.set(0); setHovered(false) }}
        className="relative rounded-3xl overflow-hidden cursor-pointer"
      >
        {/* Outer glow */}
        <motion.div
          className="absolute -inset-1 rounded-3xl pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `linear-gradient(135deg, ${project.accent}40, ${project.accentAlt}25)`, filter: 'blur(2px)' }}
        />

        <div
          className="relative rounded-3xl overflow-hidden border"
          style={{
            background: 'rgba(8,12,22,0.9)',
            backdropFilter: 'blur(24px)',
            borderColor: hovered ? `${project.accent}40` : 'rgba(255,255,255,0.07)',
            boxShadow: hovered ? `0 40px 80px ${project.accent}15` : '0 8px 40px rgba(0,0,0,0.5)',
            transition: 'all 0.5s ease',
          }}
        >
          {/* Spotlight */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              opacity: hovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${spotX}% ${spotY}%, ${project.accent}14, transparent 70%)`,
              transition: 'opacity 0.3s',
            }}
          />

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative overflow-hidden h-64 md:h-auto">
              <motion.img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                style={{ scale: hovered ? 1.06 : 1, transition: 'scale 0.7s ease' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(8,12,22,0.95) 100%)' }} />
              <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(8,12,22,0.97) 100%)' }} />

              {/* Floating icon */}
              <motion.div
                className="absolute top-5 left-5 p-3 rounded-2xl"
                style={{ background: 'rgba(8,12,22,0.8)', border: `1px solid ${project.accent}35`, backdropFilter: 'blur(10px)' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon size={24} style={{ color: project.accent }} />
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="section-pill" style={{ color: project.accent, borderColor: `${project.accent}30`, background: `${project.accent}08` }}>
                  {project.tag}
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${project.badgeColor}15`, border: `1px solid ${project.badgeColor}35`, color: project.badgeColor }}
                >
                  <Zap size={10} />
                  {project.badge}
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: project.accent + '90' }}>
                {project.subtitle}
              </p>
              <h3 className="text-3xl font-black mb-3 leading-tight" style={{ fontFamily: 'Syne,sans-serif', color: hovered ? project.accent : '#f1f5f9', transition: 'color 0.3s' }}>
                {project.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map(t => (
                  <span key={t}
                    className="px-3 py-1 rounded-full text-xs font-semibold font-mono"
                    style={{ background: `${project.accent}10`, border: `1px solid ${project.accent}25`, color: project.accent + 'cc' }}
                  >{t}</span>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: `${project.accent}15`, border: `1px solid ${project.accent}30`, color: project.accent }}
                >
                  <Github size={15} /> Source Code
                </motion.a>
                <motion.a href={project.live} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: `linear-gradient(135deg,${project.accent}25,${project.accentAlt}20)`, border: `1px solid ${project.accentAlt}30`, color: project.accentAlt }}
                >
                  <ExternalLink size={15} /> Live Demo
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Section header
───────────────────────────────────────────── */
const SectionHeader: React.FC<{ inView: boolean }> = ({ inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-20"
  >
    {/* Pill */}
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={inView ? { scale: 1, rotate: 0 } : {}}
      transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
      style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
    >
      <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <Sparkles size={13} className="text-cyan-400" />
      </motion.div>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Featured Work</span>
    </motion.div>

    {/* Title */}
    <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-none" style={{ fontFamily: 'Syne,sans-serif' }}>
      <span className="text-white">My </span>
      <span className="text-transparent bg-clip-text animate-gradient"
        style={{ backgroundImage: 'linear-gradient(135deg,#22d3ee,#818cf8,#f472b6)', backgroundSize: '200% 200%' }}>
        Projects
      </span>
    </h2>

    <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
      Real-world systems I've engineered — from ML pipelines to{' '}
      <span className="text-gray-300 font-medium">full-stack platforms</span>.
    </p>

    {/* Animated line */}
    <div className="flex items-center justify-center gap-3 mt-8">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: 60 } : {}}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #22d3ee)' }}
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="w-2 h-2 border border-cyan-500/50 rotate-45"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: 60 } : {}}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="h-px"
        style={{ background: 'linear-gradient(270deg, transparent, #818cf8)' }}
      />
    </div>
  </motion.div>
)

/* ─────────────────────────────────────────────
   Stats bar
───────────────────────────────────────────── */
const StatsBar: React.FC<{ inView: boolean }> = ({ inView }) => {
  const stats = [
    { label: 'Projects Built', value: '6+', icon: Layers },
    { label: 'Technologies', value: '20+', icon: Code2 },
    { label: 'ML Accuracy', value: '94%', icon: Zap },
    { label: 'Active Users', value: '5k+', icon: Users },
  ]
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 140 }}
          whileHover={{ scale: 1.06, y: -4 }}
          className="text-center p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <s.icon size={20} className="text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white mb-0.5" style={{ fontFamily: 'Syne,sans-serif' }}>{s.value}</p>
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Projects: React.FC = () => {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [gridRef,   gridInView]   = useInView({ triggerOnce: true, threshold: 0.06 })

  const featured = PROJECTS[0]
  const rest     = PROJECTS.slice(1)

  return (
    <section id="projects" className="py-28 relative overflow-hidden">
      {/* Section ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: '#a78bfa', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: '#22d3ee', filter: 'blur(80px)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef}>
          <SectionHeader inView={headerInView} />
          <StatsBar inView={headerInView} />
        </div>

        {/* Projects */}
        <div ref={gridRef}>
          {/* Featured (full width) */}
          <div className="mb-6">
            <FeaturedCard project={featured} inView={gridInView} />
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rest.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i + 1} inView={gridInView} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(129,140,248,0.15))',
              border: '1px solid rgba(34,211,238,0.3)',
              color: '#22d3ee',
            }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/6 to-transparent skew-x-12" />
            <Sparkles size={16} />
            <span>Let's Build Something Together</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronRight size={16} />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects