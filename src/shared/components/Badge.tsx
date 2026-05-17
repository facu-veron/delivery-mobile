import { Text, View } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: string;
}

const classes: Record<BadgeVariant, { container: string; label: string }> = {
  default: {
    container: 'bg-muted dark:bg-muted-dark',
    label:     'text-muted-foreground dark:text-muted-dark-foreground',
  },
  success: {
    container: 'bg-success-light dark:bg-success-dark-light',
    label:     'text-success dark:text-success-dark',
  },
  warning: {
    container: 'bg-warning-light dark:bg-warning-dark-light',
    label:     'text-warning dark:text-warning-dark',
  },
  destructive: {
    container: 'bg-destructive-light dark:bg-destructive-dark-light',
    label:     'text-destructive dark:text-destructive-dark',
  },
  secondary: {
    container: 'bg-secondary dark:bg-secondary-dark',
    label:     'text-secondary-foreground dark:text-secondary-dark-foreground',
  },
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  const c = classes[variant];
  return (
    <View className={`${c.container} px-2.5 py-1 rounded-full self-start`}>
      <Text className={`${c.label} text-xs font-semibold`}>{children}</Text>
    </View>
  );
}
