import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  right,
}: ScreenHeaderProps) {
  const router = useRouter();
  const handleBack = onBack ?? (() => router.back());

  return (
    <View className="flex-row items-center gap-2 px-4 pt-4 pb-3">
      {showBack && (
        <Pressable
          onPress={handleBack}
          hitSlop={8}
          className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-muted dark:active:bg-muted-dark"
        >
          <ChevronLeft size={22} color="#251E14" strokeWidth={2.25} />
        </Pressable>
      )}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className="text-xl font-bold text-foreground dark:text-foreground-dark tracking-tight"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-0.5"
          >
            {subtitle}
          </Text>
        )}
      </View>
      {right && <View className="ml-2">{right}</View>}
    </View>
  );
}
