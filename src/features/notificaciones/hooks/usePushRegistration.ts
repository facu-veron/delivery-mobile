import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { apiClient } from '@/shared/api/client';

async function registerPushToken() {
  if (!Device.isDevice) return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  const { status } = existing === 'granted'
    ? { status: existing }
    : await Notifications.requestPermissionsAsync();

  if (status !== 'granted') return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  await apiClient.patch('/api/usuarios/push-token', { token });
}

export function usePushRegistration() {
  useEffect(() => {
    registerPushToken().catch(console.warn);
  }, []);
}
