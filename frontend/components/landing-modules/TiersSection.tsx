'use client';

import { motion } from 'framer-motion';
import { T, SECTION, LABEL_STYLE } from './tokens';

const TIERS = [
    { cls: 'tc-1', name: 'ANON',     pts: '0',      ltv: '50%', rate: '12%', color: '#475569', hero: false },
    { cls: 'tc-2', name: 'BRONZE',   pts: '100',    ltv: '60%', rate: '10%', color: '#CD7F32', hero: false },
    { cls: 'tc-3', name: 'SILVER',   pts: '500',    ltv: '70%', rate: '8%',  color: '#94A3B8', hero: false },
    { cls: 'tc-4', name: 'GOLD',     pts: '2,000',  ltv: '78%', rate: '6.5%',color: '#F59E0B', hero: false },
    { cls: 'tc-5', name: 'PLATINUM', pts: '10,000', ltv: '83%', rate: '5%',  color: '#00E2FF', hero: false },
    { cls: 'tc-6', name: 'DIAMOND',  pts: '50,000', ltv: '85%', rate: '3%',  color: '#E81CFF', hero: true },
] as const;

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } } };
const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' as const } } };

export function TiersSection() {
    return (
        <section style={{ ...SECTION }}>
            <style>{`
                .tiers-wrap { max-width: 1200px; margin: 0 auto; width: 100%; }
                .tiers-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 16px;
                    width: 100%;
                }
                /* Row 1 — 4 small equal tiers */
                .tc-1 { grid-column: 1/3; grid-row: 1; }
                .tc-2 { grid-column: 3/5; grid-row: 1; }
                .tc-3 { grid-column: 1/3; grid-row: 2; }
                .tc-4 { grid-column: 3/5; grid-row: 2; }
                /* Row — Platinum wide, Diamond wider */
                .tc-5 { grid-column: 5/7; grid-row: 1; }
                .tc-6 { grid-column: 5/7; grid-row: 2; }

                @media (max-width:720px) {
                    .tiers-grid { grid-template-columns: repeat(2,1fr); }
                    .tc-1,.tc-2,.tc-3,.tc-4,.tc-5,.tc-6 { grid-column:auto; grid-row:auto; }
                }
                @media (max-width:480px) {
                    .tiers-grid { grid-template-columns: 1fr; }
                }

                .tier-card {
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(10,12,16,0.5);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    cursor: default;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    min-height: 200px;
                    position: relative;
                    overflow: hidden;
                }
                .tier-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 60%);
                    pointer-events: none;
                }
                .tier-card:hover { 
                    border-color: rgba(255,255,255,0.15); 
                    background: rgba(18,22,28,0.7);
                    transform: translateY(-4px); 
                    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
                }
                .tier-card.hero-card {
                    border-color: rgba(232,28,255,0.25);
                    background: rgba(232,28,255,0.04);
                    box-shadow: 0 0 40px rgba(232,28,255,0.08);
                }
                .tier-card.hero-card:hover { 
                    border-color: rgba(232,28,255,0.4); 
                    transform: translateY(-5px); 
                    box-shadow: 0 16px 40px rgba(232,28,255,0.15), 0 0 40px rgba(232,28,255,0.1);
                }
            `}</style>

            <motion.div
                className="tiers-wrap"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={container}
            >
                {/* Header */}
                <motion.div variants={card} style={{ marginBottom: '22px' }}>
                    <p style={LABEL_STYLE}>Your Reputation</p>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', lineHeight: 1.08, marginBottom: '6px' }}>
                        Score up.{' '}
                        <span style={{ opacity: 0.35 }}>Borrow better.</span>
                    </h2>
                    <p style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.7, maxWidth: '460px' }}>
                        Every repayment, vote, and bridge permanently builds your on-chain score.
                    </p>
                </motion.div>

                {/* Bento tier grid */}
                <div className="tiers-grid">
                    {TIERS.map((t) => (
                        <motion.div
                            key={t.name}
                            variants={card}
                            className={`tier-card ${t.cls}${t.hero ? ' hero-card' : ''}`}
                        >
                            {/* Tier name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, boxShadow: `0 0 10px ${t.color}AA`, flexShrink: 0, display: 'inline-block' }} />
                                <span style={{ fontSize: '11px', fontFamily: 'ui-monospace,monospace', fontWeight: 700, color: t.color, letterSpacing: '2.5px' }}>
                                    {t.name}
                                </span>
                                {t.hero && (
                                    <span style={{ marginLeft: 'auto', fontSize: '8px', fontFamily: 'ui-monospace,monospace', color: T.pink, letterSpacing: '1px', background: 'rgba(232,28,255,0.15)', padding: '3px 8px', borderRadius: '6px' }}>BEST VALUE</span>
                                )}
                            </div>

                            {/* Min points */}
                            <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: '#94A3B8', marginTop: '-6px' }}>
                                {t.pts} pts min
                            </p>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div>
                                    <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: '#CBD5E1', letterSpacing: '1.5px', marginBottom: '4px', textTransform: 'uppercase' }}>Max LTV</p>
                                    <p style={{ fontSize: '26px', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', lineHeight: 1 }}>{t.ltv}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '9px', fontFamily: 'ui-monospace,monospace', color: '#CBD5E1', letterSpacing: '1.5px', marginBottom: '4px', textTransform: 'uppercase' }}>Int. Rate</p>
                                    <p style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: t.hero ? T.pink : T.white }}>{t.rate}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
