import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type ScreenShellProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  scroll?: boolean;
}>;

export function ScreenShell({ title, subtitle, onBack, right, scroll = true, children }: ScreenShellProps) {
  const body = (
    <View style={styles.content}>
      {(title || onBack || right) && (
        <View style={styles.header}>
          <View style={styles.headerSide}>
            {onBack ? (
              <Pressable onPress={onBack} hitSlop={12} style={styles.backButton}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={styles.headerCenter}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={[styles.headerSide, styles.right]}>{right}</View>
        </View>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  scroll: { flexGrow: 1 },
  content: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 32 },
  header: { minHeight: 84, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 14 },
  headerSide: { width: 48, minHeight: 44, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  backButton: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(237,231,219,.35)', alignItems: 'center', justifyContent: 'center' },
  backText: { color: colors.cream, fontSize: 35, lineHeight: 37, marginTop: -4 },
  title: { color: colors.cream, fontFamily: 'Cinzel_700Bold', fontSize: 24, textAlign: 'center' },
  subtitle: { color: 'rgba(237,231,219,.68)', fontFamily: 'Poppins_400Regular', fontSize: 12, textAlign: 'center', marginTop: 2 },
});
