import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentoRepartidor } from '@/features/repartidor/api/repartidor.api';
import { useDocumentos } from '@/features/repartidor/hooks/useDocumentos';
import { useSubirDocumento } from '@/features/repartidor/hooks/useSubirDocumento';
import { Badge } from '@/shared/components/Badge';
import { Card } from '@/shared/components/Card';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { EstadoDocumento } from '@/shared/types/pedido.types';

const DOCUMENTOS_LABELS: Record<string, string> = {
  selfie:                  'Foto personal (selfie)',
  dni_frente:              'DNI — Frente',
  dni_dorso:               'DNI — Dorso',
  antecedentes_penales:    'Antecedentes penales',
  antecedentes_judiciales: 'Antecedentes judiciales',
};

const DOCUMENTOS_KEYS = Object.keys(DOCUMENTOS_LABELS);

const estadoVariant: Record<EstadoDocumento, 'warning' | 'success' | 'destructive'> = {
  [EstadoDocumento.PENDIENTE]: 'warning',
  [EstadoDocumento.APROBADO]:  'success',
  [EstadoDocumento.RECHAZADO]: 'destructive',
};

const estadoLabel: Record<EstadoDocumento, string> = {
  [EstadoDocumento.PENDIENTE]: 'Pendiente',
  [EstadoDocumento.APROBADO]:  'Aprobado',
  [EstadoDocumento.RECHAZADO]: 'Rechazado',
};

interface DocumentoRowProps {
  doc: DocumentoRepartidor;
  onSubir: (key: string) => void;
  uploading: boolean;
}

function DocumentoRow({ doc, onSubir, uploading }: DocumentoRowProps) {
  const label = DOCUMENTOS_LABELS[doc.key] ?? doc.key;

  return (
    <Card className="gap-2">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
            {label}
          </Text>
          <View className="mt-1.5">
            <Badge variant={estadoVariant[doc.estado]} dot>
              {estadoLabel[doc.estado]}
            </Badge>
          </View>
        </View>
        {doc.estado !== EstadoDocumento.APROBADO && (
          <Pressable
            className="flex-row items-center gap-1.5 bg-secondary dark:bg-secondary-dark px-3 py-2 rounded-lg active:opacity-75 disabled:opacity-50"
            onPress={() => onSubir(doc.key)}
            disabled={uploading}
          >
            <Upload size={14} color="#EEC234" strokeWidth={2.25} />
            <Text className="text-xs font-semibold text-primary">
              {doc.estado === EstadoDocumento.RECHAZADO ? 'Subir nuevo' : 'Subir'}
            </Text>
          </Pressable>
        )}
      </View>
      {doc.estado === EstadoDocumento.RECHAZADO && doc.motivoRechazo && (
        <Text className="text-xs text-destructive dark:text-destructive-dark mt-0.5">
          Motivo: {doc.motivoRechazo}
        </Text>
      )}
    </Card>
  );
}

export default function DocumentosScreen() {
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
      <ScreenHeader title="Mis documentos" />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          <View className="flex-row items-start gap-2.5 bg-warning-light dark:bg-warning-dark-light border border-warning/20 rounded-xl p-3.5">
            <Camera size={18} color="#DFB030" strokeWidth={2} />
            <Text className="flex-1 text-xs text-warning dark:text-warning-dark leading-5">
              Todos los documentos deben ser aprobados por el equipo antes de poder recibir pedidos.
            </Text>
          </View>

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
