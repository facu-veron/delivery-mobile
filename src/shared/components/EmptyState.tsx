import { type LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`flex-1 items-center justify-center px-8 gap-3 py-20 ${className}`}>
      <View className="w-16 h-16 rounded-full bg-muted dark:bg-muted-dark items-center justify-center mb-1">
        <Icon size={28} color="#6A6052" strokeWidth={1.75} />
      </View>
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground text-center max-w-xs leading-5">
          {description}
        </Text>
      )}
      {action && <View className="mt-2">{action}</View>}
    </View>
  );
}
