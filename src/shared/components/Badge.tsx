import { Text, View } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'primary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: string;
  dot?: boolean;
}

const classes: Record<BadgeVariant, { container: string; label: string; dot: string }> = {
  default: {
    container: 'bg-muted dark:bg-muted-dark',
    label:     'text-muted-foreground dark:text-muted-dark-foreground',
    dot:       'bg-muted-foreground dark:bg-muted-dark-foreground',
  },
  success: {
    container: 'bg-success-light dark:bg-success-dark-light',
    label:     'text-success dark:text-success-dark',
    dot:       'bg-success dark:bg-success-dark',
  },
  warning: {
    container: 'bg-warning-light dark:bg-warning-dark-light',
    label:     'text-warning dark:text-warning-dark',
    dot:       'bg-warning dark:bg-warning-dark',
  },
  destructive: {
    container: 'bg-destructive-light dark:bg-destructive-dark-light',
    label:     'text-destructive dark:text-destructive-dark',
    dot:       'bg-destructive dark:bg-destructive-dark',
  },
  secondary: {
    container: 'bg-secondary dark:bg-secondary-dark',
    label:     'text-secondary-foreground dark:text-secondary-dark-foreground',
    dot:       'bg-secondary-foreground/60 dark:bg-secondary-dark-foreground/60',
  },
  primary: {
    container: 'bg-primary/15',
    label:     'text-primary',
    dot:       'bg-primary',
  },
};

export function Badge({ variant = 'default', children, dot = false }: BadgeProps) {
  const c = classes[variant];
  return (
    <View className={`${c.container} flex-row items-center gap-1.5 px-2.5 py-1 rounded-full self-start`}>
      {dot && <View className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      <Text className={`${c.label} text-xs font-semibold`}>{children}</Text>
    </View>
  );
}
