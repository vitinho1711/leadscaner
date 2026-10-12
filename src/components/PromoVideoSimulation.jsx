import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MapPin, Phone, Globe, Star, Play } from 'lucide-react';
import '../index.css';

const particles = Array.from({ length: 40 });
const leads = [
  { name: 'TechFlow Solutions', phone: '+55 11 9999-0001', address: 'Av. Paulista, SP', rating: '4.9', delay: 1 },
  { name: 'Novaera Digital', phone: '+55 11 9999-0002', address: 'Itaim Bibi, SP', rating: '5.0', delay: 1.5 },
  { name: 'Global Market', phone: '+55 21 9999-0003', address: 'Centro, RJ', rating: '4.8', delay: 2 },
  { name: 'Future Systems', phone: '+55 31 9999-0004', address: 'Savassi, BH', rating: '4.9', delay: 2.2 },
  { name: 'Inova Prime', phone: '+55 41 9999-0005', address: 'Batel, PR', rating: '4.7', delay: 2.8 },
  { name: 'Alpha Corp', phone: '+55 11 9999-0006', address: 'Pinheiros, SP', rating: '5.0', delay: 3.2 },
];

// --- Web Audio API Engine ---
const playTick = (ctx) => {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
};

const playCardPop = (ctx) => {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

const playSweep = (ctx) => {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 3);
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(100, ctx.currentTime + 3);
  
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 3);
};

const playImpact = (ctx) => {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2.5);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 2.5);
};

export default function PromoVideoSimulation() {
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [stage, setStage] = useState(0); // 0: sweep, 1: cards, 2: finale
  const audioCtxRef = useRef(null);
  const droneRef = useRef(null);

  const startExperience = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Start cinematic drone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 3); // fade in
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    droneRef.current = gain;

    setStarted(true);
    playSweep(ctx);
  };

  useEffect(() => {
    if (!started) return;

    // Stage management
    const timer1 = setTimeout(() => {
      setStage(1);
    }, 3000);
    
    const timer2 = setTimeout(() => {
      setStage(2);
      playImpact(audioCtxRef.current);
      // Fade out drone
      if (droneRef.current && audioCtxRef.current) {
        droneRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 2);
      }
    }, 7000);
    
    // Counter animation and card sounds during stage 1
    let counterInterval;
    let cardTimeouts = [];

    if (stage === 1) {
      let current = 0;
      let tickCounter = 0;
      
      counterInterval = setInterval(() => {
        current += 123;
        tickCounter++;
        
        // Play tick sound for the counter
        if (tickCounter % 2 === 0) {
          playTick(audioCtxRef.current);
        }

        if (current >= 5000) {
          setCount(5000);
          clearInterval(counterInterval);
        } else {
          setCount(current);
        }
      }, 50);

      // Schedule pop sounds for the cards
      leads.forEach(lead => {
        const to = setTimeout(() => {
          playCardPop(audioCtxRef.current);
        }, lead.delay * 1000);
        cardTimeouts.push(to);
      });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(counterInterval);
      cardTimeouts.forEach(clearTimeout);
    };
  }, [stage, started]);

  if (!started) {
    return (
      <div className="relative w-full h-screen bg-[#030303] flex flex-col items-center justify-center font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(60deg)_translateY(-100px)_scale(2)] opacity-20"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="z-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.4)]">
            <Target size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 text-center">Lead Scanner <br/><span className="text-blue-500">Cinematic Experience</span></h1>
          <p className="text-gray-400 mb-10 max-w-md text-center">Ligue o som do seu dispositivo para a melhor experiência imersiva.</p>
          <button 
            onClick={startExperience}
            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            <Play size={20} className="fill-black" />
            Iniciar Vídeo
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#030303] overflow-hidden flex items-center justify-center font-sans perspective-1000">
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(60deg)_translateY(-100px)_scale(2)] opacity-30"></div>
      
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: window.innerHeight + 100,
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            y: -100,
            x: `calc(${Math.random() * 200 - 100}px + ${Math.random() * window.innerWidth}px)`
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 2 
          }}
          style={{
            boxShadow: "0 0 10px 2px rgba(59, 130, 246, 0.5)"
          }}
        />
      ))}

      {/* Holographic Scanner */}
      <AnimatePresence>
        {stage < 2 && (
          <motion.div
            className="absolute top-0 w-[200%] h-[20vh] left-[-50%] bg-gradient-to-b from-transparent via-blue-500/20 to-blue-500/80 blur-xl"
            style={{ borderBottom: '2px solid rgba(59, 130, 246, 0.8)' }}
            initial={{ y: '-100vh', opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          />
        )}
      </AnimatePresence>

      {/* Floating Cards (Glassmorphism) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {stage === 1 && leads.map((lead, i) => (
            <motion.div
              key={i}
              className="absolute p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col gap-2 min-w-[280px]"
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                z: -500,
                x: (Math.random() - 0.5) * 800,
                y: (Math.random() - 0.5) * 600
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                z: 0,
                y: '-=50'
              }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              transition={{ duration: 1, delay: lead.delay, type: "spring" }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-white font-bold text-lg">{lead.name}</h3>
                <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-semibold">
                  <Star size={12} className="fill-blue-400" />
                  {lead.rating}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                {lead.address}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} />
                {lead.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1 pt-2 border-t border-white/10">
                <Globe size={14} className="text-blue-400" />
                <span className="text-blue-400 text-xs">Website Identificado</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Counter */}
      <AnimatePresence>
        {stage === 1 && (
          <motion.div
            className="absolute bottom-20 flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-6xl font-black tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              {count.toLocaleString()}+
            </div>
            <div className="text-gray-300 tracking-widest uppercase text-sm mt-2 font-medium">
              Leads Encontrados
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finale Logo */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.6)]">
                <Target size={40} className="text-white" />
              </div>
              <h1 className="text-6xl font-black text-white tracking-tight">
                Lead Scanner
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-2xl text-gray-300 font-light tracking-wide"
            >
              Encontre milhares de clientes em <span className="text-blue-400 font-semibold">segundos</span>.
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              onClick={() => {
                setStage(0);
                setCount(0);
                playSweep(audioCtxRef.current);
                if (droneRef.current && audioCtxRef.current) {
                  droneRef.current.gain.linearRampToValueAtTime(0.2, audioCtxRef.current.currentTime + 1);
                }
              }}
            >
              Repetir Animação
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
