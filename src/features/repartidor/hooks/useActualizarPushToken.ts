import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import { repartidorApi } from '../api/repartidor.api';

export function useActualizarPushToken() {
  useEffect(() => {
    async function update() {
      if (!Device.isDevice) return;
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') return;
      const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
      const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
      await repartidorApi.actualizarPushToken(token);
    }
    update().catch(console.warn);
  }, []);
}
