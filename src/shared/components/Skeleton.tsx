import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps extends ViewProps {
  className?: string;
}

export function Skeleton({ className = '', style, ...props }: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className={`bg-muted dark:bg-muted-dark rounded-md ${className}`}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps) {
  return (
    <View className={`bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4 gap-3 ${className}`}>
      <View className="flex-row justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </View>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <View className="flex-row justify-between items-center pt-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-24 rounded-lg" />
      </View>
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View className="px-4 pt-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
