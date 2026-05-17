import { Redirect } from 'expo-router';

export default function ClienteIndex() {
  return <Redirect href={'/(cliente)/(tabs)' as any} />;
}
