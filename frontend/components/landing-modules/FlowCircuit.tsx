'use client';

import { T } from './tokens';

/**
 * FlowCircuit - user-journey circuit diagram.
 * Top/Bottom Nodes route into a central Multi-Chip Module (MCM) representing the Kredio Core.
 */
export default function FlowCircuit() {
    const CX = 450, CY = 252;
    const NW = 142, NH = 56;
    const EX = 6, EY = 7;
    // MCM Base Plate Dimensions
    const MCM_W = 180, MCM_H = 160;

    const nodes = [
        { id: 'xcm',        label: 'XCM Settler',     sub: 'People Chain', color: '#00E2FF', x: 20,  y: 40 },
        { id: 'eth-bridge', label: 'ETH Bridge',      sub: 'Multi-EVM',    color: '#34D399', x: 379, y: 10 },
        { id: 'identity',   label: 'Identity Proofs', sub: 'Substrate',    color: '#A78BFA', x: 738, y: 40 },
        { id: 'lend-market',label: 'Lending Market',  sub: 'Earn & Borrow',color: '#60A5FA', x: 20,  y: 420 },
        { id: 'pas-market', label: 'PAS Market',      sub: 'Collateral',   color: '#F59E0B', x: 379, y: 460 },
        { id: 'ext-yield',  label: 'External Yield',  sub: 'Auto Routed',  color: '#F472B6', x: 738, y: 420 },
    ];

    const isLeft   = (n: typeof nodes[0]) => n.x < 300;
    const isRight  = (n: typeof nodes[0]) => n.x > 600;
    const isTop    = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y < 300;
    const isBottom = (n: typeof nodes[0]) => !isLeft(n) && !isRight(n) && n.y >= 300;

    const port = (n: typeof nodes[0]) => {
        if (isLeft(n))   return { px: n.x + NW,     py: n.y + NH / 2 };
        if (isRight(n))  return { px: n.x,           py: n.y + NH / 2 };
        if (isTop(n))    return { px: n.x + NW / 2,  py: n.y + NH };
        return                  { px: n.x + NW / 2,  py: n.y };
    };

    // Route differently to different parts of the MCM 
    const mcmPort = (n: typeof nodes[0]) => {
        if (isLeft(n))   return { cx: CX - MCM_W / 2, cy: n.y > CY ? CY + 30 : CY - 30 };
        if (isRight(n))  return { cx: CX + MCM_W / 2, cy: n.y > CY ? CY + 30 : CY - 30 };
        if (isTop(n))    return { cx: CX,             cy: CY - MCM_H / 2 };
        return                  { cx: CX,             cy: CY + MCM_H / 2 };
    };

    const tracePath = (n: typeof nodes[0]) => {
        const { px, py } = port(n);
        const { cx, cy } = mcmPort(n);
        if (isLeft(n) || isRight(n)) return `M ${px} ${py} L ${cx} ${py} L ${cx} ${cy}`;
        return `M ${px} ${py} L ${px} ${cy} L ${cx} ${cy}`;
    };

    const pillLabels = [
        { idx: 0, label: 'Cross-chain Payload', frac: 0.38 },
        { idx: 1, label: 'mUSDC Mint',          frac: 0.34 },
        { idx: 2, label: 'Identity Sync',       frac: 0.38 },
        { idx: 3, label: 'Borrow Action',       frac: 0.38 },
        { idx: 4, label: 'Risk Update',         frac: 0.34 },
        { idx: 5, label: 'Yield Route',         frac: 0.38 },
    ];

    const pillPos = (n: typeof nodes[0], frac: number) => {
        const { px, py } = port(n);
        const { cx, cy } = mcmPort(n);
        if (isLeft(n) || isRight(n)) {
            const s1 = Math.abs(cx - px), s2 = Math.abs(cy - py), tot = s1 + s2, d = tot * frac;
            if (d <= s1) return { x: px + (cx - px) * (d / (s1 || 1)), y: py };
            return { x: cx, y: py + (cy - py) * ((d - s1) / (s2 || 1)) };
        }
        const s1 = Math.abs(cy - py), s2 = Math.abs(cx - px), tot = s1 + s2, d = tot * frac;
        if (d <= s1) return { x: px, y: py + (cy - py) * (d / (s1 || 1)) };
        return { x: px + (cx - px) * ((d - s1) / (s2 || 1)), y: cy };
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <style>{`
                @keyframes fcBreathe { 0%,100%{opacity:.38} 50%{opacity:1}   }
                @keyframes fcDash    { to{stroke-dashoffset:-56} }
                @keyframes fcFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
                .fc-breathe { animation: fcBreathe 3.5s ease-in-out infinite; }
                .fc-dot     { animation: fcBreathe 2.2s ease-in-out infinite; }
                .fc-float   { animation: fcFloat   6s   ease-in-out infinite; }
            `}</style>

            <svg viewBox="0 0 900 540" style={{ width: '100%', height: 'auto', overflow: 'visible', maxWidth: '100%' }}>
                <defs>
                    {nodes.map(n => (
                        <filter key={`fc-gf-${n.id}`} id={`fc-gf-${n.id}`} x="-80%" y="-80%" width="260%" height="260%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    ))}
                    <filter id="mcm-gf" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="12" result="b1" />
                        <feMerge><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="fc-node-shadow" x="-20%" y="-20%" width="160%" height="180%">
                        <feDropShadow dx={EX} dy={EY} stdDeviation="4" floodColor="#000" floodOpacity="0.5" />
                    </filter>
                    <radialGradient id="fc-floor" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.06" />
                        <stop offset="55%" stopColor={T.cyan} stopOpacity="0.02" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="mcm-base" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                    <linearGradient id="fc-side-r" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </linearGradient>
                    <linearGradient id="fc-side-b" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                    </linearGradient>
                    {nodes.map(n => (
                        <linearGradient key={`fc-ng-${n.id}`} id={`fc-ng-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={n.color} stopOpacity="0.18" />
                            <stop offset="100%" stopColor={n.color} stopOpacity="0.02" />
                        </linearGradient>
                    ))}
                    {nodes.map(n => (
                        <linearGradient key={`fc-nse-${n.id}`} id={`fc-nse-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={n.color} stopOpacity="0.14" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
                        </linearGradient>
                    ))}
                    
                    <pattern id="mcm-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    </pattern>
                </defs>

                {/* Floor glow */}
                <ellipse cx={CX + EX * 2} cy={CY + MCM_H/2 + 60} rx={340} ry={70} fill="url(#fc-floor)" opacity={0.8} />

                {/* Traces */}
                {nodes.map((n, i) => (
                    <g key={`fc-tr-${n.id}`}>
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={4} strokeOpacity={0.06} strokeLinecap="round" />
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.25} strokeLinecap="round" />
                        <path d={tracePath(n)} fill="none" stroke={n.color} strokeWidth={1.5} strokeOpacity={0.7} strokeLinecap="round"
                            strokeDasharray="8 50"
                            style={{ animation: `fcDash ${2.5 + i * 0.2}s linear infinite`, animationDelay: `${i * 0.52}s`, strokeDashoffset: 0 }}
                        />
                    </g>
                ))}

                {/* Hidden paths for animateMotion */}
                {nodes.map((n, i) => (
                    <path key={`fc-hp-${i}`} id={`fcp-${i}`} d={tracePath(n)} fill="none" stroke="none" />
                ))}

                {/* Animated packets */}
                {nodes.map((n, i) => (
                    <circle key={`fc-pkt-${n.id}`} r={5.5} fill={n.color} filter={`url(#fc-gf-${n.id})`}>
                        <animateMotion dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite" begin={`${i * 0.52}s`}
                            keyPoints={isBottom(nodes[i]) || isRight(nodes[i]) ? '1;0' : '0;1'}
                            keyTimes="0;1" calcMode="linear">
                            <mpath xlinkHref={`#fcp-${i}`} />
                        </animateMotion>
                    </circle>
                ))}

                {/* Pill labels */}
                {pillLabels.map((p, i) => {
                    const pos = pillPos(nodes[p.idx], p.frac);
                    return (
                        <g key={`fc-pill-${i}`} transform={`translate(${pos.x},${pos.y})`}>
                            <rect x={-42} y={-11} width={84} height={22} rx={11} fill="rgba(0,0,0,0.6)" transform={`translate(${EX * 0.5},${EY * 0.5})`} />
                            <rect x={-42} y={-11} width={84} height={22} rx={11} fill="#0a0b0e" stroke={nodes[p.idx].color} strokeOpacity={0.4} strokeWidth={1} />
                            <rect x={-41} y={-10} width={82} height={1} rx={1} fill="rgba(255,255,255,0.08)" />
                            <text x={0} y={4} textAnchor="middle" fontSize={8} fill={nodes[p.idx].color} fontFamily="ui-monospace,monospace" letterSpacing={0.5} fontWeight="600">
                                {p.label}
                            </text>
                        </g>
                    );
                })}

                {/* Multi-Chip Module (MCM) Core */}
                <g className="fc-float">
                    {/* MCM Base Extrusion */}
                    <polygon points={`${CX + MCM_W / 2},${CY - MCM_H / 2} ${CX + MCM_W / 2 + EX + 2},${CY - MCM_H / 2 + EY + 2} ${CX + MCM_W / 2 + EX + 2},${CY + MCM_H / 2 + EY + 2} ${CX + MCM_W / 2},${CY + MCM_H / 2}`} fill="url(#fc-side-r)" />
                    <polygon points={`${CX - MCM_W / 2},${CY + MCM_H / 2} ${CX + MCM_W / 2},${CY + MCM_H / 2} ${CX + MCM_W / 2 + EX + 2},${CY + MCM_H / 2 + EY + 2} ${CX - MCM_W / 2 + EX + 2},${CY + MCM_H / 2 + EY + 2}`} fill="url(#fc-side-b)" />

                    {/* MCM Base Plate */}
                    <rect x={CX - MCM_W / 2} y={CY - MCM_H / 2} width={MCM_W} height={MCM_H} rx={14} fill="url(#mcm-base)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} filter="url(#fc-node-shadow)" />
                    <rect x={CX - MCM_W / 2} y={CY - MCM_H / 2} width={MCM_W} height={MCM_H} rx={14} fill="url(#mcm-grid)" />
                    <rect x={CX - MCM_W / 2} y={CY - MCM_H / 2} width={MCM_W} height={MCM_H} rx={14} fill="none" stroke="#A78BFA" strokeOpacity={0.15} strokeWidth={1.5} filter="url(#mcm-gf)" className="fc-breathe" />

                    {/* Logic routing traces on the MCM */}
                    <path d={`M ${CX} ${CY-45} L ${CX} ${CY+45} M ${CX-45} ${CY} L ${CX+45} ${CY}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={2} />

                    {/* Sub Chip 1: Kredit Agent (Top Left) */}
                    <g transform={`translate(${CX - 45}, ${CY - 40})`}>
                        <rect x={-35} y={-25} width={70} height={50} rx={6} fill="#020617" stroke="#34D399" strokeWidth={1} strokeOpacity={0.6} />
                        <rect x={-33} y={-23} width={66} height={2} fill="rgba(255,255,255,0.1)" />
                        <text x={0} y={-4} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.9)" fontFamily="ui-monospace,monospace" fontWeight="700">KREDIT</text>
                        <text x={0} y={8} textAnchor="middle" fontSize={7} fill="#34D399" fontFamily="ui-monospace,monospace" letterSpacing={1}>AGENT</text>
                        <circle cx={25} cy={15} r={3} fill="#34D399" className="fc-breathe" />
                    </g>

                    {/* Sub Chip 2: Neural Scorer (Top Right) */}
                    <g transform={`translate(${CX + 45}, ${CY - 40})`}>
                        <rect x={-35} y={-25} width={70} height={50} rx={6} fill="#020617" stroke="#00E2FF" strokeWidth={1} strokeOpacity={0.6} />
                        <rect x={-33} y={-23} width={66} height={2} fill="rgba(255,255,255,0.1)" />
                        <text x={0} y={-4} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.9)" fontFamily="ui-monospace,monospace" fontWeight="700">NEURAL</text>
                        <text x={0} y={8} textAnchor="middle" fontSize={7} fill="#00E2FF" fontFamily="ui-monospace,monospace" letterSpacing={1}>SCORER</text>
                        <circle cx={25} cy={15} r={3} fill="#00E2FF" className="fc-breathe" style={{ animationDelay: '0.5s' }} />
                    </g>

                    {/* Sub Chip 3: Risk Assessor (Bottom Left) */}
                    <g transform={`translate(${CX - 45}, ${CY + 40})`}>
                        <rect x={-35} y={-25} width={70} height={50} rx={6} fill="#020617" stroke="#F59E0B" strokeWidth={1} strokeOpacity={0.6} />
                        <rect x={-33} y={-23} width={66} height={2} fill="rgba(255,255,255,0.1)" />
                        <text x={0} y={-4} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.9)" fontFamily="ui-monospace,monospace" fontWeight="700">RISK</text>
                        <text x={0} y={8} textAnchor="middle" fontSize={7} fill="#F59E0B" fontFamily="ui-monospace,monospace" letterSpacing={1}>ASSESSOR</text>
                        <circle cx={25} cy={15} r={3} fill="#F59E0B" className="fc-breathe" style={{ animationDelay: '1s' }} />
                    </g>

                    {/* Sub Chip 4: Yield Mind (Bottom Right) */}
                    <g transform={`translate(${CX + 45}, ${CY + 40})`}>
                        <rect x={-35} y={-25} width={70} height={50} rx={6} fill="#020617" stroke="#F472B6" strokeWidth={1} strokeOpacity={0.6} />
                        <rect x={-33} y={-23} width={66} height={2} fill="rgba(255,255,255,0.1)" />
                        <text x={0} y={-4} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.9)" fontFamily="ui-monospace,monospace" fontWeight="700">YIELD</text>
                        <text x={0} y={8} textAnchor="middle" fontSize={7} fill="#F472B6" fontFamily="ui-monospace,monospace" letterSpacing={1}>MIND</text>
                        <circle cx={25} cy={15} r={3} fill="#F472B6" className="fc-breathe" style={{ animationDelay: '1.5s' }} />
                    </g>

                    {/* Central Kernel Sync */}
                    <circle cx={CX} cy={CY} r={16} fill="#0B101E" stroke="#A78BFA" strokeWidth={1.5} />
                    <circle cx={CX} cy={CY} r={6} fill="#A78BFA" opacity={0.8} className="fc-breathe" />

                    {/* Pins along the perimeter */}
                    {[-70, -35, 0, 35, 70].map((x, i) => <rect key={`fcpt-${i}`} x={CX + x - 3} y={CY - MCM_H / 2 - 6} width={6} height={7} rx={1} fill="rgba(255,255,255,0.25)" />)}
                    {[-70, -35, 0, 35, 70].map((x, i) => (
                        <g key={`fcpb-${i}`}>
                            <rect x={CX + x - 3} y={CY + MCM_H / 2} width={6} height={7} rx={1} fill="rgba(0,0,0,0.5)" />
                            <rect x={CX + x - 3 + EX} y={CY + MCM_H / 2 + EY} width={6} height={3} rx={1} fill="rgba(0,0,0,0.7)" />
                        </g>
                    ))}
                    {[-60, -20, 20, 60].map((y, i) => (
                        <g key={`fcps-${i}`}>
                            <rect x={CX - MCM_W / 2 - 6} y={CY + y - 3} width={7} height={6} rx={1} fill="rgba(255,255,255,0.25)" />
                            <rect x={CX + MCM_W / 2}     y={CY + y - 3} width={7} height={6} rx={1} fill="rgba(255,255,255,0.15)" />
                        </g>
                    ))}
                </g>

                {/* Node cards */}
                {nodes.map(n => (
                    <g key={`fc-nd-${n.id}`} transform={`translate(${n.x},${n.y})`} filter="url(#fc-node-shadow)">
                        <polygon points={`${NW},0 ${NW + EX},${EY} ${NW + EX},${NH + EY} ${NW},${NH}`} fill={`url(#fc-nse-${n.id})`} opacity={0.75} />
                        <polygon points={`0,${NH} ${NW},${NH} ${NW + EX},${NH + EY} ${EX},${NH + EY}`} fill="rgba(0,0,0,0.52)" />
                        <rect x={-5} y={-5} width={NW + 10} height={NH + 10} rx={12} fill={`url(#fc-ng-${n.id})`} />
                        <rect x={0} y={0} width={NW} height={NH} rx={9} fill="#0b0d10" stroke={n.color} strokeWidth={0.7} strokeOpacity={0.44} />
                        <line x1={9} y1={1} x2={NW - 9} y2={1} stroke="rgba(255,255,255,0.11)" strokeWidth={0.8} />
                        <line x1={1} y1={9} x2={1} y2={NH - 9} stroke="rgba(255,255,255,0.07)" strokeWidth={0.8} />
                        <line x1={9} y1={NH - 1} x2={NW - 9} y2={NH - 1} stroke="rgba(0,0,0,0.38)" strokeWidth={0.6} />
                        <rect x={0} y={0} width={3.5} height={NH} rx={2} fill={n.color} fillOpacity={0.8} />
                        <circle cx={NW - 14} cy={18} r={3.5} fill={n.color} fillOpacity={0.95} />
                        <circle cx={NW - 14} cy={18} r={7} fill={n.color} fillOpacity={0.11} className="fc-dot" />
                        <text x={14} y={21} fontSize={10} fontWeight="700" fill="#F8FAFC" fontFamily="ui-monospace,monospace" letterSpacing={0.2}>{n.label}</text>
                        <text x={14} y={37} fontSize={8} fill="#64748B" fontFamily="ui-monospace,monospace">{n.sub}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
