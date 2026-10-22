import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, darkMapStyle, font, radius } from '../../theme/tokens';
import { INACTIVE_MIN, minutesSince, relTime, useAddress, useNow, usePeter } from '../../store/usePeter';
import { Avatar, Banner, Card, IconButton, SectionLabel } from '../../components/ui';

const DELTA = { latitudeDelta: 0.012, longitudeDelta: 0.012 };

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const status = usePeter((s) => s.status);
  const now = useNow();
  const address = useAddress(status?.coords, status?.address);
  const inactive = status && minutesSince(status.updatedAt, now) > INACTIVE_MIN;

  const recenter = () => {
    if (status) mapRef.current?.animateToRegion({ ...status.coords, ...DELTA }, 500);
  };

  useEffect(recenter, [status?.coords.latitude, status?.coords.longitude]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.mapBg }}>
      {status && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{ ...status.coords, ...DELTA }}
          customMapStyle={darkMapStyle}
          userInterfaceStyle="dark"
          showsCompass={false}
          toolbarEnabled={false}
        >
          <Marker coordinate={status.coords} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={s.markerWrap}>
              <View style={s.halo} />
              <Avatar size={44} />
              <View style={s.tag}>
                <Text style={s.tagText}>Peter · {relTime(status.updatedAt, now)}</Text>
              </View>
            </View>
          </Marker>
        </MapView>
      )}

      <SafeAreaView edges={['top']} style={s.header} pointerEvents="box-none">
        <Card style={s.hello}>
          <Avatar size={40} initials="MJ" />
          <View style={{ flex: 1 }}>
            <Text style={s.helloTitle}>Olá, MJ</Text>
            <Text style={s.helloSub}>Monitorando Peter</Text>
          </View>
          <IconButton icon="bar-chart" label="Abrir dashboard" onPress={() => router.navigate('/dashboard')} />
        </Card>
        {inactive && (
          <Banner icon="warning" text={`Localização sem atualizar há ${minutesSince(status.updatedAt, now)} min`} />
        )}
      </SafeAreaView>

      <View style={s.bottom} pointerEvents="box-none">
        <Pressable style={s.fab} onPress={recenter} accessibilityLabel="Recentralizar em Peter">
          <MaterialIcons name="my-location" size={24} color={colors.text} />
        </Pressable>
        <Card style={{ gap: 6 }}>
          <SectionLabel>Localização atual</SectionLabel>
          <Text style={s.address}>{address || 'Carregando…'}</Text>
          {status && (
            <Text style={s.time}>
              Atualizado {relTime(status.updatedAt, now)} · {status.coords.latitude.toFixed(4)},{' '}
              {status.coords.longitude.toFixed(4)}
            </Text>
          )}
        </Card>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  markerWrap: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(227,38,58,0.16)',
  },
  tag: {
    position: 'absolute', bottom: 4, backgroundColor: colors.surface, borderRadius: 10,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.border,
  },
  tagText: { color: colors.text, fontFamily: font.semibold, fontSize: 11 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, padding: 16, gap: 10 },
  hello: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  helloTitle: { color: colors.text, fontFamily: font.bold, fontSize: 16 },
  helloSub: { color: colors.textMuted, fontFamily: font.body, fontSize: 13 },
  bottom: { position: 'absolute', left: 16, right: 16, bottom: 16, gap: 12 },
  fab: {
    alignSelf: 'flex-end', width: 52, height: 52, borderRadius: radius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  address: { color: colors.text, fontFamily: font.semibold, fontSize: 17 },
  time: { color: colors.textMuted, fontFamily: font.body, fontSize: 13 },
});
