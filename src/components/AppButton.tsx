import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
};

export function AppButton({ label, onPress, variant = 'primary', style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderRadius: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22 },
  primary: { backgroundColor: colors.green },
  secondary: { backgroundColor: colors.yellow },
  outline: { borderWidth: 1.5, borderColor: colors.cream, backgroundColor: 'transparent' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  label: { color: colors.cream, fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
  secondaryLabel: { color: colors.navy },
});
