interface Props {
  size?: number
  variant?: 'mark' | 'inverse'
  className?: string
}

// Stylized "S" formed as two flowing arcs with a gold checkmark
// in the upper-right counter — the "done" detail. Sits inside a
// rounded navy square (or white square in inverse).
export function StewardLogo({ size = 44, variant = 'mark', className }: Props) {
  const isInverse = variant === 'inverse'
  const containerBg = isInverse ? '#FFFFFF' : '#1B3A6B'
  const stroke = isInverse ? '#1B3A6B' : '#FFFFFF'
  const accent = '#C9A84C'
  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.225),
    background: containerBg,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: isInverse ? '1px solid #E5E7EB' : 'none',
    flexShrink: 0,
  }
  const glyph = Math.round(size * 0.6)
  return (
    <span style={containerStyle} className={className}>
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Steward"
      >
        <path
          d="M48 19 C 44 13, 36 11, 28 13 C 18 16, 16 26, 26 30 C 32 32, 38 32, 42 36 C 48 41, 44 50, 34 51 C 24 52, 18 48, 14 43"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M44 22 L48 26 L54 18"
          stroke={accent}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  )
}
