import type { CSSProperties } from 'react';

export const T = {
    pink:   '#E81CFF',
    cyan:   '#00E2FF',
    border: 'rgba(255,255,255,0.07)',
    borderH:'rgba(255,255,255,0.14)',
    muted:  '#94A3B8', // was #475569
    sub:    '#CBD5E1', // was #64748B
    dim:    '#E2E8F0', // was #94A3B8
    white:  '#F8FAFC',
} as const;

export const GLASS: CSSProperties = {
    borderRadius:          '14px',
    border:                '1px solid rgba(255,255,255,0.07)',
    background:            'rgba(0,0,0,0.22)',
    backdropFilter:        'blur(16px)',
    WebkitBackdropFilter:  'blur(16px)',
};

/** Shared section wrapper: full viewport height, scroll-snap, flex-column centered */
export const SECTION: CSSProperties = {
    minHeight:       '100vh',   // min so content never gets clipped
    scrollSnapAlign: 'start',
    scrollSnapStop:  'always',
    display:         'flex',
    flexDirection:   'column',
    justifyContent:  'center',
    paddingTop:      '64px',    // clear the sticky nav
    paddingBottom:   '32px',
    position:        'relative',
    boxSizing:       'border-box',
    width:           '100%',
    maxWidth:        '100%',
};

export const LABEL_STYLE: CSSProperties = {
    fontSize:      '9px',
    fontFamily:    'ui-monospace,monospace',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         '#CBD5E1',
    marginBottom:  '14px',
};
