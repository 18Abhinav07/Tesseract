'use client';

import React from "react";

export interface CpuArchitectureSvgProps {
    className?: string;
    width?: string;
    height?: string;
}

export default function CpuCircuit({
    className = "",
    width = "100%",
    height = "100%",
}: CpuArchitectureSvgProps) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* SVG container with visible overflow for glowing filters */}
            <svg
                className={className}
                width={width}
                height={height}
                viewBox="0 0 1200 600"
                style={{ overflow: 'visible', userSelect: 'none' }}
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="pins" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>

                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    </pattern>
                </defs>

                {/* --- 1. Background Grid Traces --- */}
                <g fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1">
                    <path d="M 40 30 H 1160" />
                    <path d="M 40 570 H 1160" />
                    <path d="M 230 30 V 570" />
                    <path d="M 620 30 V 100" />
                    <path d="M 620 500 V 570" />
                    <path d="M 880 30 V 570" />
                </g>
                <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1">
                    <path d="M 20 60 V 20 H 60" />
                    <path d="M 1180 60 V 20 H 1140" />
                    <path d="M 20 540 V 580 H 60" />
                    <path d="M 1180 540 V 580 H 1140" />
                </g>

                {/* --- 2. Active Path Traces --- */}
                <g fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Source to Left Infra */}
                    <path id="p1" d="M 150 80 H 190 Q 200 80 200 90 V 132 Q 200 142 210 142 H 230" stroke="#00E2FF" opacity={0.3} />
                    <path id="p2" d="M 150 160 H 190 Q 200 160 200 150 V 152 Q 200 142 210 142 H 230" stroke="#00E2FF" opacity={0.3} />
                    <path id="p3" d="M 150 240 H 190 Q 200 240 200 250 V 292 Q 200 302 210 302 H 230" stroke="#00E2FF" opacity={0.3} />
                    <path id="p4" d="M 150 320 H 190 Q 200 320 200 310 V 312 Q 200 302 210 302 H 230" stroke="#00E2FF" opacity={0.2} />
                    <path id="p5" d="M 150 400 H 190 Q 200 400 200 410 V 412 Q 200 422 210 422 H 230" stroke="#00E2FF" opacity={0.2} />
                    
                    {/* Infra to Core */}
                    <path id="p6" d="M 360 142 H 420" stroke="#00E2FF" opacity={0.4} />
                    <path id="p7" d="M 360 302 H 420" stroke="rgba(255,255,255,0.4)" opacity={0.4} />
                    <path id="p8" d="M 360 422 H 420" stroke="rgba(255,255,255,0.4)" opacity={0.4} />
                    
                    {/* Core to Right Infra */}
                    <path id="p9"  d="M 820 192 H 880" stroke="#8B5CF6" opacity={0.4} />
                    <path id="p10" d="M 820 322 H 880" stroke="#8B5CF6" opacity={0.4} />
                    <path id="p11" d="M 820 442 H 880" stroke="#8B5CF6" opacity={0.4} />

                    {/* Right Infra to Dest */}
                    <path id="p12" d="M 1010 192 H 1060" stroke="#8B5CF6" opacity={0.3} />
                    <path id="p13" d="M 1010 322 H 1060" stroke="#8B5CF6" opacity={0.3} />
                    <path id="p14" d="M 1010 442 H 1060" stroke="#8B5CF6" opacity={0.3} />

                    {/* Feedback Rails */}
                    <path id="p15" d="M 1160 458 H 1175 Q 1185 458 1185 468 V 570 Q 1185 580 1175 580 H 30 Q 20 580 20 570 V 90 Q 20 80 30 80 H 40" stroke="#8B5CF6" opacity={0.2} strokeDasharray="4 6" />
                </g>

                {/* --- 3. Internal Traces (Inside the Chip) --- */}
                <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    {/* Left entering */}
                    <path d="M 420 142 H 440" />
                    <path d="M 420 302 H 520" />
                    <path d="M 420 422 H 440" />
                    
                    {/* Right leaving */}
                    <path d="M 800 192 H 820" />
                    <path d="M 720 322 H 820" />
                    <path d="M 800 442 H 820" />

                    {/* Kernel to quadrants */}
                    <path d="M 500 180 Q 500 192 520 192" />
                    <path d="M 740 180 Q 740 192 720 192" />
                </g>

                {/* --- 4. Tiers & Rails --- */}
                <g>
                    <path d="M 160 30 H 1160" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 4" fill="none" />
                    
                    {[
                        { title: 'ANON', x: 160, color: '#64748B' },
                        { title: 'BRONZE', x: 360, color: '#CD7F32' },
                        { title: 'SILVER', x: 560, color: '#C0C0C0' },
                        { title: 'GOLD', x: 760, color: '#FFD700' },
                        { title: 'PLATINUM', x: 960, color: '#E5E4E2' },
                        { title: 'DIAMOND', x: 1160, color: '#B9F2FF' },
                    ].map((t, i) => {
                        return (
                            <g key={t.title}>
                                <circle cx={t.x} cy={30} r={3.5} fill="none" stroke={t.color} strokeWidth={1}>
                                    <animate attributeName="opacity" values={"0.2; 1; 0.2; 0.2; 0.2; 0.2; 0.2".split(';').map((v, idx) => idx === i ? "1" : "0.2").join(';')} keyTimes="0; 0.16; 0.33; 0.5; 0.66; 0.83; 1" dur="12s" repeatCount="indefinite" />
                                </circle>
                                <text x={t.x} y={48} fontSize={8} fill={t.color} textAnchor="middle" fontFamily="ui-monospace,monospace" letterSpacing="0.05em">
                                    <animate attributeName="opacity" values={"0.4; 1; 0.4; 0.4; 0.4; 0.4; 0.4".split(';').map((v, idx) => idx === i ? "1" : "0.4").join(';')} keyTimes="0; 0.16; 0.33; 0.5; 0.66; 0.83; 1" dur="12s" repeatCount="indefinite" />
                                    {t.title}
                                </text>
                            </g>
                        )
                    })}
                </g>

                <text x={620} y={590} fontSize={8} fill="rgba(255,255,255,0.25)" textAnchor="middle" letterSpacing="0.15em" fontFamily="ui-monospace,monospace">REPAY → SCORE HISTORY → TIER UPGRADE</text>

                {/* --- 5. Animated Orbs --- */}
                <circle r="2" fill="#00E2FF"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0s"><mpath href="#p1" /></animateMotion></circle>
                <circle r="2" fill="#00E2FF"><animateMotion dur="2.4s" repeatCount="indefinite" begin="0.8s"><mpath href="#p2" /></animateMotion></circle>
                <circle r="2" fill="#00E2FF"><animateMotion dur="2.8s" repeatCount="indefinite" begin="0.4s"><mpath href="#p3" /></animateMotion></circle>

                <circle r="2" fill="#00E2FF"><animateMotion dur="1s" repeatCount="indefinite" begin="0s"><mpath href="#p6" /></animateMotion></circle>
                <circle r="2" fill="#FFFFFF" opacity="0.8"><animateMotion dur="1.2s" repeatCount="indefinite" begin="0.5s"><mpath href="#p7" /></animateMotion></circle>
                
                <circle r="2" fill="#8B5CF6"><animateMotion dur="1s" repeatCount="indefinite" begin="0.2s"><mpath href="#p10" /></animateMotion></circle>
                <circle r="2" fill="#8B5CF6"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0.7s"><mpath href="#p12" /></animateMotion></circle>
                <circle r="2" fill="#8B5CF6"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0.3s"><mpath href="#p13" /></animateMotion></circle>

                {/* --- 6. Zone A: Sources (x=40) --- */}
                <g fontFamily="ui-monospace,monospace">
                    {[
                        { y: 64, title: 'PEOPLE CHAIN', sub: 'XCM · PAS' },
                        { y: 144, title: 'ASSET HUB', sub: 'PAS · mUSDC' },
                        { y: 224, title: 'SEPOLIA', sub: 'ETH' },
                        { y: 304, title: 'BASE / ARB', sub: 'ETH' },
                        { y: 384, title: 'mUSDC', sub: 'STABLE' },
                    ].map((s, i) => (
                        <g key={i}>
                            <rect x={40} y={s.y} width={110} height={32} rx={4} fill="rgba(0,226,255,0.02)" stroke="rgba(0,226,255,0.15)" strokeWidth={1} />
                            <text x={95} y={s.y + 13} fontSize={10} fontWeight={600} letterSpacing="0.05em" fill="rgba(0,226,255,0.8)" textAnchor="middle">{s.title}</text>
                            <text x={95} y={s.y + 24} fontSize={7} fill="rgba(255,255,255,0.4)" textAnchor="middle">{s.sub}</text>
                        </g>
                    ))}
                </g>

                {/* --- 7. Zone B: Left Infra (x=230) --- */}
                <g fontFamily="ui-monospace,monospace">
                    {[
                        { y: 120, title: 'XCM RECEIVER', sub: 'Cross-chain Sync' },
                        { y: 280, title: 'ETH BRIDGE', sub: 'Hyperbridge Msg' },
                        { y: 400, title: 'SWAP ROUTER', sub: 'KredioSwap Core' },
                    ].map((n, i) => (
                        <g key={i}>
                            <rect x={230} y={n.y} width={130} height={44} rx={6} fill="rgba(0,226,255,0.02)" stroke="rgba(0,226,255,0.2)" strokeWidth={1} />
                            <text x={295} y={n.y + 19} fontSize={10} fontWeight={600} letterSpacing="0.05em" fill="#00E2FF" textAnchor="middle">{n.title}</text>
                            <text x={295} y={n.y + 32} fontSize={7} fill="rgba(255,255,255,0.4)" textAnchor="middle">{n.sub}</text>
                        </g>
                    ))}
                </g>

                {/* --- 8. Zone C: Core Engine Module --- */}
                <g fontFamily="ui-monospace,monospace">
                    {/* Connection Pins */}
                    <g fill="url(#pins)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5">
                        {[165, 231, 298, 364, 431].map(y => (
                            <React.Fragment key={y}>
                                <rect x={415} y={y-2} width={10} height={4} rx={1} />
                                <rect x={815} y={y-2} width={10} height={4} rx={1} />
                            </React.Fragment>
                        ))}
                    </g>

                    {/* Outer Shell */}
                    <rect x={420} y={100} width={400} height={400} rx={16} fill="#03040B" stroke="rgba(255,255,255,0.05)" strokeWidth={1} style={{ filter: 'drop-shadow(0px 16px 24px rgba(0,0,0,0.8))' }} />
                    <rect x={422} y={102} width={396} height={396} rx={14} fill="url(#grid)" stroke="none" />

                    {/* 4 Inner Processors */}
                    {[
                        { x: 440, y: 120, c: '#34D399', t: 'KREDIT AGENT', s: 'Deterministic Score' },
                        { x: 640, y: 120, c: '#00E2FF', t: 'NEURAL SCORER', s: 'Anomaly Inference' },
                        { x: 440, y: 350, c: '#F59E0B', t: 'RISK ASSESSOR', s: 'Volatility Engine' },
                        { x: 640, y: 350, c: '#F472B6', t: 'YIELD MIND', s: 'Capital Routing' }
                    ].map((m, i) => (
                        <g key={i}>
                            <rect x={m.x} y={m.y} width={160} height={70} rx={6} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                            <text x={m.x + 80} y={m.y + 30} fontSize={9} fontWeight={700} fill={m.c} letterSpacing="0.1em" textAnchor="middle">{m.t}</text>
                            <text x={m.x + 80} y={m.y + 44} fontSize={7} fill="rgba(255,255,255,0.4)" textAnchor="middle">{m.s}</text>
                            <rect x={m.x + 4} y={m.y + 4} width={2} height={2} fill={m.c} opacity={0.5} />
                            <rect x={m.x + 154} y={m.y + 4} width={2} height={2} fill={m.c} opacity={0.5} />
                            <rect x={m.x + 4} y={m.y + 64} width={2} height={2} fill={m.c} opacity={0.5} />
                            <rect x={m.x + 154} y={m.y + 64} width={2} height={2} fill={m.c} opacity={0.5} />
                        </g>
                    ))}

                    {/* Center Block Badge (Kernel) */}
                    <g>
                        <rect x={520} y={260} width={200} height={80} rx={8} fill="#05060A" stroke="#1E293B" strokeWidth={1} />
                        <rect x={522} y={262} width={196} height={76} rx={6} fill="url(#grid)" stroke="none" />
                        <text x={620} y={296} fontSize={14} fontWeight={800} fill="#FFFFFF" letterSpacing="0.15em" textAnchor="middle">KREDIO</text>
                        <text x={620} y={312} fontSize={7} fontWeight={600} fill="#64748B" letterSpacing="0.2em" textAnchor="middle">AGENT CLUSTER · v4</text>
                    </g>
                </g>

                {/* --- 9. Zone D: Right Infra (x=880) --- */}
                <g fontFamily="ui-monospace,monospace">
                    {[
                        { y: 170, title: 'LEND MARKET', sub: 'KredioLending v5' },
                        { y: 300, title: 'BORROW MARKET', sub: 'Tiered LTV · 85% Max' },
                        { y: 420, title: 'PAS MARKET', sub: 'KredioPASMarket v5' },
                    ].map((n, i) => (
                        <g key={i}>
                            <rect x={880} y={n.y} width={130} height={44} rx={6} fill="rgba(139,92,246,0.02)" stroke="rgba(139,92,246,0.2)" strokeWidth={1} />
                            <text x={945} y={n.y + 19} fontSize={10} fontWeight={600} letterSpacing="0.05em" fill="#8B5CF6" textAnchor="middle">{n.title}</text>
                            <text x={945} y={n.y + 32} fontSize={7} fill="rgba(255,255,255,0.4)" textAnchor="middle">{n.sub}</text>
                        </g>
                    ))}
                </g>

                {/* --- 10. Zone E: Outputs (x=1060) --- */}
                <g fontFamily="ui-monospace,monospace">
                    {[
                        { y: 176, title: 'SUPPLY', sub: 'Earn yield' },
                        { y: 306, title: 'BORROW', sub: 'Tiered rates' },
                        { y: 426, title: 'SWAP/REPAY', sub: 'KredioSwap' },
                    ].map((s, i) => (
                        <g key={i}>
                            <rect x={1060} y={s.y} width={100} height={32} rx={4} fill="rgba(139,92,246,0.02)" stroke="rgba(139,92,246,0.15)" strokeWidth={1} />
                            <text x={1110} y={s.y + 13} fontSize={10} fontWeight={600} letterSpacing="0.05em" fill="rgba(139,92,246,0.8)" textAnchor="middle">{s.title}</text>
                            <text x={1110} y={s.y + 24} fontSize={7} fill="rgba(255,255,255,0.4)" textAnchor="middle">{s.sub}</text>
                        </g>
                    ))}
                </g>

            </svg>
        </div>
    );
}
