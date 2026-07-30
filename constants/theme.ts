export const Colors = {
  background: '#0B0F14',
  surface: '#121821',
  surfaceHighlight: '#1A222D',
  accent: '#4F8CFF',
  success: '#39D98A',
  warning: '#FFB84D',
  danger: '#FF5C5C',
  text: '#FFFFFF',
  textMuted: '#8B949E',
  border: '#2A303C',
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: Colors.text },
  h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.text },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: Colors.text },
  caption: { fontSize: 14, fontWeight: '400' as const, color: Colors.textMuted },
  small: { fontSize: 12, fontWeight: '500' as const, color: Colors.textMuted },
};

export const Layout = {
  borderRadius: 22,
  padding: 16,
  spacing: 20,
};
