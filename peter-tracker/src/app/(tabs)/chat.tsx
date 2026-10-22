import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { colors, font, radius } from '../../theme/tokens';
import { useChat } from '../../store/useChat';
import { usePeter } from '../../store/usePeter';
import { Avatar, ChatBubble, IconButton } from '../../components/ui';
import { DangerSheet } from '../../components/DangerSheet';

export default function Chat() {
  const router = useRouter();
  const { danger } = useLocalSearchParams<{ danger?: string }>();
  const { messages, send, markRead } = useChat();
  const status = usePeter((s) => s.status);
  const [text, setText] = useState('');

  useFocusEffect(useCallback(() => markRead(), [messages.length]));

  const closeDanger = () => router.setParams({ danger: undefined });
  const call = () => router.push('/call');

  const submit = () => {
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  };

  const shareLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;
      const { coords } = await Location.getCurrentPositionAsync();
      send(`📍 Minha localização: https://maps.google.com/?q=${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}`);
    } catch {
      // sem GPS disponível
    }
  };

  const neighborhood = status?.address.split(',').slice(-2, -1)[0]?.trim() ?? '';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={s.header}>
        <IconButton icon="arrow-back" label="Voltar" onPress={() => router.navigate('/')} />
        <Avatar size={40} online={status?.online} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>Peter</Text>
          <Text style={s.sub}>{status?.online ? 'online' : 'offline'} · {neighborhood}</Text>
        </View>
        <IconButton icon="call" label="Ligar para Peter" bg={colors.red} onPress={call} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
      >
        <FlatList
          inverted
          data={[...messages].reverse()}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <ChatBubble msg={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListFooterComponent={
            <View style={s.datePill}>
              <Text style={s.dateText}>HOJE</Text>
            </View>
          }
        />

        <View style={s.callCard}>
          <MaterialIcons name="phone-in-talk" size={20} color={colors.blue} />
          <Text style={s.callText}>Precisa falar diretamente?</Text>
          <Pressable style={s.callBtn} onPress={call}>
            <MaterialIcons name="call" size={16} color={colors.text} />
            <Text style={s.callBtnText}>Ligar</Text>
          </Pressable>
        </View>

        <View style={s.inputRow}>
          <View style={s.input}>
            <Pressable onPress={shareLocation} hitSlop={10} accessibilityLabel="Compartilhar localização">
              <MaterialIcons name="add-location-alt" size={22} color={colors.textMuted} />
            </Pressable>
            <TextInput
              style={s.inputText}
              placeholder="Mensagem"
              placeholderTextColor={colors.textMuted}
              value={text}
              onChangeText={setText}
              onSubmitEditing={submit}
              returnKeyType="send"
            />
          </View>
          <Pressable style={s.send} onPress={submit} accessibilityLabel="Enviar">
            <MaterialIcons name="send" size={20} color={colors.text} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <DangerSheet visible={danger === '1'} onClose={closeDanger} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  name: { color: colors.text, fontFamily: font.bold, fontSize: 16 },
  sub: { color: colors.green, fontFamily: font.medium, fontSize: 12 },
  datePill: {
    alignSelf: 'center', backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 8,
  },
  dateText: { color: colors.textMuted, fontFamily: font.semibold, fontSize: 11, letterSpacing: 1 },
  callCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8,
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingLeft: 14, paddingRight: 6, paddingVertical: 6,
  },
  callText: { flex: 1, color: colors.textSoft, fontFamily: font.medium, fontSize: 14 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.red,
    borderRadius: radius.sm, paddingHorizontal: 14, height: 40,
  },
  callBtnText: { color: colors.text, fontFamily: font.bold, fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  input: {
    flex: 1, height: 46, borderRadius: 23, backgroundColor: colors.surface, borderWidth: 1,
    borderColor: colors.border, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14,
  },
  inputText: { flex: 1, color: colors.text, fontFamily: font.body, fontSize: 15, height: '100%' },
  send: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: colors.red,
    alignItems: 'center', justifyContent: 'center',
  },
});
