'use client';

import { motion } from 'framer-motion';
import FlowCircuit from './FlowCircuit';
import { T, SECTION, LABEL_STYLE } from './tokens';

export function FlowSection() {
    return (
        <section style={{ ...SECTION, paddingTop: '52px', paddingBottom: '16px' }}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <p style={LABEL_STYLE}>How It Works</p>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: T.white, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                        Every action flows through{' '}
                        <span style={{ color: T.cyan }}>KreditAgent.</span>
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '10px', maxWidth: '480px', margin: '10px auto 0', lineHeight: 1.7 }}>
                        Fund from any chain. Vote in governance. Build history.
                        KreditAgent computes your score and unlocks better rates.
                    </p>
                </div>

                {/* Circuit flow diagram */}
                <div style={{
                    width: '100%',
                    transform: 'perspective(1200px) rotateX(6deg) rotateY(-2deg)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.55)) drop-shadow(0 0 32px rgba(0,226,255,0.05))',
                }}>
                    <FlowCircuit />
                </div>
            </motion.div>
        </section>
    );
}
