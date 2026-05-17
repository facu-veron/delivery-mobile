import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistorialScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          Historial
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6 gap-3">
        <Text className="text-4xl">📋</Text>
        <Text className="text-base text-muted-foreground dark:text-muted-dark-foreground text-center">
          Historial de entregas — Fase 5
        </Text>
      </View>
    </SafeAreaView>
  );
}
