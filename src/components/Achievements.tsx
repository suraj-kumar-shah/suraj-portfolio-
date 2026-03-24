// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Sparkles, Trophy, Heart, Camera, Brush, Utensils, Music, Hotel,
  Car, Calendar, Church, Cake, MapPin, ShoppingCart, CreditCard,
  MessageCircle, Eye, TrendingUp, Users, Star, CheckCircle,
  Rocket, Target, Zap, ArrowRight, ExternalLink, Globe
} from 'lucide-react'


const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&display=swap');

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50%       { background-position: 100% 50%; }
    }
    .animate-gradient {
      animation: gradient-shift 4s ease infinite;
      background-size: 200% 200%;
    }
  `}</style>
)

/* ─────────────────────────────────────────────
   FIX #2 — Replace `any` props with proper interfaces
───────────────────────────────────────────── */
interface Stat {
  value: string
  numeric: number
  suffix: string
  label: string
  icon: React.ElementType
  color: string
  colorAlt: string
}

interface Service {
  name: string
  icon: React.ElementType
  color: string
}

interface Feature {
  icon: React.ElementType
  title: string
  desc: string
  color: string
}

/* ─────────────────────────────────────────────
   Animated Counter
   FIX #3 — `start: number | null` caused null arithmetic;
             replaced with sentinel value -1
───────────────────────────────────────────── */
const useCounter = (target: number, duration = 2000, active = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = -1                        // FIX #3
    const step = (ts: number) => {
      if (start === -1) start = ts        // safe sentinel check, no null arithmetic
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setCount(Math.round(ease * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

/* ─────────────────────────────────────────────
   Stat card with live counter
   FIX #8 — shimmer div was missing pointer-events-none,
             causing mouse-event interception and flicker
───────────────────────────────────────────── */
const StatCard: React.FC<{ stat: Stat; index: number; inView: boolean }> = ({ stat, index, inView }) => {
  const count = useCounter(stat.numeric, 2000, inView)
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, type: 'spring', stiffness: 110 }}
      whileHover={{ scale: 1.07, y: -6 }}
      className="relative group cursor-default"
    >
      <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg,${stat.color},${stat.colorAlt})` }} />
      <div className="relative rounded-2xl p-6 text-center overflow-hidden"
        style={{ background: 'rgba(10,14,26,0.85)', border: `1px solid ${stat.color}25`, backdropFilter: 'blur(16px)' }}>
        {/* FIX #8 — added pointer-events-none to prevent shimmer intercepting mouse events */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%,${stat.color}18,transparent 70%)` }} />
        <div className="relative mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-xl"
          style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
          <stat.icon size={24} style={{ color: stat.color }} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-4xl font-black mb-1 leading-none"
          style={{ color: stat.color, fontFamily: 'Syne,sans-serif', textShadow: `0 0 20px ${stat.color}50` }}>
          {count}{stat.suffix}
        </p>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ background: `linear-gradient(90deg,${stat.color},${stat.colorAlt})` }} />
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   3D Service Card
   FIX #1 — `cardRef.current!` hard crash → optional chaining + early return
   FIX #4/#7 — `duration-400` invalid Tailwind class → duration-300
   FIX #6 — `whileHover={{ z: 20 }}` not a valid Framer Motion value → translateZ
───────────────────────────────────────────── */
const ServiceCard: React.FC<{ service: Service; index: number; inView: boolean }> = ({ service, index, inView }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const spring = { damping: 24, stiffness: 200 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), spring)
  const [hov, setHov] = useState(false)
  const [sx, setSx] = useState(50); const [sy, setSy] = useState(50)

  const onMove = (e: React.MouseEvent) => {
    // FIX #1 — was `cardRef.current!` which throws if ref not yet attached
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    setSx(((e.clientX - r.left) / r.width) * 100)
    setSy(((e.clientY - r.top) / r.height) * 100)
  }
  const onLeave = () => { mx.set(0); my.set(0); setHov(false) }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05 + index * 0.04, type: 'spring', stiffness: 120 }}
      style={{ perspective: 700 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onLeave}
        whileHover={{ translateZ: 20 }}  // FIX #6 — `z` is not a valid Framer Motion value
        className="relative p-5 rounded-2xl text-center cursor-pointer overflow-hidden group"
        style={{
          background: 'rgba(10,14,26,0.8)',
          border: hov ? `1px solid ${service.color}45` : '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(14px)',
          boxShadow: hov ? `0 20px 40px ${service.color}15` : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{ opacity: hov ? 1 : 0, background: `radial-gradient(150px circle at ${sx}% ${sy}%,${service.color}18,transparent 70%)` }}
        />
        <div
          className="relative mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300"
          style={{ background: hov ? `${service.color}20` : `${service.color}0d`, border: `1px solid ${service.color}${hov ? '40' : '20'}` }}
        >
          <service.icon size={22} style={{ color: service.color }} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors duration-300">{service.name}</p>
        {/* FIX #4/#7 — `duration-400` does not exist in Tailwind; changed to duration-300 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
          style={{ background: `linear-gradient(90deg,transparent,${service.color},transparent)` }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────── */
const FeatureCard: React.FC<{ feature: Feature; index: number; inView: boolean }> = ({ feature, index, inView }) => {
  const [hov, setHov] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      className="relative p-6 rounded-2xl overflow-hidden cursor-default group"
      style={{
        background: 'rgba(10,14,26,0.8)',
        border: hov ? `1px solid ${feature.color}40` : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(14px)',
        boxShadow: hov ? `0 24px 48px ${feature.color}12` : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%,${feature.color}10,transparent 65%)` }} />
      <motion.div
        animate={hov ? { rotate: [0, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="p-3 rounded-xl mb-4 w-fit"
        style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}28` }}
      >
        <feature.icon size={24} style={{ color: feature.color }} />
      </motion.div>
      <h4 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors"
        style={{ fontFamily: 'Syne,sans-serif' }}>{feature.title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
        style={{ background: `linear-gradient(90deg,${feature.color},transparent)` }} />
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Achievements: React.FC = () => {
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [bodyRef, bodyInView] = useInView({ triggerOnce: true, threshold: 0.06 })

  // FIX #2 — properly typed arrays using Stat / Service / Feature interfaces
  const STATS: Stat[] = [
    { value: '11+', numeric: 11, suffix: '+', label: 'Services Offered', icon: Users, color: '#22d3ee', colorAlt: '#818cf8' },
    { value: '20+', numeric: 20, suffix: '+', label: 'Menus Per City', icon: Star, color: '#f472b6', colorAlt: '#a78bfa' },
    { value: '50+', numeric: 50, suffix: '+', label: 'Expert Vendors', icon: Trophy, color: '#34d399', colorAlt: '#22d3ee' },
    { value: '200+', numeric: 200, suffix: '+', label: 'Portfolio Images', icon: Camera, color: '#fb923c', colorAlt: '#f472b6' },
  ]

  const SERVICES: Service[] = [
    { name: 'Wedding Photography', icon: Camera, color: '#f472b6' },
    { name: 'Makeup Artist', icon: Brush, color: '#a78bfa' },
    { name: 'Wedding Decoration', icon: Sparkles, color: '#22d3ee' },
    { name: 'Catering Services', icon: Utensils, color: '#fb923c' },
    { name: 'Dance & DJ', icon: Music, color: '#34d399' },
    { name: 'Hotel & Resort', icon: Hotel, color: '#818cf8' },
    { name: 'Groom Car Booking', icon: Car, color: '#60a5fa' },
    { name: 'Pre-Wedding Services', icon: Heart, color: '#f472b6' },
    { name: 'Wedding Planning', icon: Calendar, color: '#a78bfa' },
    { name: 'Pandit Services', icon: Church, color: '#34d399' },
    { name: 'Birthday Celebrations', icon: Cake, color: '#fb923c' },
  ]

  const FEATURES: Feature[] = [
    { icon: MapPin, title: 'City-Wise Services', desc: 'Location-based filtering for hyper-local relevance and precision matching.', color: '#22d3ee' },
    { icon: ShoppingCart, title: 'Easy Booking', desc: 'Add services to cart instantly with a transparent, itemized cost estimate.', color: '#34d399' },
    { icon: CreditCard, title: 'Secure Payments', desc: 'Checkout as smooth as Amazon — multiple gateways, zero friction.', color: '#818cf8' },
    { icon: MessageCircle, title: 'Direct Contact', desc: 'One-tap WhatsApp integration connects you to vendors in seconds.', color: '#f472b6' },
    { icon: Eye, title: 'Portfolio Preview', desc: '200+ curated photos per vendor — see real work before you commit.', color: '#fb923c' },
    { icon: TrendingUp, title: '20+ Menus/City', desc: 'Curated budget-aware options tailored to every taste and style.', color: '#a78bfa' },
  ]

  const MISSION_ITEMS = ['Simple', 'Affordable', 'Transparent', 'City-specific', 'Budget-friendly']
  const PHOTO_FEATURES = [
    '10–12 distinct photography packages', '50+ experienced photographers',
    '200+ portfolio photos per vendor', 'Candid, traditional & cinematic styles',
    'Drone aerial photography available', 'Equipment rentals on request',
  ]

  return (
    <>
      {/* FIX #9 + #5 — Syne font & animate-gradient keyframe injected here */}
      <GlobalStyles />

      <section id="achievements" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-[0.06]"
            style={{ background: '#f472b6', filter: 'blur(100px)' }} />
          <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full opacity-[0.05]"
            style={{ background: '#22d3ee', filter: 'blur(90px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-[0.04]"
            style={{ background: '#a78bfa', filter: 'blur(120px)' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div ref={headerRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={headerInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.1, type: 'spring', stiffness: 170 }}
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-6"
                style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.25)' }}
              >
                <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Trophy size={13} className="text-pink-400" />
                </motion.div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-pink-400">Entrepreneurial Journey</span>
              </motion.div>

              <h2 className="font-black tracking-tight mb-5 leading-none"
                style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(3rem,7vw,5.5rem)' }}>
                {/* FIX #5 — animate-gradient now works via GlobalStyles keyframe */}
                <span className="text-transparent bg-clip-text animate-gradient"
                  style={{ backgroundImage: 'linear-gradient(135deg,#f472b6,#a78bfa,#22d3ee)' }}>
                  shaaditree.com
                </span>
              </h2>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                A <span className="text-white font-semibold">complete wedding management platform</span> — the one-stop solution transforming how India plans its most important day.
              </p>

              <div className="flex items-center justify-center gap-3 mt-8">
                <motion.div initial={{ width: 0 }} animate={headerInView ? { width: 60 } : {}}
                  transition={{ delay: 0.4, duration: 0.7 }} className="h-px"
                  style={{ background: 'linear-gradient(90deg,transparent,#f472b6)' }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-2 h-2 border border-pink-500/50 rotate-45" />
                <motion.div initial={{ width: 0 }} animate={headerInView ? { width: 60 } : {}}
                  transition={{ delay: 0.4, duration: 0.7 }} className="h-px"
                  style={{ background: 'linear-gradient(270deg,transparent,#a78bfa)' }} />
              </div>
            </motion.div>
          </div>

          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
            {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} inView={statsInView} />)}
          </div>

          <div ref={bodyRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
                style={{ background: 'rgba(10,14,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)' }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(244,114,182,0.07) 0%,transparent 55%), radial-gradient(ellipse at 80% 50%,rgba(167,139,250,0.07) 0%,transparent 55%)' }} />
                <div className="relative grid md:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}>
                        <Rocket size={24} className="text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne,sans-serif' }}>Our Vision</h3>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Where we're headed</p>
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-[15px]">
                      Shaadi Tree is built to be the{' '}
                      <span className="text-pink-400 font-semibold">single source of truth</span>
                      {' '}for every wedding decision. Categorized, transparent, and end-to-end available — no more vendor-hopping.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[
                        { label: 'Web App', color: '#22d3ee' },
                        { label: 'Mobile', color: '#34d399' },
                        { label: 'Vendor Portal', color: '#a78bfa' },
                      ].map(p => (
                        <span key={p.label} className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: `${p.color}12`, border: `1px solid ${p.color}30`, color: p.color }}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}>
                        <Target size={24} className="text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne,sans-serif' }}>Our Mission</h3>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Core principles</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5">
                      {MISSION_ITEMS.map((item, i) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={bodyInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                          whileHover={{ x: 4 }}
                          className="group flex items-center gap-3 p-3 rounded-xl transition-all"
                          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.35)' }}>
                            <CheckCircle size={12} className="text-green-400" />
                          </div>
                          <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{item}</span>
                          <ArrowRight size={12} className="text-gray-700 group-hover:text-cyan-500 ml-auto transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-16"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Syne,sans-serif' }}>Services We Offer</h3>
                <p className="text-sm text-gray-500">Every wedding need, under one roof</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {SERVICES.map((s, i) => <ServiceCard key={s.name} service={s} index={i} inView={bodyInView} />)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mb-16"
            >
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'Syne,sans-serif' }}>Platform Features</h3>
                <p className="text-sm text-gray-500">Built for couples, optimised for vendors</p>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {FEATURES.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} inView={bodyInView} />)}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-16"
            >
              <div className="relative rounded-3xl overflow-hidden p-8 md:p-10"
                style={{ background: 'rgba(10,14,26,0.8)', border: '1px solid rgba(244,114,182,0.15)', backdropFilter: 'blur(16px)' }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 0% 50%,rgba(244,114,182,0.08) 0%,transparent 50%)' }} />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-7">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(244,114,182,0.12)', border: '1px solid rgba(244,114,182,0.3)' }}>
                      <Camera size={26} className="text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne,sans-serif' }}>Wedding Photography</h3>
                      <p className="text-[11px] text-pink-400/70 font-bold uppercase tracking-widest mt-0.5">Spotlight Example</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {PHOTO_FEATURES.map((feat, i) => (
                      <motion.div
                        key={feat}
                        initial={{ opacity: 0, x: -16 }}
                        animate={bodyInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.25 + i * 0.06 }}
                        whileHover={{ x: 4 }}
                        className="group flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.35)' }}>
                          <CheckCircle size={11} className="text-pink-400" />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{feat}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {[
                {
                  icon: ShoppingCart, title: 'Customer Experience', color: '#22d3ee',
                  items: ['Portfolio images & videos', 'Price details & service notes', 'Add to cart & cost estimate', 'Easy payments like Amazon'],
                },
                {
                  icon: MessageCircle, title: 'Direct Communication', color: '#34d399',
                  items: ['WhatsApp contact on every menu', 'Direct vendor communication', 'Real-time booking confirmations', '24 / 7 customer support'],
                },
              ].map((card, ci) => (
                <motion.div
                  key={card.title}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative p-7 rounded-2xl overflow-hidden group cursor-default"
                  style={{ background: 'rgba(10,14,26,0.8)', border: `1px solid ${card.color}18`, backdropFilter: 'blur(14px)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 20%,${card.color}10,transparent 60%)` }} />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl" style={{ background: `${card.color}12`, border: `1px solid ${card.color}28` }}>
                      <card.icon size={22} style={{ color: card.color }} />
                    </div>
                    <h3 className="text-xl font-black text-white" style={{ fontFamily: 'Syne,sans-serif' }}>{card.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {card.items.map((item, ii) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -14 }}
                        animate={bodyInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 + ci * 0.1 + ii * 0.06 }}
                        whileHover={{ x: 3 }}
                        className="group/item flex items-center gap-3"
                      >
                        <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${card.color}12`, border: `1px solid ${card.color}30` }}>
                          <Zap size={10} style={{ color: card.color }} />
                        </div>
                        <span className="text-sm text-gray-400 group-hover/item:text-gray-200 transition-colors">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: `linear-gradient(90deg,${card.color},transparent)` }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-14 text-center"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm relative overflow-hidden group"
                style={{ background: 'linear-gradient(135deg,rgba(244,114,182,0.15),rgba(167,139,250,0.15))', border: '1px solid rgba(244,114,182,0.3)', color: '#f472b6' }}
              >
                {/* FIX #8 — pointer-events-none on shimmer overlay */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/6 to-transparent skew-x-12 pointer-events-none" />
                <Globe size={16} />
                <span>Explore Shaadi Tree</span>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ExternalLink size={14} />
                </motion.div>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Achievements