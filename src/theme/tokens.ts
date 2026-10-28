/**
 * Guard'Ova Design Tokens & Typography Scale
 *
 * Source of Truth:
 * - Spec: `design/DESIGN-SPEC.md` §3 (Color tokens), §4 (Typography), §15.2 (Translation rules)
 * - Computed layouts: `design/layout/*.json`
 *
 * Design Constraints:
 * 1. Absolute px/pt parity: 1 CSS px in Figma = 1 dp/pt in React Native.
 * 2. Static font families: Fonts are pre-built static TTFs located in `design/fonts/static/`.
 *    Never supply a separate `fontWeight` property when using custom font weights, as Android
 *    will synthesize a pseudo-bold over the already-weighted glyphs.
 * 3. Optical size: DM Sans is rendered with baked-in opsz: 14 per decision D11.
 */

export const colors = {
  // Brand & Primary Accents (DESIGN-SPEC §3.4)
  primary: '#235BE5', // Core CTA blue (var(--blue) in reference CSS)
  primaryDark: '#1A4AC0', // Active/pressed state for primary buttons
  primaryBgLight: '#EDF2FF', // Subtle background tint for icon badges
  primaryHalo: '#F0F4FB', // Concentric halo ring around Step 3 protection shield
  primaryShieldCircle: '#EDF3FE', // Inner circle surface for Step 3 protection shield
  primaryShieldIcon: '#5383E6', // Shield stroke fill in onboarding Step 3
  dashedRing: '#CEDAF1', // 1px dashed orbit stroke on Step 2 network circle
  dotsInactive: '#DCE3EE', // Inactive pagination dots

  // Neutrals & Text Hierarchy (DESIGN-SPEC §3.1 & §3.2)
  ink: '#20292E', // Primary high-contrast text for headers and prominent titles
  textSecondary: '#5B6A83', // Secondary text / form label tint
  textMuted: '#98A2B0', // Subtitles, body descriptions, and auxiliary text
  textEyebrow: '#929AA5', // Category eyebrows, section labels, and breadcrumbs
  textEcosystem: '#98A5B9', // Ecosystem chain text and arrow tint
  borderDefault: '#E5EAF3', // Neutral hairline border for cards and dividers
  borderSubtle: '#EEEEEE', // 1px avatar outer boundary ring
  white: '#FFFFFF', // Canvas surface

  // Network Member Avatar Colorways (DESIGN-SPEC §3.7 & §11.1)
  // Each member circle renders a 145deg linear gradient with strict foreground contrast:
  avatar: {
    rose: {
      from: '#FCEAEB',
      to: '#F6CDD0',
      text: '#A44C54', // Mom (NM)
    },
    blue: {
      from: '#EAF1FB',
      to: '#CEE0F7',
      text: '#3D68A8', // Thabo (TM)
    },
    sage: {
      from: '#E9F3EE',
      to: '#C8E3D4',
      text: '#367756', // Kabelo (KM)
    },
    purple: {
      from: '#F2EDFB',
      to: '#DFCFF7',
      text: '#6E4D9E', // Lerato (LM)
    },
  },
} as const;

export const typography = {
  /**
   * Font family mapping matching `design/fonts/static/font-map.json`.
   * Pinned static weights avoid OS font-synthesis bugs.
   */
  fonts: {
    heading: 'Manrope-750',
    subheading: 'Manrope-650',
    body: 'DMSans-400',
    bodyMedium: 'DMSans-550',
    bodyBold: 'DMSans-700',
  },

  /**
   * Typography styles for the Welcome / Onboarding experience.
   * Computed from `design/layout/01-welcome-step1.json`.
   */
  welcome: {
    eyebrow: {
      fontFamily: 'DMSans-550',
      fontSize: 9,
      lineHeight: 13.5, // 1.5x font-size baseline
      letterSpacing: 1.2,
      color: colors.textEyebrow,
      textTransform: 'uppercase' as const,
    },
    title: {
      fontFamily: 'Manrope-750',
      fontSize: 30,
      lineHeight: 40.5, // Exact 1.35 multiplier from Figma Make layout
      letterSpacing: -0.5,
      color: colors.ink,
    },
    description: {
      fontFamily: 'DMSans-400',
      fontSize: 12,
      lineHeight: 22.8, // Exactly 1.9x font-size line-height
      color: colors.textMuted,
    },
    button: {
      fontFamily: 'DMSans-550',
      fontSize: 12,
      lineHeight: 18,
      color: colors.white,
    },
    skipButton: {
      fontFamily: 'DMSans-550',
      fontSize: 10,
      lineHeight: 15,
      color: colors.primary,
    },
    ecosystem: {
      fontFamily: 'DMSans-550',
      fontSize: 8,
      lineHeight: 12,
      color: colors.textEcosystem,
    },
  },
} as const;
