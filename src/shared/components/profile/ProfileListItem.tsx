import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/shared/components/Badge';

interface ProfileListItemProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onPress: () => void;
  badge?: { text: string; variant?: 'primary' | 'success' | 'warning' | 'destructive' };
  destructive?: boolean;
  showChevron?: boolean;
}

export function ProfileListItem({
  icon: Icon,
  label,
  description,
  onPress,
  badge,
  destructive = false,
  showChevron = true,
}: ProfileListItemProps) {
  const iconColor = destructive ? '#C13D2A' : '#251E14';
  const labelClass = destructive
    ? 'text-destructive'
    : 'text-foreground dark:text-foreground-dark';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5 active:bg-muted/50 dark:active:bg-muted-dark/50"
    >
      <Icon size={20} color={iconColor} strokeWidth={1.75} />
      <View className="flex-1 flex-row items-center gap-2">
        <Text className={`text-[15px] ${labelClass}`}>{label}</Text>
        {badge && (
          <Badge variant={badge.variant ?? 'primary'}>{badge.text}</Badge>
        )}
      </View>
      {description && (
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
          {description}
        </Text>
      )}
      {showChevron && (
        <ChevronRight size={18} color="#9E9891" strokeWidth={2} />
      )}
    </Pressable>
  );
}
