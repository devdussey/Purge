# Purge™ Logo Designs

## Logo Concept A: Shield + Circuit (Recommended)

### Full Color Version
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Shield Background -->
  <defs>
    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6B2FFF;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Shield Shape -->
  <path d="M100 20 L160 50 L160 110 Q160 150 100 180 Q40 150 40 110 L40 50 Z"
        fill="url(#shieldGradient)"
        filter="url(#glow)"
        stroke="#00D4FF"
        stroke-width="2"/>

  <!-- Circuit Pattern -->
  <g stroke="#FFFFFF" stroke-width="2" fill="none" opacity="0.8">
    <line x1="100" y1="60" x2="100" y2="80" />
    <circle cx="100" cy="85" r="5" fill="#FFFFFF"/>
    <line x1="100" y1="90" x2="80" y2="110" />
    <line x1="100" y1="90" x2="120" y2="110" />
    <circle cx="80" cy="115" r="5" fill="#00FF88"/>
    <circle cx="120" cy="115" r="5" fill="#00FF88"/>
    <line x1="80" y1="120" x2="80" y2="140" />
    <line x1="120" y1="120" x2="120" y2="140" />
  </g>

  <!-- Letter P -->
  <text x="100" y="155"
        font-family="Inter, sans-serif"
        font-size="80"
        font-weight="bold"
        fill="#FFFFFF"
        text-anchor="middle">P</text>
</svg>
```

---

## Logo Concept B: Hexagon Tech

### Full Color Version
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6B2FFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00D4FF;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Hexagon -->
  <path d="M100 30 L160 65 L160 135 L100 170 L40 135 L40 65 Z"
        fill="url(#hexGradient)"
        stroke="#00D4FF"
        stroke-width="3"/>

  <!-- Inner Hexagon -->
  <path d="M100 50 L140 72.5 L140 127.5 L100 150 L60 127.5 L60 72.5 Z"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="2"
        opacity="0.5"/>

  <!-- P Letter with Circuit -->
  <text x="100" y="135"
        font-family="Inter, sans-serif"
        font-size="70"
        font-weight="bold"
        fill="#FFFFFF"
        text-anchor="middle">P</text>

  <!-- Tech dots -->
  <circle cx="100" cy="60" r="4" fill="#00FF88"/>
  <circle cx="100" cy="140" r="4" fill="#00FF88"/>
  <circle cx="70" cy="80" r="3" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="130" cy="80" r="3" fill="#FFFFFF" opacity="0.6"/>
</svg>
```

---

## Logo Concept C: Minimal Shield + P

### Full Color Version
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6B2FFF;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Simple Shield Outline -->
  <path d="M100 40 L140 55 L140 100 Q140 130 100 150 Q60 130 60 100 L60 55 Z"
        fill="none"
        stroke="url(#minimalGradient)"
        stroke-width="6"/>

  <!-- Bold P -->
  <text x="100" y="125"
        font-family="Inter, sans-serif"
        font-size="60"
        font-weight="900"
        fill="url(#minimalGradient)"
        text-anchor="middle">P</text>

  <!-- Accent Line -->
  <line x1="100" y1="135" x2="100" y2="145"
        stroke="#00FF88"
        stroke-width="4"
        stroke-linecap="round"/>
</svg>
```

---

## Logo Concept D: Circular Badge

### Full Color Version
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#6B2FFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00D4FF;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="bgGradient">
      <stop offset="0%" style="stop-color:#1E2749;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0A0E27;stop-opacity:1" />
    </radialGradient>
  </defs>

  <!-- Background Circle -->
  <circle cx="100" cy="100" r="90" fill="url(#bgGradient)"/>

  <!-- Outer Ring -->
  <circle cx="100" cy="100" r="85"
          fill="none"
          stroke="url(#circleGradient)"
          stroke-width="4"/>

  <!-- Inner Ring -->
  <circle cx="100" cy="100" r="70"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="1"
          opacity="0.3"/>

  <!-- P Letter -->
  <text x="100" y="125"
        font-family="Inter, sans-serif"
        font-size="70"
        font-weight="bold"
        fill="#FFFFFF"
        text-anchor="middle">P</text>

  <!-- Shield Icon (small) -->
  <path d="M100 50 L110 55 L110 65 Q110 70 100 75 Q90 70 90 65 L90 55 Z"
        fill="#00FF88"/>
</svg>
```

---

## Icon Versions (App Icon - 512x512)

### Concept A: App Icon
```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="appGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00D4FF"/>
      <stop offset="100%" style="stop-color:#6B2FFF"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="#0A0E27"/>

  <!-- Shield -->
  <path d="M256 100 L380 150 L380 280 Q380 360 256 430 Q132 360 132 280 L132 150 Z"
        fill="url(#appGradient)"/>

  <!-- P Letter -->
  <text x="256" y="340"
        font-family="Inter"
        font-size="180"
        font-weight="bold"
        fill="#FFFFFF"
        text-anchor="middle">P</text>
</svg>
```

---

## Monochrome Versions (for printing/dark mode)

### White on Transparent
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 40 L140 55 L140 100 Q140 130 100 150 Q60 130 60 100 L60 55 Z"
        fill="none"
        stroke="#FFFFFF"
        stroke-width="6"/>
  <text x="100" y="125"
        font-family="Inter"
        font-size="60"
        font-weight="900"
        fill="#FFFFFF"
        text-anchor="middle">P</text>
</svg>
```

### Black on Transparent
```svg
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M100 40 L140 55 L140 100 Q140 130 100 150 Q60 130 60 100 L60 55 Z"
        fill="none"
        stroke="#000000"
        stroke-width="6"/>
  <text x="100" y="125"
        font-family="Inter"
        font-size="60"
        font-weight="900"
        fill="#000000"
        text-anchor="middle">P</text>
</svg>
```

---

## Text Logo (for headers/footers)

### Horizontal Lockup
```svg
<svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00D4FF"/>
      <stop offset="100%" style="stop-color:#6B2FFF"/>
    </linearGradient>
  </defs>

  <!-- Shield Icon -->
  <path d="M40 25 L60 32 L60 52 Q60 65 40 75 Q20 65 20 52 L20 32 Z"
        fill="url(#textGradient)"/>

  <!-- Text -->
  <text x="80" y="65"
        font-family="Inter"
        font-size="48"
        font-weight="900"
        fill="url(#textGradient)">PURGE</text>

  <!-- TM Symbol -->
  <text x="280" y="35"
        font-family="Inter"
        font-size="16"
        font-weight="600"
        fill="#FFFFFF">™</text>
</svg>
```

---

## Usage Guide

### Logo Files to Export:

1. **purge-logo-full.svg** - Concept A (recommended)
2. **purge-icon-512.png** - App icon (512x512)
3. **purge-icon-256.png** - Small app icon (256x256)
4. **purge-icon-64.png** - Favicon (64x64)
5. **purge-logo-horizontal.svg** - For headers
6. **purge-logo-white.svg** - Monochrome white
7. **purge-logo-black.svg** - Monochrome black

### Minimum Clear Space:
- Leave space equal to "P" height around logo
- Don't place logo smaller than 32px height

### Do's:
✅ Use on dark backgrounds (primary)
✅ Use white version on light backgrounds
✅ Maintain aspect ratio
✅ Use approved colors only

### Don'ts:
❌ Don't rotate or skew
❌ Don't add effects (except approved glow)
❌ Don't change colors
❌ Don't place on busy backgrounds

---

## Quick Implementation

To use in your React app:

```tsx
// components/Logo.tsx
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#6B2FFF" />
        </linearGradient>
      </defs>
      <path d="M100 40 L140 55 L140 100 Q140 130 100 150 Q60 130 60 100 L60 55 Z"
            fill="url(#logoGradient)" />
      <text x="100" y="125"
            fontFamily="Inter"
            fontSize="60"
            fontWeight="900"
            fill="#FFFFFF"
            textAnchor="middle">P</text>
    </svg>
  );
}
```

---

## Design Tools

### Online SVG Editors (to customize):
- **Figma** (free) - https://figma.com
- **Canva** (free) - https://canva.com
- **SVG Editor** (free) - https://boxy-svg.com

### Export Settings:
- Format: SVG (vector)
- Also export: PNG (1024x1024, 512x512, 256x256, 64x64)
- Optimize: Use SVGO or SVGOMG.net
- Favicon: Use favicon.io to generate

---

## My Recommendation: **Concept A - Shield + Circuit**

**Why?**
- ✅ Instantly recognizable as security
- ✅ Circuit pattern = AI/tech
- ✅ Bold "P" = strong brand identity
- ✅ Gradient = modern, premium
- ✅ Works at all sizes
- ✅ Unique (no competitors use this)

**Next Steps:**
1. Copy Concept A SVG code
2. Paste into Figma/Canva
3. Export as PNG (512x512)
4. Use as profile picture on all social media
5. Add to app header

Need me to:
1. Export these as actual PNG files?
2. Create variations (with tagline, different sizes)?
3. Design social media banners with the logo?
