import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Github, Linkedin, Code, Award, Mail, ArrowUp, Sparkles, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About',          href: '#about'         },
  { label: 'Education',      href: '#education'     },
  { label: 'Skills',         href: '#skills'        },
  { label: 'Projects',       href: '#projects'      },
  { label: 'Achievements',   href: '#achievements'  },
  { label: 'Certifications', href: '#certifications'},
  { label: 'Contact',        href: '#contact'       },
]

const SOCIALS = [
  { icon: Github,   href: 'https://github.com/suraj-kumar-shah?tab=repositories', label: 'GitHub'     },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/surajkumarsah77/',         label: 'LinkedIn'   },
  { icon: Code,     href: 'https://leetcode.com/u/suraj-kumar-sah/',               label: 'LeetCode'  },
  { icon: Award,    href: 'https://www.hackerrank.com/profile/surajshah72600',     label: 'HackerRank'},
  { icon: Mail,     href: 'mailto:surajshah72600@gmail.com',                       label: 'Email'     },
]

const TECH_TAGS = ['AWS','Docker','Kubernetes','Terraform','React','CI/CD','DevOps','Python']

const Footer: React.FC = () => {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer ref={ref} className="relative overflow-hidden pt-1">

      {/* ── Top glow separator ── */}
      <div className="footer-glow-line" />

      {/* ── Subtle bg ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:'linear-gradient(to bottom,rgba(2,6,23,0) 0%,rgba(2,6,23,0.9) 100%)' }} />

      {/* ── Floating tech tags ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {TECH_TAGS.map((tag, i) => (
          <motion.span
            key={tag}
            className="absolute text-[10px] font-mono font-bold uppercase tracking-widest"
            style={{
              left: `${8 + i * 11}%`,
              top:  `${15 + (i % 3) * 28}%`,
              color: ['#22d3ee','#818cf8','#34d399','#f472b6','#fb923c','#a78bfa','#60a5fa','#4ade80'][i],
              opacity: 0.10,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.10, 0.18, 0.10] }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease:'easeInOut', delay: i * 0.4 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <div className="container mx-auto px-6 py-14 relative z-10">

        {/* ── Top row: logo + scroll-to-top ── */}
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/8 shadow-lg shadow-cyan-500/10">
              <Terminal size={22} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white" style={{ fontFamily:'Syne,sans-serif' }}>
                Suraj<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">.dev</span>
              </p>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Cloud · DevOps · Full Stack</p>
            </div>
          </div>

          {/* Scroll to top */}
          <motion.button
            onClick={scrollTop}
            whileHover={{ scale:1.08, y:-3 }}
            whileTap={{ scale:0.95 }}
            className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/3 hover:border-cyan-500/40 hover:bg-cyan-500/6 transition-all"
          >
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background:'radial-gradient(ellipse at 50% 100%,rgba(34,211,238,0.12),transparent)' }} />
            <ArrowUp size={14} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-semibold text-gray-400 group-hover:text-cyan-400 transition-colors">Back to top</span>
          </motion.button>
        </motion.div>

        {/* ── Navigation links ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.1, ease:[0.22,1,0.36,1] }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10"
        >
          {NAV_LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity:0, y:10 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.4, delay:0.15 + i*0.04 }}
              whileHover={{ y:-2, color:'#22d3ee' }}
              className="text-sm text-gray-500 hover:text-cyan-400 transition-colors font-medium tracking-wide"
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>

        {/* ── Social icons ── */}
        <motion.div
          initial={{ opacity:0, y:20 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.7, delay:0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              initial={{ scale:0, rotate:-20 }}
              animate={inView ? { scale:1, rotate:0 } : {}}
              transition={{ duration:0.4, delay:0.25 + i*0.06, type:'spring', stiffness:160 }}
              whileHover={{ scale:1.15, y:-4 }}
              className="group relative p-3 rounded-xl border border-white/8 bg-white/3 hover:border-cyan-500/40 hover:bg-cyan-500/8 transition-all"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
                style={{ background:'rgba(34,211,238,0.15)' }} />
              <s.icon size={18} className="relative text-gray-500 group-hover:text-cyan-400 transition-colors group-hover:scale-110 transition-transform" />
            </motion.a>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX:0 }}
          animate={inView ? { scaleX:1 } : {}}
          transition={{ duration:0.9, delay:0.35 }}
          className="h-px mb-8 origin-left"
          style={{ background:'linear-gradient(90deg,transparent,rgba(34,211,238,0.3),rgba(129,140,248,0.3),transparent)' }}
        />

        {/* ── Bottom row ── */}
        <motion.div
          initial={{ opacity:0 }}
          animate={inView ? { opacity:1 } : {}}
          transition={{ duration:0.7, delay:0.45 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-center"
        >
          {/* Copyright */}
          <p className="text-xs text-gray-600 font-mono">
            © {new Date().getFullYear()}{' '}
            <span className="text-gray-400 font-semibold">Suraj Kumar Sah</span>
            {' '}· All rights reserved
          </p>

          {/* Made with */}
          <motion.p
            className="text-xs text-gray-600 flex items-center gap-1.5"
            whileHover={{ scale:1.04 }}
          >
            <span>Crafted with</span>
            <motion.span
              animate={{ scale:[1,1.3,1] }}
              transition={{ duration:1.2, repeat:Infinity, ease:'easeInOut' }}
            >
              <Heart size={12} className="text-rose-500 fill-rose-500" />
            </motion.span>
            <span>&</span>
            <Sparkles size={12} className="text-cyan-400" />
            <span>by</span>
            <span className="text-cyan-400 font-semibold">Suraj</span>
          </motion.p>

          {/* Reg no */}
          <p className="text-xs text-gray-600 font-mono">
            Reg No:{' '}
            <motion.span
              className="text-cyan-400 font-bold"
              animate={{ opacity:[0.7,1,0.7] }}
              transition={{ duration:2.5, repeat:Infinity }}
            >
              12301776
            </motion.span>
          </p>
        </motion.div>

        {/* ── Status bar ── */}
        <motion.div
          initial={{ opacity:0, y:10 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.6, delay:0.55 }}
          className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-gray-700"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Available for opportunities
          </span>
          <span className="text-gray-800">·</span>
          <span>LPU · Punjab · India</span>
          <span className="text-gray-800">·</span>
          <span>B.Tech CSE 2023–2027</span>
        </motion.div>
      </div>

      {/* ── Bottom glow ── */}
      <div style={{
        position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'60%', height:'1px',
        background:'linear-gradient(90deg,transparent,rgba(34,211,238,0.2),transparent)',
      }} />
    </footer>
  )
}

export default Footer