import { NativeModules, Platform } from 'react-native';
import { NativeModulesProxy } from 'expo-modules-core';

// In bare/prebuild React Native, custom packages are in NativeModules.
// If loaded via Expo autolinking proxy, it's in NativeModulesProxy.
const EletAlarmModule =
  NativeModules.EletAlarmModule ||
  NativeModulesProxy?.EletAlarmModule;

export async function scheduleNativeFullScreenAlarm(params: {
  alarmId: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
  channelId: string;
  data: Record<string, string>;
}): Promise<boolean> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return false;

  try {
    const now = new Date();
    const triggerTime = new Date();
    triggerTime.setHours(params.hour, params.minute, 0, 0);

    if (triggerTime.getTime() <= now.getTime()) {
      triggerTime.setDate(triggerTime.getDate() + 1);
    }

    const triggerAtMillis = triggerTime.getTime();
    const dataJson = JSON.stringify(params.data);

    await EletAlarmModule.scheduleFullScreenAlarm(
      params.alarmId,
      triggerAtMillis,
      params.title,
      params.body,
      params.channelId,
      dataJson
    );
    return true;
  } catch {
    return false;
  }
}

export async function scheduleNativeFullScreenAlarmInSeconds(params: {
  alarmId?: number;
  seconds: number;
  title: string;
  body: string;
  channelId?: string;
  data: Record<string, string>;
}): Promise<boolean> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return false;

  try {
    const triggerAtMillis = Date.now() + params.seconds * 1000;
    const alarmId = params.alarmId ?? (Math.floor(Date.now() % 80000) + 10000);
    const channelId = params.channelId ?? 'prayer-routine';
    const dataJson = JSON.stringify(params.data);

    await EletAlarmModule.scheduleFullScreenAlarm(
      alarmId,
      triggerAtMillis,
      params.title,
      params.body,
      channelId,
      dataJson
    );
    return true;
  } catch {
    return false;
  }
}

export async function cancelNativeAlarm(alarmId: number): Promise<void> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return;
  try {
    await EletAlarmModule.cancelFullScreenAlarm(alarmId);
  } catch {}
}

export async function cancelAllNativeAlarms(): Promise<void> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return;
  try {
    await EletAlarmModule.cancelAllFullScreenAlarms();
  } catch {}
}

export async function hasFullScreenIntentPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return true;
  try {
    return await EletAlarmModule.hasFullScreenIntentPermission();
  } catch {
    return true;
  }
}

export async function hasExactAlarmPermission(): Promise<boolean> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return false;
  try {
    return await EletAlarmModule.hasExactAlarmPermission();
  } catch {
    return false;
  }
}

export async function openFullScreenIntentSettings(): Promise<boolean> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return false;
  try {
    return await EletAlarmModule.openFullScreenIntentSettings();
  } catch {
    return false;
  }
}

export async function getAlarmLaunchData(): Promise<Record<string, any> | null> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return null;
  try {
    const data = await EletAlarmModule.getAlarmLaunchData();
    if (!data) return null;
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
}

export async function clearAlarmLaunchData(): Promise<void> {
  if (Platform.OS !== 'android' || !EletAlarmModule) return;
  try {
    await EletAlarmModule.clearAlarmLaunchData();
  } catch {}
}
