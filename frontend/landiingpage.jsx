import { useState, useEffect, useRef } from "react";

const COLORS = {
    bg: "#08080f",
    card: "#0d0d1a",
    border: "#1a1a2e",
    cyan: "#00d4ff",
    purple: "#8b5cf6",
    teal: "#14b8a6",
    amber: "#f59e0b",
    green: "#22c55e",
    rose: "#f43f5e",
    textPrimary: "#ffffff",
    textSecondary: "#94a3b8",
    textMuted: "#475569",
};

const TIERS = [
    { name: "ANON", score: "0–14", ltv: "30%", rate: "22%", color: "#475569", glow: "rgba(71,85,105,0.3)" },
    { name: "BRONZE", score: "15–29", ltv: "42%", rate: "18%", color: "#cd7f32", glow: "rgba(205,127,50,0.3)" },
    { name: "SILVER", score: "30–49", ltv: "55%", rate: "15%", color: "#94a3b8", glow: "rgba(148,163,184,0.3)" },
    { name: "GOLD", score: "50–64", ltv: "65%", rate: "10%", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
    { name: "PLATINUM", score: "65–79", ltv: "75%", rate: "6%", color: "#00d4ff", glow: "rgba(0,212,255,0.3)" },
    { name: "DIAMOND", score: "80–100", ltv: "85%", rate: "3%", color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
];

const FEATURES = [
    {
        icon: "⬡",
        title: "XCM Native Bridge",
        desc: "Transfer PAS from Polkadot People Chain to Asset Hub EVM via native cross-consensus messaging. No wrapped tokens.",
        accent: COLORS.cyan,
    },
    {
        icon: "◈",
        title: "On-Chain Credit Score",
        desc: "ink! smart contract computes your 0–100 credit score entirely on-chain using repayment history and protocol activity.",
        accent: COLORS.purple,
    },
    {
        icon: "⬢",
        title: "Collateralised Borrowing",
        desc: "Deposit PAS as collateral and borrow mUSDC. Your credit tier determines your loan-to-value ratio and interest rate.",
        accent: COLORS.teal,
    },
    {
        icon: "◇",
        title: "Yield-Bearing Lending",
        desc: "Supply mUSDC to the lending pool and earn variable yield based on real-time pool utilisation.",
        accent: COLORS.green,
    },
    {
        icon: "⬟",
        title: "Instant PAS Swap",
        desc: "Oracle-priced on-chain swap contract on Hub EVM. 0.3% fee. Swap PAS to mUSDC without bridging.",
        accent: COLORS.amber,
    },
    {
        icon: "▣",
        title: "Position Dashboard",
        desc: "Single unified view for all borrow and lend positions. Real-time health ratio, credit profile, and tier badge.",
        accent: COLORS.rose,
    },
];

const STEPS = [
    { n: "01", title: "Bridge", desc: "Transfer PAS via XCM from People Chain to Asset Hub EVM using Talisman." },
    { n: "02", title: "Deposit", desc: "Post PAS as collateral in the Kredio protocol on Hub EVM." },
    { n: "03", title: "Borrow", desc: "Borrow mUSDC at your credit tier's LTV rate using MetaMask." },
    { n: "04", title: "Repay & Level Up", desc: "Repay on time to build your on-chain credit score and unlock better tiers." },
];

// ──────────────────────────────────────────────
// Circuit Board Visualization
// ──────────────────────────────────────────────
function CircuitBoard() {
    const nodes = [
        { id: "people-chain", label: "People Chain", sub: "Polkadot", color: COLORS.cyan, x: 80, y: 80 },
        { id: "paseo-relay", label: "Paseo Relay", sub: "Governance", color: COLORS.purple, x: 310, y: 50 },
        { id: "asset-hub", label: "Asset Hub EVM", sub: "Layer 1", color: COLORS.teal, x: 530, y: 80 },
        { id: "credit-score", label: "Credit Score", sub: "ink! Contract", color: COLORS.amber, x: 80, y: 340 },
        { id: "kredio-lend", label: "Kredio Lend", sub: "mUSDC Pool", color: COLORS.green, x: 310, y: 380 },
        { id: "pas-market", label: "PAS Market", sub: "Swap Oracle", color: COLORS.rose, x: 530, y: 340 },
    ];

    const CENTER = { x: 310, y: 215 };

    // Each trace: from node center to chip center, L-shaped
    const traces = nodes.map((n) => {
        const fromX = n.x + 60;
        const fromY = n.y + 22;
        // Determine elbow
        const midX = n.x < CENTER.x ? fromX + (CENTER.x - fromX) * 0.5 : fromX - (fromX - CENTER.x) * 0.5;
        return { id: n.id, color: n.color, fromX, fromY, midX, toX: CENTER.x, toY: CENTER.y };
    });

    const traceLength = (t) => {
        const seg1 = Math.abs(t.midX - t.fromX);
        const seg2 = Math.abs(t.toX - t.midX) + Math.abs(t.toY - t.fromY);
        return seg1 + seg2;
    };

    const tracePath = (t) => {
        return `M ${t.fromX} ${t.fromY} L ${t.midX} ${t.fromY} L ${t.midX} ${t.toY} L ${t.toX} ${t.toY}`;
    };

    const pillLabels = [
        { trace: 0, label: "XCM Transfer", offset: 0.35 },
        { trace: 1, label: "Gov Signal", offset: 0.5 },
        { trace: 2, label: "EVM Tx", offset: 0.4 },
        { trace: 3, label: "Score Update", offset: 0.4 },
        { trace: 4, label: "mUSDC Yield", offset: 0.5 },
        { trace: 5, label: "Collateral", offset: 0.35 },
    ];

    const pillPos = (t, offset) => {
        const seg1 = Math.abs(t.midX - t.fromX);
        const seg2 = Math.abs(t.midX - t.toX);
        const seg3 = Math.abs(t.toY - t.fromY);
        const total = seg1 + seg2 + seg3;
        const target = total * offset;
        if (target <= seg1) {
            const frac = target / (seg1 || 1);
            return { x: t.fromX + (t.midX - t.fromX) * frac, y: t.fromY };
        } else if (target <= seg1 + seg3) {
            const frac = (target - seg1) / (seg3 || 1);
            return { x: t.midX, y: t.fromY + (t.toY - t.fromY) * frac };
        } else {
            const frac = (target - seg1 - seg3) / (seg2 || 1);
            return { x: t.midX + (t.toX - t.midX) * frac, y: t.toY };
        }
    };

    return (
        <div style={{ position: "relative", width: "100%", maxWidth: 640, margin: "0 auto" }}>
            <style>{`
        @keyframes packetMove {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { r: 28; opacity: 0.8; }
          100% { r: 64; opacity: 0; }
        }
        @keyframes pulse-ring2 {
          0% { r: 28; opacity: 0.5; }
          100% { r: 80; opacity: 0; }
        }
        @keyframes node-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes chip-breathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .circuit-packet {
          animation: packetMove 3s ease-in-out infinite;
        }
        .circuit-packet-2 {
          animation: packetMove 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .pulse-r1 {
          animation: pulse-ring 4s ease-out infinite;
        }
        .pulse-r2 {
          animation: pulse-ring2 4s ease-out infinite;
          animation-delay: 1.2s;
        }
        .chip-breathe {
          animation: chip-breathe 3s ease-in-out infinite;
        }
      `}</style>

            <svg viewBox="0 0 640 460" style={{ width: "100%", height: "auto", overflow: "visible" }}>
                <defs>
                    {nodes.map((n) => (
                        <filter key={`glow-${n.id}`} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    ))}
                    <filter id="chip-glow" x="-80%" y="-80%" width="260%" height="260%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {nodes.map((n) => (
                        <linearGradient key={`grad-${n.id}`} id={`grad-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={n.color} stopOpacity="0.15" />
                            <stop offset="100%" stopColor={n.color} stopOpacity="0.05" />
                        </linearGradient>
                    ))}
                </defs>

                {/* Grid dots background */}
                {Array.from({ length: 12 }).map((_, r) =>
                    Array.from({ length: 16 }).map((_, c) => (
                        <circle
                            key={`dot-${r}-${c}`}
                            cx={c * 44 + 8}
                            cy={r * 40 + 8}
                            r={1}
                            fill="#1a1a2e"
                        />
                    ))
                )}

                {/* Traces */}
                {traces.map((t, i) => (
                    <g key={t.id}>
                        <path
                            d={tracePath(t)}
                            fill="none"
                            stroke={t.color}
                            strokeWidth={1.5}
                            strokeOpacity={0.25}
                            strokeLinecap="round"
                        />
                        <path
                            d={tracePath(t)}
                            fill="none"
                            stroke={t.color}
                            strokeWidth={1}
                            strokeOpacity={0.6}
                            strokeLinecap="round"
                            strokeDasharray="4 40"
                            style={{
                                animation: `packetMove 2.8s linear infinite`,
                                animationDelay: `${i * 0.45}s`,
                            }}
                        />
                    </g>
                ))}

                {/* Animated Packets */}
                {traces.map((t, i) => (
                    <circle
                        key={`pkt-${t.id}`}
                        r={3.5}
                        fill={t.color}
                        filter={`url(#glow-${t.id})`}
                        style={{
                            offsetPath: `path("${tracePath(t)}")`,
                            offsetDistance: "0%",
                            animation: `packetTravel 2.8s linear infinite`,
                            animationDelay: `${i * 0.45}s`,
                        }}
                    >
                        <animateMotion
                            dur="2.8s"
                            repeatCount="indefinite"
                            begin={`${i * 0.45}s`}
                            keyPoints={i === 3 ? "1;0" : "0;1"}
                            keyTimes="0;1"
                            calcMode="linear"
                        >
                            <mpath xlinkHref={`#trace-path-${i}`} />
                        </animateMotion>
                    </circle>
                ))}

                {/* Hidden paths for animateMotion */}
                {traces.map((t, i) => (
                    <path key={`hidden-${i}`} id={`trace-path-${i}`} d={tracePath(t)} fill="none" stroke="none" />
                ))}

                {/* Pill labels */}
                {pillLabels.map((p, i) => {
                    const pos = pillPos(traces[p.trace], p.offset);
                    return (
                        <g key={`pill-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
                            <rect
                                x={-36}
                                y={-9}
                                width={72}
                                height={18}
                                rx={9}
                                fill="#0d0d1a"
                                stroke={traces[p.trace].color}
                                strokeOpacity={0.4}
                                strokeWidth={1}
                            />
                            <text
                                x={0}
                                y={4}
                                textAnchor="middle"
                                fontSize={7.5}
                                fill={traces[p.trace].color}
                                fontFamily="'DM Mono', monospace"
                                letterSpacing={0.5}
                            >
                                {p.label}
                            </text>
                        </g>
                    );
                })}

                {/* Center chip pulse rings */}
                <circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={28}
                    fill="none"
                    stroke={COLORS.cyan}
                    strokeWidth={1}
                    strokeOpacity={0}
                    className="pulse-r1"
                />
                <circle
                    cx={CENTER.x}
                    cy={CENTER.y}
                    r={28}
                    fill="none"
                    stroke={COLORS.purple}
                    strokeWidth={0.5}
                    strokeOpacity={0}
                    className="pulse-r2"
                />

                {/* Center chip */}
                <rect
                    x={CENTER.x - 44}
                    y={CENTER.y - 30}
                    width={88}
                    height={60}
                    rx={6}
                    fill="#0d0d1a"
                    stroke={COLORS.cyan}
                    strokeWidth={1.5}
                    filter="url(#chip-glow)"
                    className="chip-breathe"
                />
                {/* CPU grid lines */}
                {[-20, -10, 0, 10, 20].map((offset, i) => (
                    <line
                        key={`cl-${i}`}
                        x1={CENTER.x - 38}
                        y1={CENTER.y + offset / 3}
                        x2={CENTER.x + 38}
                        y2={CENTER.y + offset / 3}
                        stroke={COLORS.cyan}
                        strokeWidth={0.3}
                        strokeOpacity={0.2}
                    />
                ))}
                {[-32, -16, 0, 16, 32].map((offset, i) => (
                    <line
                        key={`cv-${i}`}
                        x1={CENTER.x + offset}
                        y1={CENTER.y - 24}
                        x2={CENTER.x + offset}
                        y2={CENTER.y + 24}
                        stroke={COLORS.cyan}
                        strokeWidth={0.3}
                        strokeOpacity={0.2}
                    />
                ))}
                <text
                    x={CENTER.x}
                    y={CENTER.y - 6}
                    textAnchor="middle"
                    fontSize={8}
                    fill={COLORS.cyan}
                    fontFamily="'DM Mono', monospace"
                    letterSpacing={1.5}
                    fontWeight="600"
                >
                    KREDIO
                </text>
                <text
                    x={CENTER.x}
                    y={CENTER.y + 8}
                    textAnchor="middle"
                    fontSize={6.5}
                    fill={COLORS.textSecondary}
                    fontFamily="'DM Mono', monospace"
                    letterSpacing={1}
                >
                    CORE
                </text>
                {/* CPU pin dots */}
                {[-32, -16, 0, 16, 32].map((x, i) => (
                    <circle key={`pin-t-${i}`} cx={CENTER.x + x} cy={CENTER.y - 30} r={1.5} fill={COLORS.cyan} fillOpacity={0.7} />
                ))}
                {[-32, -16, 0, 16, 32].map((x, i) => (
                    <circle key={`pin-b-${i}`} cx={CENTER.x + x} cy={CENTER.y + 30} r={1.5} fill={COLORS.cyan} fillOpacity={0.7} />
                ))}
                {[-20, 0, 20].map((y, i) => (
                    <circle key={`pin-l-${i}`} cx={CENTER.x - 44} cy={CENTER.y + y} r={1.5} fill={COLORS.cyan} fillOpacity={0.7} />
                ))}
                {[-20, 0, 20].map((y, i) => (
                    <circle key={`pin-r-${i}`} cx={CENTER.x + 44} cy={CENTER.y + y} r={1.5} fill={COLORS.cyan} fillOpacity={0.7} />
                ))}

                {/* Node Cards */}
                {nodes.map((n, i) => (
                    <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                        {/* glow backdrop */}
                        <rect x={-4} y={-4} width={128} height={52} rx={10} fill={n.color} fillOpacity={0.05} />
                        <rect
                            x={0}
                            y={0}
                            width={120}
                            height={44}
                            rx={8}
                            fill="#0d0d1a"
                            stroke={n.color}
                            strokeWidth={1}
                            strokeOpacity={0.5}
                        />
                        {/* accent bar */}
                        <rect x={0} y={0} width={3} height={44} rx={2} fill={n.color} fillOpacity={0.8} />
                        {/* dot indicator */}
                        <circle cx={108} cy={14} r={3.5} fill={n.color} fillOpacity={0.9} />
                        <circle cx={108} cy={14} r={6} fill={n.color} fillOpacity={0.15} className="chip-breathe" />
                        <text
                            x={14}
                            y={17}
                            fontSize={9}
                            fontWeight="700"
                            fill="#ffffff"
                            fontFamily="'DM Mono', monospace"
                            letterSpacing={0.5}
                        >
                            {n.label}
                        </text>
                        <text x={14} y={31} fontSize={7.5} fill={COLORS.textSecondary} fontFamily="'DM Mono', monospace">
                            {n.sub}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

// ──────────────────────────────────────────────
// Navbar
// ──────────────────────────────────────────────
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: "0 32px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: scrolled ? "rgba(8,8,15,0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
                transition: "all 0.3s ease",
            }}
        >
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 900,
                        color: "#000",
                    }}
                >
                    K
                </div>
                <span
                    style={{
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: 3,
                        color: "#fff",
                    }}
                >
                    KREDIO
                </span>
            </div>

            {/* Nav links - desktop */}
            <div
                style={{
                    display: "flex",
                    gap: 36,
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
                className="nav-links"
            >
                {["Lend", "Borrow", "Positions", "Swap", "Bridge"].map((link) => (
                    <a
                        key={link}
                        href="#"
                        style={{
                            color: COLORS.textSecondary,
                            textDecoration: "none",
                            fontSize: 13,
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: 0.5,
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#fff")}
                        onMouseLeave={(e) => (e.target.style.color = COLORS.textSecondary)}
                    >
                        {link}
                    </a>
                ))}
            </div>

            {/* CTA */}
            <button
                style={{
                    padding: "8px 20px",
                    background: "transparent",
                    border: `1px solid ${COLORS.cyan}`,
                    borderRadius: 6,
                    color: COLORS.cyan,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    letterSpacing: 1,
                    cursor: "pointer",
                    transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.cyan;
                    e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = COLORS.cyan;
                }}
            >
                LAUNCH APP
            </button>
        </nav>
    );
}

// ──────────────────────────────────────────────
// Section Fade-In Wrapper
// ──────────────────────────────────────────────
function FadeIn({ children, delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.1 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

// ──────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────
function Hero() {
    return (
        <section
            style={{
                minHeight: "100vh",
                padding: "140px 80px 100px",
                display: "flex",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background grid */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                    pointerEvents: "none",
                }}
            />
            {/* Radial glow top-left */}
            <div
                style={{
                    position: "absolute",
                    top: -200,
                    left: -200,
                    width: 700,
                    height: 700,
                    background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: -300,
                    right: -200,
                    width: 800,
                    height: 800,
                    background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                {/* Left column */}
                <div>
                    <FadeIn delay={0}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 14px",
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 100,
                                marginBottom: 32,
                                background: "rgba(255,255,255,0.02)",
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: COLORS.green,
                                    boxShadow: `0 0 8px ${COLORS.green}`,
                                    animation: "chip-breathe 2s infinite",
                                }}
                            />
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.textSecondary, letterSpacing: 1 }}>
                                LIVE ON POLKADOT TESTNET
                            </span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h1
                            style={{
                                fontSize: "clamp(36px, 4vw, 60px)",
                                fontWeight: 800,
                                lineHeight: 1.1,
                                color: "#fff",
                                fontFamily: "'DM Sans', sans-serif",
                                marginBottom: 24,
                                letterSpacing: -1,
                            }}
                        >
                            Cross-Chain Credit{" "}
                            <span
                                style={{
                                    color: COLORS.cyan,
                                    textShadow: `0 0 40px rgba(0,212,255,0.4)`,
                                }}
                            >
                                on Polkadot.
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <p
                            style={{
                                fontSize: 17,
                                color: COLORS.textSecondary,
                                lineHeight: 1.75,
                                marginBottom: 40,
                                maxWidth: 440,
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Bridge PAS. Post collateral. Borrow mUSDC. Your on-chain history builds a credit score that unlocks better rates — forever.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <button
                                style={{
                                    padding: "14px 32px",
                                    background: COLORS.cyan,
                                    border: "none",
                                    borderRadius: 8,
                                    color: "#000",
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    cursor: "pointer",
                                    boxShadow: `0 0 24px rgba(0,212,255,0.3)`,
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 40px rgba(0,212,255,0.5)`)}
                                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 24px rgba(0,212,255,0.3)`)}
                            >
                                LAUNCH APP →
                            </button>
                            <button
                                style={{
                                    padding: "14px 32px",
                                    background: "transparent",
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: 8,
                                    color: COLORS.textSecondary,
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: 13,
                                    letterSpacing: 1,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = COLORS.cyan;
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = COLORS.border;
                                    e.currentTarget.style.color = COLORS.textSecondary;
                                }}
                            >
                                LEARN MORE
                            </button>
                        </div>
                    </FadeIn>

                    {/* Wallet badges */}
                    <FadeIn delay={0.4}>
                        <div style={{ display: "flex", gap: 12, marginTop: 48, flexWrap: "wrap" }}>
                            {[
                                { name: "MetaMask", desc: "Hub EVM", color: "#f6851b" },
                                { name: "Talisman", desc: "People Chain", color: "#d946ef" },
                            ].map((w) => (
                                <div
                                    key={w.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "8px 16px",
                                        background: COLORS.card,
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: 8,
                                    }}
                                >
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: w.color }} />
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#fff", letterSpacing: 0.5 }}>
                                        {w.name}
                                    </span>
                                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.textMuted }}>
                                        {w.desc}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                {/* Right column - circuit */}
                <FadeIn delay={0.2}>
                    <div style={{ width: "100%" }}>
                        <CircuitBoard />
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

// ──────────────────────────────────────────────
// Stats Bar
// ──────────────────────────────────────────────
function StatsBar() {
    const stats = [
        { value: "420420417", label: "Asset Hub Chain ID", mono: true },
        { value: "6", label: "Credit Tiers", suffix: " Tiers" },
        { value: "85%", label: "Max LTV — Diamond" },
        { value: "3%", label: "Min Rate — Diamond" },
    ];
    return (
        <FadeIn>
            <section
                style={{
                    borderTop: `1px solid ${COLORS.border}`,
                    borderBottom: `1px solid ${COLORS.border}`,
                    padding: "40px 80px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 0,
                }}
            >
                {stats.map((s, i) => (
                    <div
                        key={i}
                        style={{
                            textAlign: "center",
                            padding: "20px 0",
                            borderRight: i < 3 ? `1px solid ${COLORS.border}` : "none",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: s.mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
                                fontSize: s.mono ? 22 : 36,
                                fontWeight: 800,
                                color: COLORS.cyan,
                                letterSpacing: s.mono ? 2 : -1,
                                textShadow: `0 0 20px rgba(0,212,255,0.3)`,
                                marginBottom: 6,
                            }}
                        >
                            {s.value}
                        </div>
                        <div
                            style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 11,
                                color: COLORS.textMuted,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                            }}
                        >
                            {s.label}
                        </div>
                    </div>
                ))}
            </section>
        </FadeIn>
    );
}

// ──────────────────────────────────────────────
// How It Works
// ──────────────────────────────────────────────
function HowItWorks() {
    return (
        <section style={{ padding: "100px 80px", maxWidth: 1280, margin: "0 auto" }}>
            <FadeIn>
                <div style={{ marginBottom: 64, textAlign: "center" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.cyan, letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>
                        Protocol Flow
                    </p>
                    <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
                        How It Works
                    </h2>
                </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
                {STEPS.map((step, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div style={{ position: "relative" }}>
                            {/* connector line */}
                            {i < STEPS.length - 1 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 32,
                                        right: 0,
                                        width: "50%",
                                        height: 1,
                                        background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
                                        opacity: 0.3,
                                        zIndex: 0,
                                    }}
                                />
                            )}
                            <div
                                style={{
                                    margin: "0 12px",
                                    padding: "32px 28px",
                                    background: COLORS.card,
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: 12,
                                    position: "relative",
                                    zIndex: 1,
                                    transition: "border-color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${COLORS.cyan}44`)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
                            >
                                <div
                                    style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: 32,
                                        fontWeight: 800,
                                        color: COLORS.cyan,
                                        opacity: 0.2,
                                        letterSpacing: -1,
                                        marginBottom: 20,
                                    }}
                                >
                                    {step.n}
                                </div>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                                    {step.title}
                                </div>
                                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                                    {step.desc}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

// ──────────────────────────────────────────────
// Credit Tiers
// ──────────────────────────────────────────────
function CreditTiers() {
    return (
        <section style={{ padding: "100px 80px", background: "#0a0a12" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <FadeIn>
                    <div style={{ marginBottom: 64, textAlign: "center" }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.purple, letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>
                            Credit System
                        </p>
                        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 16 }}>
                            Build Your On-Chain Reputation
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: COLORS.textSecondary, maxWidth: 560, margin: "0 auto" }}>
                            Every repayment, deposit, and interaction advances your score. Better tiers unlock dramatically better borrowing terms.
                        </p>
                    </div>
                </FadeIn>

                {/* Progress track */}
                <FadeIn delay={0.1}>
                    <div style={{ marginBottom: 48, padding: "0 12px" }}>
                        <div
                            style={{
                                height: 4,
                                background: COLORS.border,
                                borderRadius: 2,
                                position: "relative",
                                overflow: "visible",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    background: `linear-gradient(90deg, ${COLORS.textMuted}, ${COLORS.amber}, ${COLORS.textSecondary}, ${COLORS.amber}, ${COLORS.cyan}, #a78bfa)`,
                                    borderRadius: 2,
                                }}
                            />
                        </div>
                    </div>
                </FadeIn>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                    {TIERS.map((tier, i) => (
                        <FadeIn key={tier.name} delay={i * 0.08}>
                            <div
                                style={{
                                    padding: "28px 20px",
                                    background: tier.name === "DIAMOND" ? `rgba(167,139,250,0.06)` : COLORS.card,
                                    border: `1px solid ${tier.name === "DIAMOND" ? tier.color : COLORS.border}`,
                                    borderRadius: 12,
                                    position: "relative",
                                    overflow: "hidden",
                                    transition: "transform 0.3s, box-shadow 0.3s",
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = `0 8px 32px ${tier.glow}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {tier.name === "DIAMOND" && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            padding: "4px 10px",
                                            background: `${tier.color}22`,
                                            borderBottomLeftRadius: 8,
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: 8,
                                            color: tier.color,
                                            letterSpacing: 1,
                                        }}
                                    >
                                        BEST
                                    </div>
                                )}
                                {/* Tier indicator dot */}
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, boxShadow: `0 0 12px ${tier.color}`, marginBottom: 16 }} />

                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: tier.color, letterSpacing: 2, marginBottom: 4 }}>
                                    {tier.name}
                                </div>
                                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 20 }}>
                                    SCORE {tier.score}
                                </div>

                                <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                    <div>
                                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>MAX LTV</div>
                                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff" }}>{tier.ltv}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>INTEREST</div>
                                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 800, color: tier.name === "DIAMOND" ? tier.color : "#fff" }}>
                                            {tier.rate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ──────────────────────────────────────────────
// Feature Highlights
// ──────────────────────────────────────────────
function Features() {
    return (
        <section style={{ padding: "100px 80px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <FadeIn>
                    <div style={{ marginBottom: 64, textAlign: "center" }}>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.teal, letterSpacing: 3, marginBottom: 16, textTransform: "uppercase" }}>
                            Protocol Features
                        </p>
                        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
                            Everything You Need
                        </h2>
                    </div>
                </FadeIn>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                    {FEATURES.map((f, i) => (
                        <FadeIn key={i} delay={(i % 3) * 0.1}>
                            <div
                                style={{
                                    padding: "32px",
                                    background: COLORS.card,
                                    border: `1px solid ${COLORS.border}`,
                                    borderRadius: 12,
                                    transition: "all 0.3s",
                                    cursor: "default",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = `${f.accent}44`;
                                    e.currentTarget.style.background = `rgba(13,13,26,0.95)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = COLORS.border;
                                    e.currentTarget.style.background = COLORS.card;
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        border: `1px solid ${f.accent}44`,
                                        borderRadius: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        color: f.accent,
                                        marginBottom: 24,
                                        background: `${f.accent}0d`,
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7 }}>
                                    {f.desc}
                                </p>
                                {/* corner accent */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        width: 60,
                                        height: 60,
                                        background: `radial-gradient(circle at bottom right, ${f.accent}10, transparent 70%)`,
                                        borderRadius: "0 0 12px 0",
                                    }}
                                />
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ──────────────────────────────────────────────
// CTA Banner
// ──────────────────────────────────────────────
function CTABanner() {
    return (
        <FadeIn>
            <section style={{ padding: "0 80px 100px" }}>
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "64px 80px",
                        background: COLORS.card,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 40,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: -100,
                            right: -100,
                            width: 400,
                            height: 400,
                            background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 60%)",
                            pointerEvents: "none",
                        }}
                    />
                    <div>
                        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 12 }}>
                            Start at ANON. Earn your way to{" "}
                            <span style={{ color: "#a78bfa", textShadow: "0 0 20px rgba(167,139,250,0.4)" }}>DIAMOND.</span>
                        </h2>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: COLORS.textSecondary }}>
                            Your on-chain credit history is permanent, portable, and built into every transaction.
                        </p>
                    </div>
                    <button
                        style={{
                            whiteSpace: "nowrap",
                            padding: "16px 40px",
                            background: COLORS.cyan,
                            border: "none",
                            borderRadius: 8,
                            color: "#000",
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: 1,
                            cursor: "pointer",
                            boxShadow: `0 0 32px rgba(0,212,255,0.3)`,
                            transition: "box-shadow 0.2s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 50px rgba(0,212,255,0.5)`)}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 32px rgba(0,212,255,0.3)`)}
                    >
                        LAUNCH APP →
                    </button>
                </div>
            </section>
        </FadeIn>
    );
}

// ──────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────
function Footer() {
    return (
        <footer
            style={{
                borderTop: `1px solid ${COLORS.border}`,
                padding: "64px 80px 40px",
            }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 80, marginBottom: 64 }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                            <div
                                style={{
                                    width: 28,
                                    height: 28,
                                    background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`,
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    fontWeight: 900,
                                    color: "#000",
                                }}
                            >
                                K
                            </div>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 16, letterSpacing: 3, color: "#fff" }}>
                                KREDIO
                            </span>
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7, maxWidth: 320, marginBottom: 20 }}>
                            Cross-chain credit protocol on Polkadot. Bridge, borrow, and build your on-chain reputation.
                        </p>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 6,
                                background: "rgba(139,92,246,0.06)",
                            }}
                        >
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.purple, letterSpacing: 1 }}>
                                BUILT ON POLKADOT ASSET HUB
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                            Protocol
                        </p>
                        {["Lend", "Borrow", "Swap", "Bridge", "Positions"].map((link) => (
                            <div key={link} style={{ marginBottom: 12 }}>
                                <a
                                    href="#"
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: 14,
                                        color: COLORS.textSecondary,
                                        textDecoration: "none",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.target.style.color = "#fff")}
                                    onMouseLeave={(e) => (e.target.style.color = COLORS.textSecondary)}
                                >
                                    {link}
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* CTA column */}
                    <div>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
                            Get Started
                        </p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
                            Connect your wallets and start building credit on Polkadot's native asset infrastructure.
                        </p>
                        <button
                            style={{
                                padding: "12px 24px",
                                background: "transparent",
                                border: `1px solid ${COLORS.cyan}`,
                                borderRadius: 8,
                                color: COLORS.cyan,
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 12,
                                letterSpacing: 1,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = COLORS.cyan;
                                e.currentTarget.style.color = "#000";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = COLORS.cyan;
                            }}
                        >
                            LAUNCH APP
                        </button>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        paddingTop: 32,
                        borderTop: `1px solid ${COLORS.border}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 20,
                        flexWrap: "wrap",
                    }}
                >
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.5 }}>
                        © 2025 Kredio. Polkadot Testnet.
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.5 }}>
                        Chain ID:{" "}
                        <span style={{ color: COLORS.cyan }}>420420417</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}

// ──────────────────────────────────────────────
// App Root
// ──────────────────────────────────────────────
export default function KredioLanding() {
    return (
        <div
            style={{
                background: COLORS.bg,
                minHeight: "100vh",
                color: "#fff",
                overflowX: "hidden",
            }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #08080f; }
        
        @keyframes chip-breathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
        }
        @media (max-width: 768px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .tiers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cta-flex { flex-direction: column !important; text-align: center !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
            <Navbar />
            <Hero />
            <StatsBar />
            <HowItWorks />
            <CreditTiers />
            <Features />
            <CTABanner />
            <Footer />
        </div>
    );
}