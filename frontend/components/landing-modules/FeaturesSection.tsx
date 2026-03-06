'use client';

import { motion } from 'framer-motion';
import { T, SECTION, LABEL_STYLE } from './tokens';

const ROWS = [
    // Row 1 — 3 narrow
    [
        { cls: 'fc-1', icon: '⇌', title: 'XCM Deposits',    desc: 'Bridge PAS from People Chain via native XCM.',          color: T.cyan    },
        { cls: 'fc-2', icon: '⬡', title: 'ETH Bridge',       desc: '5 EVM chains → mUSDC, minted 1:1 on-chain.',           color: '#F59E0B' },
        { cls: 'fc-3', icon: '◎', title: 'Flashloan Shield', desc: 'Manipulation-resistant v5 interest accrual.',           color: '#A78BFA' },
    ],
    // Row 2 — 2 wide (span 6 each)
    [
        { cls: 'fc-4', icon: '◈', title: 'PAS Markets',
          desc: 'Isolated borrow/lend markets for native Polkadot assets. Dynamic LTV up to 85%, real floating APY.',
          color: '#22C55E', wide: true, stat: '85%', statLabel: 'Max LTV' },
        { cls: 'fc-5', icon: '⬥', title: 'Governance Rewards',
          desc: 'Vote on Asset Hub governance and earn score multipliers. Consistency unlocks higher tiers permanently.',
          color: '#818CF8', wide: true, stat: '6 →',  statLabel: 'Tiers' },
    ],
    // Row 3 — 3 narrow
    [
        { cls: 'fc-6', icon: '◇', title: 'mUSDC Markets',  desc: 'Bridged EVM USDC pools with real-time yield.',          color: '#38BDF8' },
        { cls: 'fc-7', icon: '↻', title: 'KredioSwap',     desc: 'Swap PAS, mUSDC and lending positions atomically.',     color: '#F472B6' },
        { cls: 'fc-8', icon: '▲', title: 'Identity Boost', desc: 'On-chain proofs permanently raise starting score.',     color: '#FB923C' },
    ],
] as const;

const ALL = ROWS.flat();

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } };
const card = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };

export function FeaturesSection() {
    return (
        <section style={{ ...SECTION }}>
            <style>{`
                .feat-wrap { max-width: 1200px; margin: 0 auto; width: 100%; }
                .feat-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 16px;
                    width: 100%;
                }
                /* Row 1 */
                .fc-1 { grid-column: 1/3; }
                .fc-2 { grid-column: 3/5; }
                .fc-3 { grid-column: 5/7; }
                /* Row 2 — wide */
                .fc-4 { grid-column: 1/4; }
                .fc-5 { grid-column: 4/7; }
                /* Row 3 */
                .fc-6 { grid-column: 1/3; }
                .fc-7 { grid-column: 3/5; }
                .fc-8 { grid-column: 5/7; }

                @media (max-width: 720px) {
                    .feat-grid { grid-template-columns: repeat(2,1fr); }
                    .fc-1,.fc-2,.fc-3,.fc-4,.fc-5,.fc-6,.fc-7,.fc-8 { grid-column: auto; }
                }
                @media (max-width: 480px) {
                    .feat-grid { grid-template-columns: 1fr; }
                }

                .feat-card {
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(10,12,16,0.5);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    padding: 32px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    cursor: default;
                    min-height: 180px;
                    position: relative;
                    overflow: hidden;
                }
                .feat-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at 0% 0%, rgba(255,255,255,0.04) 0%, transparent 60%);
                    pointer-events: none;
                }
                .feat-card.wide { min-height: 220px; }
                .feat-card:hover {
                    border-color: rgba(255,255,255,0.15);
                    background: rgba(18,22,28,0.7);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.4);
                }
            `}</style>

            <motion.div
                className="feat-wrap"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={container}
            >
                {/* Header */}
                <motion.div variants={card} style={{ marginBottom: '22px' }}>
                    <p style={LABEL_STYLE}>What You Get</p>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', lineHeight: 1.08 }}>
                        Multi-Chain DeFi.{' '}
                        <span style={{ opacity: 0.2 }}>Fair Credit.</span>
                    </h2>
                </motion.div>

                <div className="feat-grid">
                    {ALL.map((f) => {
                        const isWide = 'wide' in f && f.wide;
                        return (
                            <motion.div
                                key={f.title}
                                variants={card}
                                className={`feat-card${isWide ? ' wide' : ''} ${f.cls}`}
                            >
                                {/* Icon */}
                                <div style={{ 
                                    width: 44, height: 44, 
                                    borderRadius: 12, 
                                    background: `rgba(255,255,255,0.03)`, 
                                    border: `1px solid rgba(255,255,255,0.08)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px', color: f.color 
                                }}>
                                    {f.icon}
                                </div>

                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: T.white, marginBottom: '8px', letterSpacing: '-0.02em' }}>{f.title}</p>
                                    <p style={{ fontSize: '13px', color: '#E2E8F0', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>

                                {/* Stat for wide cards */}
                                {'stat' in f && (
                                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                        <span style={{ fontSize: '26px', fontWeight: 700, color: f.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                                            {f.stat}
                                        </span>
                                        <span style={{ fontSize: '8px', fontFamily: 'ui-monospace,monospace', color: '#94A3B8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                            {f.statLabel}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
