/**
 * Guard'Ova Theme Tokens
 * Generated from design/DESIGN-SPEC.md §3 and computed values in design/layout/*.json
 */

export const colors = {
  // Brand & Primary
  primary: '#235BE5', // var(--blue)
  primaryDark: '#1A4AC0',
  primaryBgLight: '#EDF2FF',
  primaryHalo: '#F0F4FB',
  primaryShieldCircle: '#EDF3FE',
  primaryShieldIcon: '#5383E6',
  dashedRing: '#CEDAF1',
  dotsInactive: '#DCE3EE',

  // Neutrals & Text scale
  ink: '#20292E',
  textSecondary: '#5B6A83',
  textMuted: '#98A2B0',
  textEyebrow: '#929AA5',
  textEcosystem: '#98A5B9',
  borderDefault: '#E5EAF3',
  borderSubtle: '#EEEEEE',
  white: '#FFFFFF',

  // Avatar Gradients (145deg angle)
  avatar: {
    rose: {
      from: '#FCEAEB',
      to: '#F6CDD0',
      text: '#A44C54',
    },
    blue: {
      from: '#EAF1FB',
      to: '#CEE0F7',
      text: '#3D68A8',
    },
    sage: {
      from: '#E9F3EE',
      to: '#C8E3D4',
      text: '#367756',
    },
    purple: {
      from: '#F2EDFB',
      to: '#DFCFF7',
      text: '#6E4D9E',
    },
  },
} as const;

export const typography = {
  fonts: {
    heading: 'Manrope-750',
    subheading: 'Manrope-650',
    body: 'DMSans-400',
    bodyMedium: 'DMSans-550',
    bodyBold: 'DMSans-700',
  },
  welcome: {
    eyebrow: {
      fontFamily: 'DMSans-550',
      fontSize: 9,
      lineHeight: 13.5,
      letterSpacing: 1.2,
      color: colors.textEyebrow,
      textTransform: 'uppercase' as const,
    },
    title: {
      fontFamily: 'Manrope-750',
      fontSize: 30,
      lineHeight: 40.5,
      letterSpacing: -0.5,
      color: colors.ink,
    },
    description: {
      fontFamily: 'DMSans-400',
      fontSize: 12,
      lineHeight: 22.8,
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
