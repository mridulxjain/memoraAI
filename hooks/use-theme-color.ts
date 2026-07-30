import { Colors } from '@/constants/Theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  return Colors[colorName] || '#000';
}
