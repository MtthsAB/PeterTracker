import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, Tabs, useRouter } from 'expo-router';
import { colors, font } from '../../theme/tokens';
import { useAuth } from '../../store/useAuth';
import { usePeter } from '../../store/usePeter';
import { useChat } from '../../store/useChat';
import type { IconName } from '../../components/ui';

function TabIcon({ name, focused, badge }: { name: IconName; focused: boolean; badge?: number }) {
  return (
    <View style={[s.pill, focused && { backgroundColor: colors.redBg }]}>
      <MaterialIcons name={name} size={22} color={focused ? colors.redSoft : colors.textMuted} />
      {!!badge && (
        <View style={s.badge}>
          <Text style={s.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabsLayout() {
  const router = useRouter();
  const token = useAuth((st) => st.token);
  const unread = useChat((st) => st.unread);
  const { refresh, subscribe } = usePeter();

  useEffect(() => {
    refresh();
    return subscribe();
  }, []);

  if (!token) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 72, backgroundColor: colors.bg, borderTopColor: colors.border, paddingTop: 8 },
        tabBarActiveTintColor: colors.redSoft,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: font.semibold, fontSize: 11 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Mapa', tabBarIcon: ({ focused }) => <TabIcon name="map" focused={focused} /> }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon name="bar-chart" focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} badge={unread} />,
        }}
      />
      <Tabs.Screen
        name="autoridades"
        options={{ title: 'Autoridades', tabBarIcon: ({ focused }) => <TabIcon name="shield" focused={focused} /> }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/emergencia');
          },
        }}
      />
    </Tabs>
  );
}

const s = StyleSheet.create({
  pill: { width: 56, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute', top: -2, right: 8, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { color: colors.text, fontFamily: font.bold, fontSize: 10 },
});
