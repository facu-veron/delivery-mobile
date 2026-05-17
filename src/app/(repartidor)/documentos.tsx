import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentoRepartidor } from '@/features/repartidor/api/repartidor.api';
import { useDocumentos } from '@/features/repartidor/hooks/useDocumentos';
import { useSubirDocumento } from '@/features/repartidor/hooks/useSubirDocumento';
import { Card } from '@/shared/components/Card';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EstadoDocumento } from '@/shared/types/pedido.types';

const DOCUMENTOS_LABELS: Record<string, string> = {
  selfie:                  'Foto personal (selfie)',
  dni_frente:              'DNI — Frente',
  dni_dorso:               'DNI — Dorso',
  antecedentes_penales:    'Antecedentes penales',
  antecedentes_judiciales: 'Antecedentes judiciales',
};

const DOCUMENTOS_KEYS = Object.keys(DOCUMENTOS_LABELS);

const estadoStyle: Record<EstadoDocumento, { label: string; className: string }> = {
  [EstadoDocumento.PENDIENTE]:  { label: 'Pendiente',  className: 'text-warning dark:text-warning-dark' },
  [EstadoDocumento.APROBADO]:   { label: 'Aprobado',   className: 'text-success dark:text-success-dark' },
  [EstadoDocumento.RECHAZADO]:  { label: 'Rechazado',  className: 'text-destructive dark:text-destructive-dark' },
};

interface DocumentoRowProps {
  doc: DocumentoRepartidor;
  onSubir: (key: string) => void;
  uploading: boolean;
}

function DocumentoRow({ doc, onSubir, uploading }: DocumentoRowProps) {
  const label = DOCUMENTOS_LABELS[doc.key] ?? doc.key;
  const style = estadoStyle[doc.estado];

  return (
    <Card className="flex-col gap-1">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
            {label}
          </Text>
          <Text className={`text-xs mt-0.5 ${style.className}`}>{style.label}</Text>
        </View>
        {doc.estado !== EstadoDocumento.APROBADO && (
          <Pressable
            className="bg-secondary dark:bg-secondary-dark px-3 py-1.5 rounded-lg active:opacity-75 disabled:opacity-50"
            onPress={() => onSubir(doc.key)}
            disabled={uploading}
          >
            <Text className="text-xs font-medium text-primary">
              {doc.estado === EstadoDocumento.RECHAZADO ? 'Subir nuevo' : 'Subir'}
            </Text>
          </Pressable>
        )}
      </View>
      {doc.estado === EstadoDocumento.RECHAZADO && doc.motivoRechazo && (
        <Text className="text-xs text-destructive dark:text-destructive-dark">
          Motivo: {doc.motivoRechazo}
        </Text>
      )}
    </Card>
  );
}

export default function DocumentosScreen() {
  const router = useRouter();
  const { data: documentos, isLoading } = useDocumentos();
  const { mutate: subir, isPending } = useSubirDocumento();

  const handleSubir = async (key: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir documentos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('archivo', {
      uri: asset.uri,
      name: asset.fileName ?? `${key}.jpg`,
      type: asset.mimeType ?? 'image/jpeg',
    } as any);

    subir({ key, formData });
  };

  // Build list merging API data with static keys (show all keys even if API returns subset)
  const docsMap = new Map((documentos ?? []).map((d) => [d.key, d]));
  const docsList: DocumentoRepartidor[] = DOCUMENTOS_KEYS.map(
    (key) => docsMap.get(key) ?? { key, estado: EstadoDocumento.PENDIENTE }
  );

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

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
            Todos los documentos deben ser aprobados por el equipo antes de poder recibir pedidos.
          </Text>

          {docsList.map((doc) => (
            <DocumentoRow
              key={doc.key}
              doc={doc}
              onSubir={handleSubir}
              uploading={isPending}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
