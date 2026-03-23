import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, Download, Code2, Flame, Zap } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface NavbarProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

/* ── Magnetic button wrapper ─────────────────────────────── */
const MagneticBtn: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; href?: string; download?: boolean; strength?: number }> =
  ({ children, className, style, onClick, href, download, strength = 0.35 }) => {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0), y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 200, damping: 18 })
    const sy = useSpring(y, { stiffness: 200, damping: 18 })

    const onMove = (e: React.MouseEvent) => {
      const r = ref.current!.getBoundingClientRect()
      x.set((e.clientX - r.left - r.width / 2) * strength)
      y.set((e.clientY - r.top - r.height / 2) * strength)
    }
    const onLeave = () => { x.set(0); y.set(0) }

    const inner = (
      <motion.div ref={ref} style={{ x: sx, y: sy, ...style }}
        onMouseMove={onMove} onMouseLeave={onLeave}
        onClick={onClick}
        className={className}
        whileTap={{ scale: 0.94 }}
      >
        {children}
      </motion.div>
    )

    if (href) return (
      <a href={href} download={download} style={{ display: 'contents' }}>
        {inner}
      </a>
    )
    return inner
  }

/* ── Lava particle burst (on logo hover) ─────────────────── */
const LavaBurst: React.FC<{ active: boolean }> = ({ active }) => {
  const sparks = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    dist: 24 + Math.random() * 16,
    color: ['#ff4500', '#ff6b00', '#ffaa00', '#ffd700'][i % 4],
    size: 1.5 + Math.random() * 2,
  }))
  return (
    <AnimatePresence>
      {active && sparks.map((s, i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: s.size, height: s.size, background: s.color, top: '50%', left: '50%', zIndex: 20 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
            y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
            opacity: 0, scale: 0,
          }}
          exit={{}}
          transition={{ duration: 0.55, delay: i * 0.02, ease: [0.2, 0.8, 0.4, 1] }}
        />
      ))}
    </AnimatePresence>
  )
}

/* ── 3D Nav item ─────────────────────────────────────────── */
const NavItem: React.FC<{ item: { name: string; href: string; icon: any }; active: boolean; index: number }> =
  ({ item, active, index }) => {
    const [hovered, setHovered] = useState(false)
    const ref = useRef<HTMLAnchorElement>(null)
    const x = useMotionValue(0), y = useMotionValue(0)
    const rotX = useSpring(useTransform(y, [-20, 20], [8, -8]), { stiffness: 300, damping: 20 })
    const rotY = useSpring(useTransform(x, [-40, 40], [-8, 8]), { stiffness: 300, damping: 20 })

    const onMove = (e: React.MouseEvent) => {
      const r = ref.current!.getBoundingClientRect()
      x.set(e.clientX - r.left - r.width / 2)
      y.set(e.clientY - r.top - r.height / 2)
    }
    const onLeave = () => { x.set(0); y.set(0); setHovered(false) }

    return (
      <motion.a
        ref={ref}
        href={`#${item.href}`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 + index * 0.06, type: 'spring', stiffness: 120 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 400 }}
        className="relative px-4 py-2 text-sm font-semibold transition-colors duration-200 select-none"
        whileHover={{ z: 8 }}
      >
        {/* Glow bg */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            background: hovered
              ? 'radial-gradient(ellipse at center, rgba(255,107,0,0.14) 0%, transparent 70%)'
              : 'transparent',
            border: hovered ? '1px solid rgba(255,107,0,0.22)' : '1px solid transparent',
          }}
          transition={{ duration: 0.2 }}
          style={{ borderRadius: 10 }}
        />

        {/* Icon + text */}
        <span className="relative z-10 flex items-center gap-1.5" style={{
          color: active ? '#ff6b00' : hovered ? '#ffaa00' : '#c8a882',
          textShadow: active ? '0 0 14px rgba(255,107,0,0.6)' : hovered ? '0 0 10px rgba(255,170,0,0.5)' : 'none',
          transition: 'color 0.2s, text-shadow 0.2s',
        }}>
          <item.icon size={13} style={{ opacity: active || hovered ? 1 : 0.5 }} />
          {item.name}
        </span>

        {/* Active underline — lava */}
        {active && (
          <motion.div
            layoutId="lavaUnderline"
            className="absolute bottom-0 left-2 right-2 rounded-full"
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #cc2200, #ff4500, #ff6b00, #ffaa00)',
              boxShadow: '0 0 8px rgba(255,69,0,0.7), 0 0 16px rgba(255,69,0,0.4)',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          />
        )}

        {/* Hover drip effect */}
        <AnimatePresence>
          {hovered && !active && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              className="absolute bottom-0 left-2 right-2 rounded-full"
              style={{
                height: 1.5,
                background: 'linear-gradient(90deg, transparent, rgba(255,170,0,0.6), transparent)',
                transformOrigin: 'center',
              }}
              transition={{ duration: 0.22 }}
            />
          )}
        </AnimatePresence>
      </motion.a>
    )
  }

/* ══════════════════════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════════════════════ */
const Navbar: React.FC<NavbarProps> = ({ isDark, setIsDark }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [logoBurst, setLogoBurst] = useState(false)
  const [logoHover, setLogoHover] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      setScrolled(window.scrollY > 20)
      setScrollPct(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100)

      const sections = ['about', 'education', 'skills', 'projects', 'achievements', 'contact']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) { setActiveSection(section); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'About',        href: 'about',        icon: Flame },
    { name: 'Education',    href: 'education',     icon: Flame },
    { name: 'Skills',       href: 'skills',        icon: Zap   },
    { name: 'Projects',     href: 'projects',      icon: Zap   },
    { name: 'Achievements', href: 'achievements',  icon: Flame },
    { name: 'Contact',      href: 'contact',       icon: Flame },
  ]

  const triggerBurst = () => {
    setLogoBurst(true)
    setTimeout(() => setLogoBurst(false), 600)
  }

  return (
    <>
      {/* ── Lava scroll progress bar ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999, background: 'rgba(255,69,0,0.08)' }}>
        <motion.div
          style={{
            height: '100%',
            width: `${scrollPct}%`,
            background: 'linear-gradient(90deg, #cc2200, #ff4500, #ff6b00, #ffaa00, #ffd700)',
            boxShadow: '0 0 14px #ff4500, 0 0 30px rgba(255,69,0,0.5)',
          }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 80, damping: 18 }}
        className="fixed w-full z-50 transition-all duration-500"
        style={{ top: 2, paddingTop: scrolled ? 12 : 20, paddingBottom: scrolled ? 12 : 20 }}
      >
        {/* ── Glass backdrop ── */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'rgba(8,1,0,0.82)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255,80,0,0.12)',
                boxShadow: '0 4px 40px rgba(255,69,0,0.07), 0 1px 0 rgba(255,107,0,0.10)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Lava scan line on scroll ── */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,69,0,0.4), rgba(255,170,0,0.6), rgba(255,69,0,0.4), transparent)' }}
            />
          )}
        </AnimatePresence>

        <div className="container mx-auto px-6 flex justify-between items-center">

          {/* ── 3D Logo ── */}
          <motion.a
            href="#"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: 'spring' }}
            onMouseEnter={() => { setLogoHover(true); triggerBurst() }}
            onMouseLeave={() => setLogoHover(false)}
            className="group flex items-center gap-3 select-none"
            style={{ textDecoration: 'none' }}
          >
            {/* Icon box with 3D lift */}
            <motion.div
              className="relative"
              animate={logoHover
                ? { rotateY: 15, rotateX: -8, scale: 1.08, z: 20 }
                : { rotateY: 0, rotateX: 0, scale: 1, z: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              style={{ transformStyle: 'preserve-3d', perspective: 400 }}
            >
              {/* Ember sparks */}
              <LavaBurst active={logoBurst} />

              {/* Animated ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1.5 rounded-2xl pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,69,0,0.6) 25%, rgba(255,170,0,0.8) 50%, rgba(255,69,0,0.6) 75%, transparent 100%)',
                  borderRadius: 14,
                  opacity: logoHover ? 0.9 : 0.35,
                  padding: 1,
                }}
              >
                <div style={{
                  position: 'absolute', inset: 1.5, borderRadius: 12,
                  background: '#0a0200',
                }} />
              </motion.div>

              {/* Icon */}
              <motion.div
                className="relative p-2.5 rounded-xl"
                style={{
                  background: logoHover
                    ? 'linear-gradient(135deg, rgba(255,69,0,0.28), rgba(255,170,0,0.15))'
                    : 'rgba(255,69,0,0.10)',
                  border: '1px solid rgba(255,107,0,0.30)',
                  boxShadow: logoHover ? '0 0 24px rgba(255,69,0,0.55), inset 0 1px 0 rgba(255,200,0,0.2)' : '0 0 10px rgba(255,69,0,0.2)',
                  transition: 'all 0.3s',
                }}
              >
                <motion.div
                  animate={logoHover ? { rotate: [0, -15, 15, 0] } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Code2 size={22} style={{ color: logoHover ? '#ffaa00' : '#ff6b00' }} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Text */}
            <div className="flex flex-col">
              <motion.span
                className="text-xl font-black tracking-tight leading-none"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: 'linear-gradient(135deg, #ff4500, #ff6b00, #ffaa00, #ffd700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  filter: logoHover ? 'drop-shadow(0 0 10px rgba(255,107,0,0.6))' : 'none',
                  transition: 'filter 0.3s',
                }}
                animate={{ backgroundPosition: logoHover ? '100% 50%' : '0% 50%' }}
                transition={{ duration: 0.6 }}
              >
                Suraj.dev
              </motion.span>
              <motion.span
                className="text-[10px] hidden sm:block"
                style={{ color: '#6a4a30', letterSpacing: '0.06em' }}
                animate={{ color: logoHover ? '#ff6b00' : '#6a4a30' }}
                transition={{ duration: 0.3 }}
              >
                Cloud Engineer & DevOps
              </motion.span>
            </div>
          </motion.a>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item, i) => (
              <NavItem key={item.name} item={item} active={activeSection === item.href} index={i} />
            ))}

            {/* Resume button */}
            <MagneticBtn
              href="/resume.pdf"
              download
              className="ml-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #cc2200, #ff4500, #ff6b00)',
                border: '1px solid rgba(255,150,0,0.35)',
                boxShadow: '0 0 18px rgba(255,69,0,0.35), inset 0 1px 0 rgba(255,200,0,0.18)',
                color: '#fff',
              }}
              strength={0.25}
            >
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Download size={15} />
              </motion.div>
              <span>Resume</span>
              {/* Live ember dot */}
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#ffd700' }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </MagneticBtn>

            {/* Theme toggle */}
            <MagneticBtn
              onClick={() => setIsDark(!isDark)}
              className="ml-2 p-2.5 rounded-xl cursor-pointer"
              style={{
                background: 'rgba(255,69,0,0.08)',
                border: '1px solid rgba(255,80,0,0.18)',
              }}
              strength={0.3}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  {isDark
                    ? <Flame size={18} style={{ color: '#ff6b00' }} />
                    : <Zap size={18} style={{ color: '#ffaa00' }} />
                  }
                </motion.div>
              </AnimatePresence>
            </MagneticBtn>
          </div>

          {/* ── Mobile controls ── */}
          <div className="flex items-center gap-2 md:hidden">
            <MagneticBtn
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl cursor-pointer"
              style={{ background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,80,0,0.18)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <Flame size={17} style={{ color: '#ff6b00' }} /> : <Zap size={17} style={{ color: '#ffaa00' }} />}
                </motion.div>
              </AnimatePresence>
            </MagneticBtn>

            <MagneticBtn
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl cursor-pointer"
              style={{ background: 'rgba(255,69,0,0.08)', border: '1px solid rgba(255,80,0,0.18)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {isOpen
                    ? <X size={19} style={{ color: '#ff4500' }} />
                    : <Menu size={19} style={{ color: '#ff6b00' }} />
                  }
                </motion.div>
              </AnimatePresence>
            </MagneticBtn>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -12 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -12 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-3 mx-4 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10,2,0,0.95)',
                backdropFilter: 'blur(28px)',
                border: '1px solid rgba(255,80,0,0.18)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,107,0,0.1)',
              }}
            >
              {/* Top lava line */}
              <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ff4500, #ffaa00, #ff4500, transparent)' }} />

              <div className="p-4 flex flex-col gap-1.5">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={`#${item.href}`}
                    initial={{ opacity: 0, x: -28, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ delay: index * 0.055, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                    style={activeSection === item.href ? {
                      background: 'rgba(255,69,0,0.13)',
                      border: '1px solid rgba(255,107,0,0.25)',
                      color: '#ff6b00',
                      boxShadow: '0 0 16px rgba(255,69,0,0.15), inset 0 1px 0 rgba(255,200,0,0.08)',
                    } : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#c8a882',
                    }}
                    whileHover={{
                      x: 6,
                      background: 'rgba(255,69,0,0.08)',
                      borderColor: 'rgba(255,107,0,0.18)',
                      color: '#ffaa00',
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Left accent bar for active */}
                    {activeSection === item.href && (
                      <motion.div
                        layoutId="mobileActive"
                        className="w-1 self-stretch rounded-full"
                        style={{ background: 'linear-gradient(180deg, #ff4500, #ffaa00)', boxShadow: '0 0 8px rgba(255,69,0,0.6)', minHeight: 20 }}
                      />
                    )}
                    <item.icon size={14} style={{ opacity: 0.7 }} />
                    <span className="font-semibold text-sm">{item.name}</span>
                    {activeSection === item.href && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: '#ff6b00', boxShadow: '0 0 6px rgba(255,107,0,0.8)' }}
                      />
                    )}
                  </motion.a>
                ))}

                {/* Mobile resume CTA */}
                <motion.a
                  href="/resume.pdf"
                  download
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2.5 px-4 py-3.5 mt-2 rounded-xl font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #cc2200, #ff4500, #ff6b00)',
                    boxShadow: '0 0 20px rgba(255,69,0,0.4), inset 0 1px 0 rgba(255,200,0,0.2)',
                    border: '1px solid rgba(255,150,0,0.3)',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(255,69,0,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                    <Download size={16} />
                  </motion.div>
                  <span>Download Resume</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar