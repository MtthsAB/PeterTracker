import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, font, radius } from '../theme/tokens';
import { loadSavedCreds, useAuth } from '../store/useAuth';
import { Banner, Card, PrimaryButton, TextField } from '../components/ui';

// Alturas dos prédios do skyline (placeholder da ilustração de NY).
const SKYLINE = [38, 62, 46, 90, 54, 120, 70, 44, 84, 58, 100, 40, 66, 50];

export default function Login() {
  const router = useRouter();
  const { login, error, attemptsLeft, loading } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    loadSavedCreds().then((c) => {
      if (!c) return;
      setUser(c.user);
      setPass(c.pass);
      setRemember(true);
    });
  }, []);

  const submit = async () => {
    if (await login(user, pass, remember)) router.replace('/(tabs)');
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.top}>
            <View style={s.logo}>
              <MaterialIcons name="my-location" size={32} color={colors.text} />
            </View>
            <Text style={s.title}>Peter Tracker</Text>
            <Text style={s.subtitle}>SEMPRE UM PASSO À FRENTE</Text>
          </View>

          <Card style={{ gap: 14 }}>
            {error && <Banner icon="error" text={error} />}
            <TextField
              icon="person"
              placeholder="Usuário"
              value={user}
              onChangeText={setUser}
              autoCapitalize="none"
              autoCorrect={false}
              error={!!error}
            />
            <TextField
              icon="lock"
              placeholder="Senha"
              value={pass}
              onChangeText={setPass}
              secureTextEntry={!show}
              error={!!error}
              onSubmitEditing={submit}
              right={
                <Pressable onPress={() => setShow(!show)} hitSlop={12} accessibilityLabel="Mostrar senha">
                  <MaterialIcons name={show ? 'visibility-off' : 'visibility'} size={20} color={colors.textMuted} />
                </Pressable>
              }
            />
            {error && (
              <Text style={s.attempts}>
                {attemptsLeft} de 5 tentativas restantes
              </Text>
            )}
            <View style={s.row}>
              <Pressable
                style={s.check}
                onPress={() => setRemember(!remember)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: remember }}
              >
                <MaterialIcons
                  name={remember ? 'check-box' : 'check-box-outline-blank'}
                  size={22}
                  color={remember ? colors.blue : colors.textMuted}
                />
                <Text style={s.small}>Lembrar senha</Text>
              </Pressable>
              <Pressable hitSlop={12}>
                <Text style={[s.small, { color: colors.blue }]}>Esqueci a senha</Text>
              </Pressable>
            </View>
            <PrimaryButton
              title={loading ? 'ENTRANDO…' : error ? 'TENTAR NOVAMENTE' : 'ENTRAR'}
              onPress={submit}
              disabled={loading || attemptsLeft <= 0}
            />
          </Card>
          <Text style={s.hint}>Demo: usuário "mj", senha "peter123"</Text>

          <View style={s.skyline}>
            {SKYLINE.map((h, i) => (
              <View key={i} style={[s.building, { height: h }]} />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, padding: 20, paddingTop: 48, gap: 24 },
  top: { alignItems: 'center', gap: 6 },
  logo: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: colors.red,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  title: { color: colors.text, fontFamily: font.display, fontSize: 30 },
  subtitle: { color: colors.textMuted, fontFamily: font.semibold, fontSize: 12, letterSpacing: 1 },
  attempts: { color: colors.redSoft, fontFamily: font.semibold, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  check: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  small: { color: colors.textSoft, fontFamily: font.medium, fontSize: 14 },
  hint: { color: colors.textMuted, fontFamily: font.body, fontSize: 12, textAlign: 'center' },
  skyline: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 4, minHeight: 120, opacity: 0.35,
  },
  building: { flex: 1, backgroundColor: colors.surface2, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
});
