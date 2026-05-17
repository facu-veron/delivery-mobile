import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-4 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
