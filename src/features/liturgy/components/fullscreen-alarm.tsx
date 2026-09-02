import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, Pressable, Animated } from 'react-native';
import { AppText as Text, LucideIcon, useAppColors } from '@/src/theme/app-ui';
import * as Haptics from 'expo-haptics';

export function FullscreenAlarmModal({ visible, onClose, language }: { visible: boolean, onClose: () => void, language: 'am' | 'en' }) {
  const colors = useAppColors();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
      
      const interval = setInterval(() => {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [visible, pulseAnim]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginBottom: 40 }}>
          <View style={[styles.bellCircle, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }]}>
            <LucideIcon name="bell-ring" size={64} color={colors.primary} />
          </View>
        </Animated.View>
        
        <Text tone="display" style={[styles.time, { color: colors.text }]}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text tone="title" style={[styles.title, { color: colors.text }]}>
          {language === 'am' ? 'የጸሎት ሰዓት ደርሷል' : 'Time for Prayer'}
        </Text>
        
        <Pressable 
          onPress={onClose}
          style={({ pressed }) => [
            styles.dismissBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
        >
          <Text tone="title" style={styles.dismissText}>
            {language === 'am' ? 'ጸሎት ጀምር' : 'Dismiss / Pray'}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  bellCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
  time: { fontSize: 48, fontWeight: '900', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 60 },
  dismissBtn: { paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  dismissText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
