import { Text, View } from 'react-native';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({
  message = 'Algo salió mal. Intentá de nuevo.',
  className = '',
}: ErrorMessageProps) {
  return (
    <View className={`flex-1 items-center justify-center p-6 ${className}`}>
      <Text className="text-destructive dark:text-destructive-dark text-center text-base">
        {message}
      </Text>
    </View>
  );
}
