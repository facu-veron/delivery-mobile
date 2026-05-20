import { Children, Fragment } from 'react';
import { Text, View } from 'react-native';

interface ProfileSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProfileSection({ title, children, className = '' }: ProfileSectionProps) {
  const items = Children.toArray(children);

  return (
    <View className={`gap-2 ${className}`}>
      {title && (
        <Text className="text-base font-bold text-foreground dark:text-foreground-dark px-4">
          {title}
        </Text>
      )}
      <View className="bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark overflow-hidden shadow-sm shadow-foreground/5">
        {items.map((item, i) => (
          <Fragment key={i}>
            {item}
            {i < items.length - 1 && (
              <View className="h-px bg-border dark:bg-border-dark ml-12" />
            )}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
