import { MapPin } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useDirecciones } from '../hooks/useDirecciones';

interface Props {
  onSelect: (direccion: string) => void;
}

export function DireccionSelector({ onSelect }: Props) {
  const { data: direcciones } = useDirecciones();

  if (!direcciones || direcciones.length === 0) return null;

  return (
    <View className="gap-1.5">
      <Text className="text-[11px] font-medium text-muted-foreground dark:text-muted-dark-foreground uppercase tracking-wider">
        Guardadas
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
        {direcciones.map((dir) => (
          <Pressable
            key={dir.id}
            onPress={() => onSelect(`${dir.calle} ${dir.numero}${dir.barrio ? `, ${dir.barrio}` : ''}`)}
            className="mx-1 flex-row items-center gap-1.5 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-card dark:bg-card-dark active:opacity-70"
          >
            <MapPin size={12} color="#6A6052" strokeWidth={2} />
            <Text className="text-xs font-medium text-foreground dark:text-foreground-dark">
              {dir.alias}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
