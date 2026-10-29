// Guard'Ova Design System — Typography Tokens
// Source: design/DESIGN-SPEC.md §4 + design/HOW-TO-MATCH-THE-DESIGN.md
//
// CRITICAL RULES (from CLAUDE.md and HOW-TO-MATCH):
// 1. Only use files from design/fonts/static/ — loaded via expo-font
// 2. NEVER set fontWeight alongside these families (Android fakes bold)
// 3. Every text style sets fontSize + lineHeight (absolute) + letterSpacing + color
// 4. Android: includeFontPadding: false on ALL text
// 5. DM Sans = opsz 14 pinned (static files already have this baked in)
// 6. Line-height default = 1.5 × fontSize (Tailwind base style in prototype)

// ─── Font family names (must match the name registered with expo-font) ────────
export const fonts = {
  // DM Sans — body, UI, numbers
  dmSans400: 'DMSans-400',
  dmSans450: 'DMSans-450',
  dmSans500: 'DMSans-500',
  dmSans550: 'DMSans-550',
  dmSans600: 'DMSans-600',
  dmSans650: 'DMSans-650',
  dmSans700: 'DMSans-700',
  // Manrope — headings, avatar initials, SOS countdown, page/card titles
  manrope400: 'Manrope-400',
  manrope500: 'Manrope-500',
  manrope600: 'Manrope-600',
  manrope650: 'Manrope-650',
  manrope700: 'Manrope-700',
  manrope750: 'Manrope-750',
  manrope800: 'Manrope-800',
  // Inter — map labels only
  inter400: 'Inter-400',
} as const;

// ─── Text styles (mirrors the design spec type scale, §4.2) ──────────────────
// All lineHeight values are absolute (px), not multipliers
export const textStyles = {
  // Page-level
  pageTitleH1: {
    fontFamily: fonts.manrope750,
    fontSize: 26,
    lineHeight: 35,        // 26 × 1.35 ≈ 35 (h1 uses 1.35 per spec)
    letterSpacing: -1,
  },
  // Safety card hero "You are safe."
  safetyHeroH2: {
    fontFamily: fonts.manrope750,
    fontSize: 32,
    lineHeight: 43,        // 32 × 1.35
    letterSpacing: -1.2,
  },
  // Card titles
  cardTitleH2: {
    fontFamily: fonts.manrope750,
    fontSize: 15,
    lineHeight: 23,        // 15 × 1.5
    letterSpacing: 0,
  },
  // Device screen "Guard'Ova Device"
  deviceProductH2: {
    fontFamily: fonts.manrope750,
    fontSize: 23,
    lineHeight: 35,
    letterSpacing: 0,
  },
  // Device health header
  deviceHealthH2: {
    fontFamily: fonts.manrope750,
    fontSize: 19,
    lineHeight: 29,
    letterSpacing: 0,
  },
  // Alert h1 "Siyabonga needs you."
  alertH1: {
    fontFamily: fonts.manrope750,
    fontSize: 27,
    lineHeight: 36,
    letterSpacing: 0,
  },
  // Welcome / onboarding title
  welcomeTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 30,
    lineHeight: 41,
    letterSpacing: 0,
  },
  // Emergency / SOS title
  sosTitle: {
    fontFamily: fonts.manrope750,
    fontSize: 28,
    lineHeight: 38,
    letterSpacing: 0,
  },
  // Eyebrow labels (UPPERCASE)
  eyebrow: {
    fontFamily: fonts.dmSans650,
    fontSize: 8,
    lineHeight: 12,        // 8 × 1.5
    letterSpacing: 1.5,
  },
  // Safety status label ("YOUR SAFETY STATUS")
  safetyStatusLabel: {
    fontFamily: fonts.dmSans650,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.9,
  },
  // Status pill text
  statusPillText: {
    fontFamily: fonts.dmSans650,
    fontSize: 9,
    lineHeight: 14,        // 9 × 1.5
    letterSpacing: 0.9,
  },
  // Count pill "4/5"
  countPillText: {
    fontFamily: fonts.dmSans600,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  // Body text (standard)
  body11: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 20,        // 11 × 1.8
    letterSpacing: 0,
  },
  // Small body (card descriptions)
  body10: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 18,        // 10 × 1.85
    letterSpacing: 0,
  },
  body12: {
    fontFamily: fonts.dmSans400,
    fontSize: 12,
    lineHeight: 22,        // 12 × 1.8
    letterSpacing: 0,
  },
  body9: {
    fontFamily: fonts.dmSans400,
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 0,
  },
  // Buttons
  buttonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  // Text button (link)
  textButtonText: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  // Tab bar labels
  tabLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0,
  },
  // Small stats (device card values)
  statValue: {
    fontFamily: fonts.dmSans550,
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 0,
  },
  statLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  // Detail row label
  detailRowLabel: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 0,
  },
  // Detail row value
  detailRowValue: {
    fontFamily: fonts.dmSans550,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  // Avatar initials
  avatarInitials13: {
    fontFamily: fonts.manrope650,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
  },
  // Page heading paragraph
  pageHeadingPara: {
    fontFamily: fonts.dmSans400,
    fontSize: 11,
    lineHeight: 20,        // 11 × 1.8
    letterSpacing: 0,
  },
  // Breadcrumb labels
  breadcrumb: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  breadcrumbCurrent: {
    fontFamily: fonts.dmSans500,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0,
  },
  // Device serial number
  serialNumber: {
    fontFamily: fonts.dmSans400,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 1.5,
  },
  // Simulation / prototype notes
  simulationNote: {
    fontFamily: fonts.dmSans400,
    fontSize: 10,
    lineHeight: 17,        // 10 × 1.7
    letterSpacing: 0,
  },
  // Map labels (Inter)
  mapSuburb: {
    fontFamily: fonts.inter400,
    fontSize: 11,
    lineHeight: 17,
    letterSpacing: 0,
  },
  mapStreet: {
    fontFamily: fonts.inter400,
    fontSize: 9,
    lineHeight: 14,
    letterSpacing: 0,
  },
} as const;

// Android-specific additions — add to every Text style on Android
export const androidTextFix = {
  includeFontPadding: false,
} as const;

