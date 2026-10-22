export const colors = {
  bg: '#0b1120',
  surface: '#141c2e',
  surface2: '#1c2640',
  mapBg: '#0f1a2e',
  border: 'rgba(255,255,255,0.08)',
  text: '#eef1f6',
  textMuted: '#9aa5bb',
  textSoft: '#c9d1e0',
  red: '#e3263a',
  redSoft: '#ff5a6a',
  redBg: 'rgba(227,38,58,0.15)',
  blue: '#3d8bff',
  green: '#3ddc84',
};
export const radius = { sm: 12, md: 14, lg: 18, xl: 20, sheet: 28 };
export const space = (n: number) => n * 4;
export const font = {
  body: 'Barlow_400Regular',
  medium: 'Barlow_500Medium',
  semibold: 'Barlow_600SemiBold',
  bold: 'Barlow_700Bold',
  display: 'BarlowCondensed_700Bold',
};

export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7a96' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#14325a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#081022' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
