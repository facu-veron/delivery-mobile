import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const containerClasses: Record<Variant, string> = {
  primary:     'bg-primary active:opacity-80 shadow-sm',
  secondary:   'bg-secondary dark:bg-secondary-dark active:opacity-80',
  outline:     'bg-transparent border border-border dark:border-border-dark active:bg-muted dark:active:bg-muted-dark',
  destructive: 'bg-destructive active:opacity-80 shadow-sm',
  ghost:       'bg-transparent active:bg-muted dark:active:bg-muted-dark',
};

const labelClasses: Record<Variant, string> = {
  primary:     'text-primary-foreground',
  secondary:   'text-secondary-foreground dark:text-secondary-dark-foreground',
  outline:     'text-foreground dark:text-foreground-dark',
  destructive: 'text-destructive-foreground',
  ghost:       'text-foreground dark:text-foreground-dark',
};

const sizeContainerClasses: Record<Size, string> = {
  sm: 'px-3 py-2 rounded-lg gap-1.5',
  md: 'px-5 py-3 rounded-xl gap-2',
  lg: 'px-6 py-4 rounded-xl gap-2',
};

const sizeLabelClasses: Record<Size, string> = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'text-base font-semibold',
};

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${containerClasses[variant]} ${sizeContainerClasses[size]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? '#251E14' : '#EEC234'}
        />
      ) : (
        leftIcon
      )}
      <Text className={`${labelClasses[variant]} ${sizeLabelClasses[size]}`}>
        {children}
      </Text>
      {!loading && rightIcon}
    </Pressable>
  );
}
