import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius } from '../theme/tokens';
import { minutesSince, usePeter } from '../store/usePeter';
import { OutlineButton, PrimaryButton } from './ui';

// ponytail: Modal nativo no lugar de @gorhom/bottom-sheet; trocar se precisar de snap points/arrastar.
export function DangerSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const status = usePeter((st) => st.status);
  const min = status ? minutesSince(status.updatedAt) : 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose} accessibilityLabel="Fechar" />
      <View style={[s.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={s.handle} />
        <View style={s.icon}>
          <MaterialIcons name="warning" size={32} color={colors.redSoft} />
        </View>
        <Text style={s.title}>Peter está em perigo?</Text>
        <Text style={s.text}>
          Peter não atendeu e a localização não atualiza há {min} min. Se achar que ele precisa de ajuda,
          acione as autoridades.
        </Text>
        <View style={{ gap: 10, alignSelf: 'stretch' }}>
          <PrimaryButton
            title="Sim, acionar autoridades"
            icon="shield"
            onPress={() => {
              onClose();
              router.push('/emergencia');
            }}
          />
          <OutlineButton title="Não, voltar ao chat" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(5,7,12,0.6)' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet,
    padding: 24, alignItems: 'center', gap: 14,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 4 },
  icon: {
    width: 64, height: 64, borderRadius: radius.xl, backgroundColor: colors.redBg,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: colors.text, fontFamily: font.display, fontSize: 28 },
  text: { color: colors.textSoft, fontFamily: font.body, fontSize: 15, textAlign: 'center', lineHeight: 21 },
});
