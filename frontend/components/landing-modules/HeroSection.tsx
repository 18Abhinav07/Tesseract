'use client';

import { motion } from 'framer-motion';
import CpuCircuit from './CpuCircuit';
import { T, SECTION } from './tokens';

const fadeLeft = { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } };
const fadeRight = { hidden: { opacity: 0, x: 28  }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.12 } } };

export function HeroSection() {
    return (
        <section style={{ ...SECTION, display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '40px', alignItems: 'center', justifyContent: 'unset' }}>
            <style>{`
                @keyframes heroScroll { 0%,100%{opacity:.2} 50%{opacity:.8} }
                .hero-scroll-1 { animation: heroScroll 2s  ease-in-out infinite; }
                .hero-scroll-2 { animation: heroScroll 2s  ease-in-out infinite; animation-delay:.25s; }
                .hero-scroll-3 { animation: heroScroll 2s  ease-in-out infinite; animation-delay:.5s; }
                @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.4} }
                .live-dot { animation: livePulse 1.8s ease-in-out infinite; }
                @media (max-width:768px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-circuit { display: none !important; } }
            `}</style>

            {/* Left — copy */}
            <motion.div initial="hidden" animate="show" variants={fadeLeft} className="hero-grid" style={{ zIndex: 1 }}>
                {/* Live badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', fontSize: '9px', letterSpacing: '0.2em', color: T.dim, fontFamily: 'ui-monospace,monospace', marginBottom: '36px' }}>
                    <span className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', display: 'inline-block', flexShrink: 0 }} />
                    LIVE ON POLKADOT TESTNET
                </div>

                <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 78px)', fontWeight: 700, lineHeight: 0.95, letterSpacing: '-0.05em', color: T.white, marginBottom: '28px' }}>
                    Fair Credit<br />
                    <span style={{ color: T.white, opacity: 0.22 }}>on Polkadot.</span>
                </h1>

                <p style={{ fontSize: '14px', lineHeight: 1.85, color: T.dim, maxWidth: '360px', marginBottom: '52px' }}>
                    Fund from any chain. Participate in governance.<br />
                    Unlock tiered borrowing — permanently on-chain.
                </p>

                {/* Scroll indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div className="hero-scroll-1" style={{ width: 18, height: 1.5, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
                        <div className="hero-scroll-2" style={{ width: 18, height: 1.5, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
                        <div className="hero-scroll-3" style={{ width: 18, height: 1.5, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: '8px', fontFamily: 'ui-monospace,monospace', color: T.muted, letterSpacing: '3px', textTransform: 'uppercase' }}>SCROLL</span>
                </div>
            </motion.div>

            {/* Right — CPU Circuit */}
            <motion.div
                initial="hidden" animate="show" variants={fadeRight}
                className="hero-circuit"
                style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div style={{ width: '120%', maxWidth: '800px', marginLeft: '-10%' }}>
                    <CpuCircuit />
                </div>
            </motion.div>
        </section>
    );
}
