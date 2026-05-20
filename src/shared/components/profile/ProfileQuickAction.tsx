import { type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

interface ProfileQuickActionProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  badge?: string;
  highlighted?: boolean;
}

export function ProfileQuickAction({
  icon: Icon,
  label,
  onPress,
  badge,
  highlighted = false,
}: ProfileQuickActionProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center gap-2 active:opacity-70"
    >
      <View
        className={`w-16 h-16 rounded-2xl items-center justify-center border ${
          highlighted
            ? 'bg-primary border-primary'
            : 'bg-card dark:bg-card-dark border-border dark:border-border-dark'
        }`}
      >
        <Icon
          size={24}
          color={highlighted ? '#251E14' : '#251E14'}
          strokeWidth={1.75}
        />
        {badge && (
          <View className="absolute -top-1 -right-1 bg-destructive rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center">
            <Text className="text-[10px] font-bold text-destructive-foreground">
              {badge}
            </Text>
          </View>
        )}
      </View>
      <Text
        numberOfLines={2}
        className="text-xs text-center text-foreground dark:text-foreground-dark"
      >
        {label}
      </Text>
    </Pressable>
  );
}
