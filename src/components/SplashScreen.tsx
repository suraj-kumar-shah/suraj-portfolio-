import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

/* ── Tech keywords that snake across the background ── */
const TECH_WORDS = [
  'Docker','Kubernetes','Terraform','Jenkins','AWS','Azure','GCP',
  'CI/CD','Ansible','Prometheus','Grafana','Helm','ArgoCD','GitOps',
  'Linux','Nginx','Redis','MongoDB','PostgreSQL','Kafka','RabbitMQ',
  'CloudFormation','Pulumi','Vault','Istio','OWASP','S3','EC2','Lambda',
  'EKS','AKS','GKE','CloudRun','Serverless','Load Balancer','VPC','CDN',
  'IAM','Secrets Manager','CloudWatch','Datadog','New Relic','SRE','MLOps',
]

/* ── Snake segment type ── */
interface Segment { x: number; y: number; word: string; opacity: number; scale: number }

/* ────────────────────────────────────────────────────
   Canvas Snake Background
──────────────────────────────────────────────────── */
const SnakeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const snakesRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)

    /* Create snakes */
    const NUM_SNAKES = 6
    snakesRef.current = Array.from({ length: NUM_SNAKES }, (_, idx) => {
      const wordList = [...TECH_WORDS].sort(() => Math.random() - 0.5)
      return {
        segments: [] as { x: number; y: number; word: string; alpha: number }[],
        x: Math.random() * W,
        y: Math.random() * H,
        angle: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.2,
        turnSpeed: 0.02 + Math.random() * 0.04,
        wordIdx: 0,
        wordList,
        stepTimer: 0,
        stepInterval: 28 + Math.floor(Math.random() * 20),
        color: [
          '#22d3ee','#818cf8','#34d399','#f472b6','#fb923c','#a78bfa'
        ][idx % 6],
        maxLen: 10 + Math.floor(Math.random() * 8),
      }
    })

    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      /* subtle grid */
      ctx.strokeStyle = 'rgba(99,102,241,0.04)'
      ctx.lineWidth = 1
      const GRID = 60
      for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      snakesRef.current.forEach(snake => {
        /* steer */
        snake.angle += (Math.random() - 0.5) * snake.turnSpeed * 2
        snake.x += Math.cos(snake.angle) * snake.speed
        snake.y += Math.sin(snake.angle) * snake.speed

        /* wrap */
        if (snake.x < -100) snake.x = W + 80
        if (snake.x > W + 100) snake.x = -80
        if (snake.y < -40) snake.y = H + 40
        if (snake.y > H + 40) snake.y = -40

        /* add segment periodically */
        snake.stepTimer++
        if (snake.stepTimer >= snake.stepInterval) {
          snake.stepTimer = 0
          snake.segments.unshift({
            x: snake.x, y: snake.y,
            word: snake.wordList[snake.wordIdx % snake.wordList.length],
            alpha: 1,
          })
          snake.wordIdx++
          if (snake.segments.length > snake.maxLen) snake.segments.pop()
        }

        /* draw connector lines */
        for (let i = 0; i < snake.segments.length - 1; i++) {
          const a = snake.segments[i], b = snake.segments[i + 1]
          const alpha = (1 - i / snake.maxLen) * 0.25
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = snake.color.replace(')', `,${alpha})`).replace('rgb', 'rgba')
          /* hex → rgba workaround */
          ctx.strokeStyle = hexToRgba(snake.color, alpha)
          ctx.lineWidth = Math.max(0.5, 2 - i * 0.18)
          ctx.stroke()
        }

        /* draw words */
        snake.segments.forEach((seg: any, i: number) => {
          const t = 1 - i / snake.maxLen
          const alpha = t * 0.85
          const scale = 0.6 + t * 0.55
          const fontSize = Math.round(10 * scale)

          ctx.save()
          ctx.translate(seg.x, seg.y)
          ctx.font = `${i === 0 ? 'bold' : '500'} ${fontSize}px 'JetBrains Mono', monospace`
          ctx.fillStyle = hexToRgba(snake.color, alpha)
          ctx.shadowColor = snake.color
          ctx.shadowBlur = i === 0 ? 12 : 4

          /* head pill */
          if (i === 0) {
            const metrics = ctx.measureText(seg.word)
            const pw = metrics.width + 10, ph = fontSize + 6
            ctx.fillStyle = hexToRgba(snake.color, 0.12)
            roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 4)
            ctx.fill()
            ctx.strokeStyle = hexToRgba(snake.color, 0.5)
            ctx.lineWidth = 0.8
            ctx.stroke()
            ctx.fillStyle = hexToRgba(snake.color, alpha)
          }

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(seg.word, 0, 0)
          ctx.restore()
        })
      })

      frame++
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.9 }} />
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/* ────────────────────────────────────────────────────
   Glitch Text
──────────────────────────────────────────────────── */
const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <span className={`relative inline-block ${className}`} data-text={text}>
    {text}
    <style>{`
      [data-text]::before,[data-text]::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;}
      [data-text]::before{left:2px;text-shadow:-2px 0 #f472b6;clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%);animation:glitch1 3s infinite linear alternate-reverse;}
      [data-text]::after{left:-2px;text-shadow:2px 0 #22d3ee;clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);animation:glitch2 2.5s infinite linear alternate-reverse;}
      @keyframes glitch1{0%{clip-path:polygon(0 15%,100% 15%,100% 30%,0 30%);transform:translate(-1px,0)}50%{clip-path:polygon(0 65%,100% 65%,100% 80%,0 80%);transform:translate(1px,0)}100%{clip-path:polygon(0 40%,100% 40%,100% 55%,0 55%);transform:translate(0,0)}}
      @keyframes glitch2{0%{clip-path:polygon(0 70%,100% 70%,100% 85%,0 85%);transform:translate(1px,0)}50%{clip-path:polygon(0 10%,100% 10%,100% 25%,0 25%);transform:translate(-1px,0)}100%{clip-path:polygon(0 50%,100% 50%,100% 65%,0 65%);transform:translate(0,0)}}
    `}</style>
  </span>
)

/* ────────────────────────────────────────────────────
   Typewriter
──────────────────────────────────────────────────── */
const useTypewriter = (text: string, speed = 55, active = true) => {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!active) { setDisplayed(''); setDone(false); return }
    setDisplayed(''); setDone(false)
    let i = 0
    const id = setInterval(() => {
      i++; setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, active])
  return { displayed, done }
}

/* ────────────────────────────────────────────────────
   Words sequence
──────────────────────────────────────────────────── */
const WORDS = [
  { text: 'Welcome to my Portfolio', sub: 'Initiating sequence…',        color: '#f472b6', glow: '#f472b680', icon: '✦' },
  { text: 'Suraj Kumar Sah',         sub: 'Full-Stack · Cloud · DevOps', color: '#22d3ee', glow: '#22d3ee80', icon: '◈' },
  { text: 'Lovely Professional Univ',sub: 'B.Tech CSE — 3rd Year',       color: '#a78bfa', glow: '#a78bfa80', icon: '◉' },
  { text: 'Cloud Engineer',          sub: 'AWS · Azure · GCP',           color: '#34d399', glow: '#34d39980', icon: '⬡' },
  { text: 'DevOps Engineer',         sub: 'CI/CD · K8s · Terraform',     color: '#fb923c', glow: '#fb923c80', icon: '⟳' },
]

/* ────────────────────────────────────────────────────
   Orbit Ring
──────────────────────────────────────────────────── */
const OrbitRing: React.FC<{ radius: number; duration: number; delay?: number; color: string; reverse?: boolean }> =
  ({ radius, duration, delay = 0, color, reverse }) => (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full border pointer-events-none"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, borderColor: color + '30' }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      {/* orbiting dot */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg"
        style={{ background: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}` }} />
    </motion.div>
  )

/* ────────────────────────────────────────────────────
   Main SplashScreen
──────────────────────────────────────────────────── */
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [wordIdx, setWordIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'exit'>('typing')
  const [exitBlast, setExitBlast] = useState(false)

  const current = WORDS[wordIdx] ?? WORDS[WORDS.length - 1]
  const { displayed, done } = useTypewriter(current.text, 48, phase === 'typing')

  /* advance words */
  useEffect(() => {
    if (!done) return
    const hold = setTimeout(() => {
      if (wordIdx < WORDS.length - 1) setWordIdx(i => i + 1)
      else {
        setTimeout(() => {
          setPhase('exit')
          setExitBlast(true)
          setTimeout(onComplete, 1100)
        }, 600)
      }
    }, 520)
    return () => clearTimeout(hold)
  }, [done, wordIdx, onComplete])

  const progress = ((wordIdx + (done ? 1 : 0)) / WORDS.length) * 100

  return (
    <AnimatePresence>
      {!exitBlast ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at 30% 40%, #0f172a 0%, #020617 60%, #0a0a1a 100%)' }}
        >
          {/* ── Snake Canvas Background ── */}
          <SnakeBackground />

          {/* ── Vignette ── */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(2,6,23,0.85) 100%)' }} />

          {/* ── Scan line sweep ── */}
          <motion.div
            className="absolute inset-x-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg,transparent,#22d3ee60,transparent)' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* ── Orbit rings ── */}
          <OrbitRing radius={140} duration={9}  color="#22d3ee" />
          <OrbitRing radius={190} duration={14} color="#a78bfa" reverse delay={1} />
          <OrbitRing radius={240} duration={20} color="#34d399" delay={2} />

          {/* ── Centre glow ── */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 200, height: 200, background: current.glow, filter: 'blur(60px)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* ── Main card ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">

            {/* Logo hex */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
              className="mb-10 relative"
            >
              {/* pulsing rings */}
              {[1,2,3].map(i => (
                <motion.div key={i} className="absolute inset-0 rounded-2xl border"
                  style={{ borderColor: current.color + '40' }}
                  animate={{ scale: [1, 1.4 + i * 0.15], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                />
              ))}

              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-24 h-24 rounded-2xl flex items-center justify-center text-5xl font-black shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${current.color}25, ${current.color}08)`,
                  border: `1.5px solid ${current.color}50`,
                  boxShadow: `0 0 30px ${current.color}40, inset 0 1px 0 ${current.color}30`,
                }}
              >
                <motion.span
                  key={wordIdx}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {current.icon}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Word display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={wordIdx}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                {/* Sub label */}
                <motion.p
                  className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                  style={{ color: current.color + 'aa' }}
                >
                  {current.sub}
                </motion.p>

                {/* Main typewriter text */}
                <h1
                  className="text-4xl md:text-6xl font-black mb-2 leading-tight"
                  style={{
                    color: current.color,
                    textShadow: `0 0 30px ${current.glow}, 0 0 60px ${current.glow}`,
                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                    letterSpacing: '-0.02em',
                  }}
                >
                  {displayed}
                  {/* cursor */}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    style={{ color: current.color, marginLeft: 2 }}
                  >▋</motion.span>
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* ── Progress bar ── */}
            <div className="mt-12 w-full max-w-sm">
              {/* Steps dots */}
              <div className="flex justify-between mb-3">
                {WORDS.map((w, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === wordIdx ? 1.4 : i < wordIdx ? 1 : 0.7,
                      opacity: i <= wordIdx ? 1 : 0.25,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: i <= wordIdx ? w.color : '#334155' }}
                  />
                ))}
              </div>

              {/* Bar track */}
              <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${WORDS[0].color}, ${current.color})`,
                    boxShadow: `0 0 8px ${current.color}`,
                  }}
                />
              </div>

              {/* Step counter */}
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-mono" style={{ color: current.color + '80' }}>
                  {String(wordIdx + 1).padStart(2, '0')} / {String(WORDS.length).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Bottom tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex flex-wrap justify-center gap-2"
            >
              {['Cloud Native', 'DevOps', 'Full Stack', 'Open Source'].map((tag, i) => (
                <motion.span
                  key={tag}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
                  style={{ color: current.color + 'cc', borderColor: current.color + '30', background: current.color + '08' }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* ── EXIT BLAST ── */
        <motion.div
          key="exit"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: '#020617' }}
        >
          {/* Shockwave rings */}
          {[1,2,3,4].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-cyan-400/60"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: '200vmax', height: '200vmax', opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }}
              style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
          ))}

          {/* Flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, #22d3ee40, transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          />

          {/* Centre icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.4, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="relative z-10 text-center"
          >
            <div className="text-7xl mb-3" style={{ filter: 'drop-shadow(0 0 20px #22d3ee)' }}>⚡</div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black tracking-widest"
              style={{ color: '#22d3ee', fontFamily: "'JetBrains Mono', monospace", textShadow: '0 0 20px #22d3ee' }}
            >
              LAUNCHING…
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen