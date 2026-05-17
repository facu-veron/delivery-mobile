import { ActivityIndicator, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  className?: string;
}

export function LoadingSpinner({ size = 'large', className = '' }: LoadingSpinnerProps) {
  return (
    <View className={`flex-1 items-center justify-center ${className}`}>
      <ActivityIndicator size={size} color="#EEC234" />
    </View>
  );
}
