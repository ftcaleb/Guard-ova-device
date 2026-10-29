// Guard'Ova Design System — Color Tokens
// Source of truth: design/DESIGN-SPEC.md §3
// Every hex value traced from design/reference-prototype/src/index.css

export const colors = {
  // ─── 3.1 Core ────────────────────────────────────────────────────────────
  blue: '#235BE5',          // Primary: buttons, links, active tab, toggle on
  green: '#248463',         // Safe brand green (reference)
  red: '#DF4E50',           // Danger button fill and border
  muted: '#8A919B',         // Generic muted text
  border: '#E9ECF0',        // Card borders, dividers
  ink: '#20292E',           // Default text colour
  pageBg: '#F6F7F9',        // App background
  surface: '#FFFFFF',       // Cards, top bar, modal
  focusRing: '#9BB9FF',     // 3px outline, 4px offset on focus

  // ─── 3.2 Neutral text scale (light → dark) ───────────────────────────────
  placeholder: '#B3BDCA',
  countSlash: '#A9B2C0',
  tabInactive: '#A1AABA',
  privateNote: '#A0A7B1',
  locationFooterSub: '#A0A7B0',
  recipientLabel: '#9BA4AF',
  deviceStatLabel: '#949CA6',
  cardDescription: '#939BA6',
  breadcrumb: '#939AA4',
  eyebrow: '#929AA5',
  pageHeadingPara: '#9198A3',
  detailRowLabel: '#83909E',
  bell: '#7D8695',
  secondaryButtonText: '#5D6B7E',
  detailRowValue: '#546775',
  deviceStatValue: '#4C5867',
  breadcrumbCurrent: '#49515E',

  // ─── 3.3 Safe (green family) ─────────────────────────────────────────────
  safeCardBg: '#E9F3EF',
  safeCardBorder: '#DCEAE3',
  safeDecoration: '#DBE9E1',
  safeFooterDivider: '#D6E5DC',
  shieldTileBg: '#D5E9DD',
  shieldTileBorder: '#C7DFD1',
  shieldTileIcon: '#338064',
  safeHeading: '#285E4C',
  safeBodyText: '#7C9D8C',
  safeStatusLabel: '#568372',
  safeUpdated: '#8AA496',
  safeFooterLocation: '#69927E',
  safeViewLink: '#367456',
  safeLiveDot: '#30916E',
  greenPillBg: '#EDF6F0',
  greenPillBorder: '#E3EFE7',
  greenPillText: '#368064',
  greenPillDot: '#30916E',
  onlinePresenceDot: '#41967D',
  greenHeadingIconBg: '#EAF5EE',
  greenHeadingIcon: '#31845E',
  respondingBtnBg: '#E6F5EB',
  respondingBtnBorder: '#D4E7DB',
  respondingBtnText: '#2C8157',
  toastBg: '#283E38',
  toastBorder: '#435950',
  toastCheck: '#A1D7B9',
  toastClose: '#C2D5CD',

  // ─── 3.4 Primary (blue family) ───────────────────────────────────────────
  blueHeadingIconBg: '#EDF2FF',
  addMemberTileBg: '#F7F9FF',
  addMemberDashedBorder: '#CAD7EF',
  addMemberPlusIcon: '#6488D5',
  addMemberLabel: '#6585C2',
  addMemberSubLabel: '#A9B3C6',
  mapYouPulse: '#4476ED',
  mapYouHalo1: '#467bee14',
  mapYouHalo2: '#467bee0b',
  mapYouLabel: '#526B9E',
  topAvatarBg: '#E9EEF8',
  topAvatarInitials: '#516586',

  // ─── 3.5 Warning (amber family) ──────────────────────────────────────────
  amberPillBg: '#FFF6DF',
  amberPillBorder: '#F5EBCA',
  amberPillText: '#A08129',
  amberPillDot: '#D3AC4F',
  amberWarningBoxBg: '#FFF8E7',
  amberWarningBoxBorder: '#F2E6C3',
  amberWarningBoxText: '#A6863C',
  awayPresenceDot: '#DFB554',
  awayText: '#B8A57E',

  // ─── 3.6 Emergency (red/rose family) ─────────────────────────────────────
  sosBannerBg: '#FCF5F3',
  sosBannerBorder: '#F2E6E2',
  sosIconTileBg: '#F9EAE6',
  sosIconTileBorder: '#F4DFD9',
  sosIconTileIcon: '#C27E74',
  sosBannerHeading: '#765B56',
  sosBannerText: '#AC9290',
  sosButtonFill: '#DD625E',
  sosButtonBorder: '#D66562',
  emergencyLabelText: '#CB5C5F',
  emergencyLabelDot: '#D35D60',
  emergencyOrbFill: '#F7E4E4',
  emergencyOrbBorder: '#EDD5D5',
  emergencyOrbNumber: '#D65E62',
  emergencyOrbHalo1: '#F9EEEE',
  emergencyOrbHalo2: '#FCF5F5',
  emergencyHeaderBg: '#FCEEEE',
  emergencyHeaderBorder: '#F3DCDC',
  emergencyHeaderText: '#BF565B',
  emergencyHeaderPara: '#B68488',
  alertPersonCircleBg: '#F6E6E6',
  alertPersonInitials: '#A95B62',
  alertBadgeBg: '#F9EAEA',
  alertBadgeText: '#C46065',
  // Home safety card during emergency:
  emergencySafeCardBg: '#FBECEC',
  emergencySafeCardBorder: '#EFDBDB',
  emergencySafeHeading: '#BD6265',
  emergencyShieldTileBg: '#F4DEDE',
  emergencyShieldTileBorder: '#EED1D1',
  emergencyShieldIcon: '#BF6469',
  // SOS / Countdown / Emergency Active (layout/50, 52, 55)
  sosBodyText: '#939DAB',             // focused-layout paragraph
  sosNetworkText: '#929DAB',          // "4 trusted people are here for you"
  emergencyMetricIcon: '#CB7F83',
  emergencyMetricLabel: '#929BAA',
  emergencyMetricValue: '#CA646A',
  emergencyMetricDot: '#D65F69',
  responseStatusText: '#9AA6B2',
  responseCheck: '#6F9B87',

  // ─── Shared controls (layout/50, 55, 56, 64) ─────────────────────────────
  secondaryButtonBorder: '#DDE3EC',
  simulationNote: '#A1A8B1',
  modalBackdrop: '#17223B45',
  modalBorder: '#E5EAF3',
  modalClose: '#A0AABB',
  modalText: '#9AA4B3',

  // ─── 3.7 Avatar gradients ────────────────────────────────────────────────
  avatarRoseStart: '#EFE5DE',
  avatarRoseEnd: '#D3B7A3',
  avatarRoseInitials: '#835F4D',
  avatarBlueStart: '#E1E9F5',
  avatarBlueEnd: '#A3B8D5',
  avatarBlueInitials: '#4C6488',
  avatarSageStart: '#E3E9DF',
  avatarSageEnd: '#AABDA4',
  avatarSageInitials: '#5C715A',
  avatarPurpleStart: '#EBE4F2',
  avatarPurpleEnd: '#BEAAD1',
  avatarPurpleInitials: '#77628F',

  // ─── 3.8 Map palette ─────────────────────────────────────────────────────
  mapBase: '#EDECE7',
  mapContainer: '#ECECE5',
  mapPark1: '#D8E7D4',
  mapPark2: '#DCE9D7',
  mapStreet: '#FFFFFF',
  mapStreetEdge: '#D8D8D2',
  mapMainRoad: '#F9F6E9',
  mapMainRoadEdge: '#E2D9BD',
  mapBuilding: '#D9DBD5',
  mapSuburbLabel: '#91998E',
  mapStreetLabel: '#A7A79C',
} as const;

export type ColorToken = keyof typeof colors;

