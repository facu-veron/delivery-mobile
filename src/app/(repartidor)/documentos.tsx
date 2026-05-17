import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/shared/components/Card';
import { EstadoDocumento } from '@/shared/types/pedido.types';

const DOCUMENTOS = [
  { key: 'selfie',               label: 'Foto personal (selfie)' },
  { key: 'dni_frente',           label: 'DNI — Frente' },
  { key: 'dni_dorso',            label: 'DNI — Dorso' },
  { key: 'antecedentes_penales', label: 'Antecedentes penales' },
  { key: 'antecedentes_judiciales', label: 'Antecedentes judiciales' },
] as const;

const estadoStyle: Record<EstadoDocumento, { label: string; className: string }> = {
  [EstadoDocumento.PENDIENTE]:  { label: 'Pendiente',  className: 'text-warning dark:text-warning-dark' },
  [EstadoDocumento.APROBADO]:   { label: 'Aprobado',   className: 'text-success dark:text-success-dark' },
  [EstadoDocumento.RECHAZADO]:  { label: 'Rechazado',  className: 'text-destructive dark:text-destructive-dark' },
};

// Placeholder: el estado real vendrá de la API en la implementación completa
const estadosMock: Record<string, EstadoDocumento> = {
  selfie:                  EstadoDocumento.PENDIENTE,
  dni_frente:              EstadoDocumento.PENDIENTE,
  dni_dorso:               EstadoDocumento.PENDIENTE,
  antecedentes_penales:    EstadoDocumento.PENDIENTE,
  antecedentes_judiciales: EstadoDocumento.PENDIENTE,
};

export default function DocumentosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-2">
        <Pressable onPress={() => router.back()} className="p-2">
          <Text className="text-primary text-lg">←</Text>
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-foreground dark:text-foreground-dark">
          Mis documentos
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
          Todos los documentos deben ser aprobados por el equipo de DeliverYa antes de poder recibir pedidos.
        </Text>

        {DOCUMENTOS.map(({ key, label }) => {
          const estado = estadosMock[key];
          const style = estadoStyle[estado];
          return (
            <Card key={key} className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  {label}
                </Text>
                <Text className={`text-xs mt-0.5 ${style.className}`}>{style.label}</Text>
              </View>
              <Pressable
                className="ml-4 bg-secondary dark:bg-secondary-dark px-3 py-1.5 rounded-lg active:opacity-75"
                onPress={() => { /* ImagePicker → upload → Fase 5 */ }}
              >
                <Text className="text-xs font-medium text-primary">
                  {estado === EstadoDocumento.RECHAZADO ? 'Subir nuevo' : 'Subir'}
                </Text>
              </Pressable>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
