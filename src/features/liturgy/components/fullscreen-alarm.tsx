import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, Pressable, Animated } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { AppText as Text, LucideIcon, useAppColors } from '@/src/theme/app-ui';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

export function FullscreenAlarmModal({
  visible,
  onClose,
  language,
  titleAm,
  titleEn,
  subtitleAm,
  subtitleEn,
}: {
  visible: boolean;
  onClose: () => void;
  language: 'am' | 'en';
  titleAm?: string;
  titleEn?: string;
  subtitleAm?: string;
  subtitleEn?: string;
}) {
  const colors = useAppColors();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let player: AudioPlayer | null = null;

    async function startAlarmSound() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldRouteThroughEarpiece: false,
        });
        player = createAudioPlayer(require('@/assets/sounds/alarm_bell.wav'));
        player.loop = true;
        player.volume = 1.0;
        player.play();
      } catch {
        // Fallback gracefully to haptics if audio is unavailable
      }
    }

    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();

      const interval = setInterval(() => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }, 1000);

      void startAlarmSound();

      return () => {
        clearInterval(interval);
        try {
          if (player) {
            player.pause();
            player.remove();
          }
        } catch {}
      };
    }
  }, [visible, pulseAnim]);

  if (!visible) return null;

  const displayTitle = language === 'am' ? (titleAm || 'የጸሎት ሰዓት ደርሷል') : (titleEn || 'Canonical Prayer Time');
  const displaySubtitle = language === 'am' ? (subtitleAm || 'ጸሎትዎን ለመጀመር ዝግጁ ነዎት?') : (subtitleEn || 'It is time for your scheduled devotion.');

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.topSection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={[styles.bellCircle, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }]}>
              <LucideIcon name="bell-ring" size={56} color={colors.primary} />
            </View>
          </Animated.View>
        </View>

        <View style={styles.midSection}>
          <Text tone="display" style={[styles.time, { color: colors.text }]}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text tone="title" style={[styles.title, { color: colors.primary }]}>
            {displayTitle}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {displaySubtitle}
          </Text>
        </View>
        
        <View style={styles.bottomSection}>
          <Pressable 
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
              onClose();
              router.push('/practice/prayer' as never);
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <LucideIcon name="check-circle-2" size={20} color="#FFFFFF" />
            <Text tone="title" style={styles.primaryBtnText}>
              {language === 'am' ? 'ጸሎት ጀምር (Start)' : 'Begin Prayer'}
            </Text>
          </Pressable>

          <Pressable 
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { backgroundColor: colors.secondary, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <LucideIcon name="moon" size={18} color={colors.text} />
            <Text tone="title" style={[styles.secondaryBtnText, { color: colors.text }]}>
              {language === 'am' ? 'አቋርጥ / ዝጋ' : 'Dismiss'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: 'space-between' },
  topSection: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  bellCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  midSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  time: { fontSize: 56, fontWeight: '800', marginBottom: 12, letterSpacing: -1 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, fontWeight: '500', textAlign: 'center', lineHeight: 22 },
  bottomSection: { flex: 1, justifyContent: 'flex-end', gap: 16, paddingBottom: 20 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 18, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 20, borderWidth: 1 },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' }
});
