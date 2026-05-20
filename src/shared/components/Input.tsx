import { Text, TextInput, type TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const borderClass = error
    ? 'border-destructive dark:border-destructive-dark'
    : 'border-border dark:border-border-dark';

  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
          {label}
        </Text>
      )}
      <TextInput
        className={`rounded-lg border px-4 py-3 text-base text-foreground dark:text-foreground-dark bg-card dark:bg-card-dark ${borderClass} ${className}`}
        placeholderTextColor="#9E9891"
        {...props}
      />
      {error && (
        <Text className="text-xs text-destructive dark:text-destructive-dark">{error}</Text>
      )}
    </View>
  );
}
