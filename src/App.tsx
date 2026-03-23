import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Achievements from './components/Achievements'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SplashScreen from './components/SplashScreen'
import WhatsAppButton from './components/WhatsAppButton'

/* ─────────────────────────────────────────────
   Tech words for global snake canvas
───────────────────────────────────────────── */
const TECH_WORDS = [
  'Docker','Kubernetes','Terraform','Jenkins','AWS','Azure','GCP',
  'CI/CD','Ansible','Prometheus','Grafana','Helm','ArgoCD','GitOps',
  'Linux','Nginx','Redis','MongoDB','PostgreSQL','Kafka','React',
  'CloudFormation','Pulumi','Vault','S3','EC2','Lambda','EKS','VPC',
  'IAM','CloudWatch','Datadog','SRE','MLOps','Python','TypeScript','DevOps',
]

function hexToRgba(hex: string, alpha: number) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${alpha})`
}
function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y)
  ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r)
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h)
  ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r)
  ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath()
}

/* ─────────────────────────────────────────────
   STAR FIELD (static, matches screenshot dots)
───────────────────────────────────────────── */
const StarField: React.FC = () => {
  const stars = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top:  Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur:  2 + Math.random() * 5,
    delay: Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.55,
  }))
  return (
    <div className="star-field">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top:  `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.dur}s`,
            animationDelay:    `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   GLOBAL SNAKE CANVAS
───────────────────────────────────────────── */
const GlobalSnakeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const resize = () => { W=window.innerWidth; H=window.innerHeight; canvas.width=W; canvas.height=H }
    window.addEventListener('resize', resize)

    /* teal + purple palette — matches screenshot */
    const COLORS = ['#2dd4bf','#22d3ee','#0ea5e9','#7c3aed','#a78bfa','#34d399','#5eead4','#60a5fa']

    const snakes = Array.from({ length: 8 }, (_, idx) => ({
      segments: [] as {x:number;y:number;word:string}[],
      x: Math.random()*W, y: Math.random()*H,
      angle: Math.random()*Math.PI*2,
      speed: 0.55+Math.random()*1.2,
      turnSpeed: 0.012+Math.random()*0.030,
      wordIdx: 0,
      wordList: [...TECH_WORDS].sort(()=>Math.random()-0.5),
      stepTimer: 0,
      stepInterval: 22+Math.floor(Math.random()*18),
      color: COLORS[idx%COLORS.length],
      maxLen: 8+Math.floor(Math.random()*9),
    }))

    const draw = () => {
      ctx.clearRect(0,0,W,H)

      /* faint grid */
      ctx.strokeStyle='rgba(45,212,191,0.03)'; ctx.lineWidth=1
      const G=68
      for(let x=0;x<W;x+=G){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for(let y=0;y<H;y+=G){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}

      snakes.forEach(s => {
        s.angle += (Math.random()-0.5)*s.turnSpeed*2
        s.x += Math.cos(s.angle)*s.speed
        s.y += Math.sin(s.angle)*s.speed
        if(s.x<-130) s.x=W+100; if(s.x>W+130) s.x=-100
        if(s.y<-60)  s.y=H+60;  if(s.y>H+60)  s.y=-60

        s.stepTimer++
        if(s.stepTimer>=s.stepInterval){
          s.stepTimer=0
          s.segments.unshift({x:s.x,y:s.y,word:s.wordList[s.wordIdx%s.wordList.length]})
          s.wordIdx++
          if(s.segments.length>s.maxLen) s.segments.pop()
        }

        for(let i=0;i<s.segments.length-1;i++){
          const a=s.segments[i],b=s.segments[i+1]
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y)
          ctx.strokeStyle=hexToRgba(s.color,(1-i/s.maxLen)*0.22)
          ctx.lineWidth=Math.max(0.4,2-i*0.2); ctx.stroke()
        }

        s.segments.forEach((seg,i)=>{
          const t=1-i/s.maxLen; const alpha=t*0.65
          const fontSize=Math.round(9*(0.5+t*0.65))
          ctx.save(); ctx.translate(seg.x,seg.y)
          ctx.font=`${i===0?'bold':'500'} ${fontSize}px 'JetBrains Mono',monospace`
          ctx.fillStyle=hexToRgba(s.color,alpha)
          ctx.shadowColor=s.color; ctx.shadowBlur=i===0?16:3
          if(i===0){
            const m=ctx.measureText(seg.word)
            const pw=m.width+10,ph=fontSize+6
            ctx.fillStyle=hexToRgba(s.color,0.10); roundRect(ctx,-pw/2,-ph/2,pw,ph,4); ctx.fill()
            ctx.strokeStyle=hexToRgba(s.color,0.45); ctx.lineWidth=0.8; ctx.stroke()
            ctx.fillStyle=hexToRgba(s.color,alpha)
          }
          ctx.textAlign='center'; ctx.textBaseline='middle'
          ctx.fillText(seg.word,0,0); ctx.restore()
        })
      })

      animRef.current=requestAnimationFrame(draw)
    }
    draw()
    return()=>{ cancelAnimationFrame(animRef.current); window.removeEventListener('resize',resize) }
  },[])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'fixed',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0,opacity:0.55 }}
    />
  )
}

/* ─────────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────────── */
const CustomCursor: React.FC = () => {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos  = useRef({x:0,y:0})
  const lag  = useRef({x:0,y:0})
  const raf  = useRef<number>(0)
  const [visible,setVisible] = useState(false)

  useEffect(()=>{
    const onMove=(e:MouseEvent)=>{ pos.current={x:e.clientX,y:e.clientY}; if(!visible)setVisible(true) }
    window.addEventListener('mousemove',onMove)
    const animate=()=>{
      lag.current.x+=(pos.current.x-lag.current.x)*0.10
      lag.current.y+=(pos.current.y-lag.current.y)*0.10
      if(dot.current)  dot.current.style.transform =`translate(${pos.current.x-5}px,${pos.current.y-5}px)`
      if(ring.current) ring.current.style.transform=`translate(${lag.current.x-20}px,${lag.current.y-20}px)`
      raf.current=requestAnimationFrame(animate)
    }
    animate()
    const expand=()=>ring.current?.classList.add('cursor-expand')
    const shrink=()=>ring.current?.classList.remove('cursor-expand')
    document.querySelectorAll('a,button,[role=button]').forEach(el=>{
      el.addEventListener('mouseenter',expand); el.addEventListener('mouseleave',shrink)
    })
    return()=>{ window.removeEventListener('mousemove',onMove); cancelAnimationFrame(raf.current) }
  },[])

  if(!visible) return null
  return(
    <>
      <div ref={dot}  className="global-cursor-dot"  />
      <div ref={ring} className="global-cursor-ring" />
    </>
  )
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
const ScrollBar: React.FC = () => {
  const [pct,setPct]=useState(0)
  useEffect(()=>{
    const fn=()=>{ const el=document.documentElement; setPct(el.scrollTop/(el.scrollHeight-el.clientHeight)*100) }
    window.addEventListener('scroll',fn)
    return()=>window.removeEventListener('scroll',fn)
  },[])
  return(
    <div style={{position:'fixed',top:0,left:0,right:0,height:'2px',zIndex:9999,background:'rgba(255,255,255,0.04)'}}>
      <div style={{
        height:'100%',width:`${pct}%`,
        background:'linear-gradient(90deg,#2dd4bf,#7c3aed,#f472b6)',
        boxShadow:'0 0 10px #2dd4bf',
        transition:'width 0.1s linear',
      }}/>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SECTION REVEAL
───────────────────────────────────────────── */
export const SectionReveal: React.FC<{children:React.ReactNode;delay?:number}> = ({children,delay=0}) => (
  <motion.div
    initial={{opacity:0,y:55,filter:'blur(6px)'}}
    whileInView={{opacity:1,y:0,filter:'blur(0px)'}}
    viewport={{once:true,amount:0.07}}
    transition={{duration:0.85,delay,ease:[0.22,1,0.36,1]}}
  >
    {children}
  </motion.div>
)

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
function App() {
  const [isDark,     setIsDark]     = useState(true)
  const [showSplash, setShowSplash] = useState(true)
  const [mainVisible,setMainVisible]= useState(false)

  useEffect(()=>{ document.documentElement.classList.toggle('dark',isDark) },[isDark])

  const handleSplashComplete = useCallback(()=>{
    setShowSplash(false)
    setTimeout(()=>setMainVisible(true),100)
  },[])

  return (
    <>
      {!showSplash && <GlobalSnakeCanvas />}
      <CustomCursor />
      {mainVisible && <ScrollBar />}

      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {mainVisible && (
          <motion.div
            key="main"
            initial={{opacity:0,scale:0.985}}
            animate={{opacity:1,scale:1}}
            transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
            className="min-h-screen text-gray-100 relative overflow-x-hidden"
            /* ── SPACE DARK BACKGROUND matching screenshot ── */
            style={{
              backgroundColor:'#060d0d',
              backgroundImage:[
                'radial-gradient(ellipse 55% 55% at 0% 0%,   rgba(13,80,65,0.55) 0%, transparent 65%)',
                'radial-gradient(ellipse 45% 45% at 100% 100%,rgba(80,20,130,0.40) 0%, transparent 65%)',
                'radial-gradient(ellipse 30% 35% at 50% 50%,  rgba(5,30,28,0.25)  0%, transparent 70%)',
              ].join(','),
            }}
          >
            {/* Star field */}
            <StarField />

            {/* Animated ambient orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="app-orb app-orb-1" />
              <div className="app-orb app-orb-2" />
              <div className="app-orb app-orb-3" />
            </div>

            {/* Noise grain */}
            <div className="fixed inset-0 pointer-events-none z-0 noise-grain" />

            {/* Content */}
            <div className="relative z-10">
              <Navbar isDark={isDark} setIsDark={setIsDark} />
              <main>
                <SectionReveal><Hero /></SectionReveal>
                <SectionReveal delay={0.04}><About /></SectionReveal>
                <SectionReveal delay={0.04}><Education /></SectionReveal>
                <SectionReveal delay={0.04}><Skills /></SectionReveal>
                <SectionReveal delay={0.04}><Projects /></SectionReveal>
                <SectionReveal delay={0.04}><Achievements /></SectionReveal>
                <SectionReveal delay={0.04}><Certifications /></SectionReveal>
                <SectionReveal delay={0.04}><Contact /></SectionReveal>
              </main>
              <Footer />
            </div>

            <WhatsAppButton />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App