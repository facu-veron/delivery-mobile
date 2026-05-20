import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export function Card({
  children,
  className = '',
  elevated = true,
  style,
  ...props
}: CardProps) {
  const shadowClass = elevated ? 'shadow-sm shadow-foreground/5' : '';
  return (
    <View
      className={`bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4 ${shadowClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
