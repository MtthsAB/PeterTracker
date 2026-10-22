import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, darkMapStyle, font, radius } from '../../theme/tokens';
import { hhmm, INACTIVE_MIN, minutesSince, MOODS, relTime, useAddress, useNow, usePeter } from '../../store/usePeter';
import { Avatar, Banner, Card, IconButton, InfoRow, OutlineButton, SectionLabel } from '../../components/ui';

export default function Dashboard() {
  const router = useRouter();
  const { status, refresh } = usePeter();
  const now = useNow();
  const address = useAddress(status?.coords, status?.address);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const mood = status && MOODS[status.mood];
  const home = () => router.navigate('/');

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={s.header}>
        <IconButton icon="arrow-back" label="Voltar" onPress={home} />
        <Text style={s.title}>Dashboard</Text>
        <IconButton icon="refresh" label="Atualizar" onPress={onRefresh} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
      >
        {status && mood && (
          <>
            {minutesSince(status.updatedAt, now) > INACTIVE_MIN && (
              <Banner icon="warning" text={`Localização sem atualizar há ${minutesSince(status.updatedAt, now)} min`} />
            )}

            <Card style={{ gap: 12 }}>
              <SectionLabel>Humor de Peter</SectionLabel>
              <View style={s.moodRow}>
                <Avatar size={52} online={status.online} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialIcons name={mood.icon} size={22} color={mood.color} />
                    <Text style={[s.mood, { color: mood.color }]}>{mood.label}</Text>
                  </View>
                  <Text style={s.muted}>Baseado na movimentação recente · desde {hhmm(status.moodSince)}</Text>
                </View>
              </View>
            </Card>

            <View style={s.miniMap}>
              <MapView
                style={StyleSheet.absoluteFill}
                region={{ ...status.coords, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
                customMapStyle={darkMapStyle}
                userInterfaceStyle="dark"
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                toolbarEnabled={false}
              >
                <Marker coordinate={status.coords} pinColor={colors.red} />
              </MapView>
              <Pressable style={s.chip} onPress={home}>
                <MaterialIcons name="open-in-full" size={14} color={colors.text} />
                <Text style={s.chipText}>Abrir mapa</Text>
              </Pressable>
            </View>

            <Card style={{ paddingVertical: 6 }}>
              <InfoRow
                icon="place"
                label="Última localização"
                value={address}
                sub={`${status.coords.latitude.toFixed(5)}, ${status.coords.longitude.toFixed(5)}`}
              />
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <InfoRow
                icon="schedule"
                label="Última atualização"
                value={relTime(status.updatedAt, now)}
                sub={`às ${hhmm(status.updatedAt)}`}
              />
            </Card>
          </>
        )}
        <OutlineButton title="Voltar à tela principal" icon="home" onPress={home} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { color: colors.text, fontFamily: font.display, fontSize: 24 },
  content: { padding: 16, paddingTop: 0, gap: 14 },
  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  mood: { fontFamily: font.display, fontSize: 22 },
  muted: { color: colors.textMuted, fontFamily: font.body, fontSize: 13, marginTop: 2 },
  miniMap: {
    height: 124, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.mapBg,
    borderWidth: 1, borderColor: colors.border,
  },
  chip: {
    position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6,
  },
  chipText: { color: colors.text, fontFamily: font.semibold, fontSize: 12 },
});
