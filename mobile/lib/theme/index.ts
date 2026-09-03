export const Colors = {
  canvas: '#F4F6FB',
  primary: '#0B3954',
  action: '#007AFF',
  emerald: '#10B981',
  amber: '#FFB703',
  teal: '#14B8A6',
  indigo: '#6366F1',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  white: '#FFFFFF',
  border: 'rgba(226, 232, 240, 0.6)',
  borderSolid: '#E2E8F0',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  bentoPrimary: '#0B3954',
  bentoAccent: '#1E6091',
  bentoSuccess: '#10B981',
  bentoWarning: '#FFB703',
  swipeShare: '#007AFF',
  swipeFavorite: '#FFB703',
  swipeDelete: '#EF4444',
  swipeAction: '#10B981',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  bento: 24,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 30,
    elevation: 3,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  tab: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  number: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
};

export const Animation = {
  pressScale: 0.96,
  pressDuration: 150,
  springConfig: { damping: 15, stiffness: 150 },
  staggerDelay: 80,
};
