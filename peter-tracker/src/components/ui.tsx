import { ComponentProps, ReactNode, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, font, radius } from '../theme/tokens';
import { hhmm } from '../store/usePeter';
import type { Message } from '../services/api';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

export function PrimaryButton({ title, icon, onPress, tone = 'red', disabled }: {
  title: string; icon?: IconName; onPress?: () => void; tone?: 'red' | 'blue' | 'surface'; disabled?: boolean;
}) {
  const bg = { red: colors.red, blue: colors.blue, surface: colors.surface2 }[tone];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [s.btn, { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 }]}
    >
      {icon && <MaterialIcons name={icon} size={22} color={colors.text} />}
      <Text style={s.btnText}>{title}</Text>
    </Pressable>
  );
}

export function OutlineButton({ title, icon, onPress }: { title: string; icon?: IconName; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [s.btn, { borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
    >
      {icon && <MaterialIcons name={icon} size={20} color={colors.textSoft} />}
      <Text style={[s.btnText, { color: colors.textSoft }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, bg = colors.surface2, color = colors.text }: {
  icon: IconName; onPress?: () => void; label: string; bg?: string; color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [s.iconBtn, { backgroundColor: bg, opacity: pressed ? 0.7 : 1 }]}
    >
      <MaterialIcons name={icon} size={22} color={color} />
    </Pressable>
  );
}

export function TextField({ icon, error, right, ...props }: TextInputProps & {
  icon: IconName; error?: boolean; right?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const border = error ? colors.red : focused ? colors.blue : colors.border;
  return (
    <View style={[s.field, { borderColor: border }]}>
      <MaterialIcons name={icon} size={20} color={focused ? colors.blue : colors.textMuted} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={s.fieldInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {right}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}

export function InfoRow({ icon, label, value, sub }: { icon: IconName; label: string; value: string; sub?: string }) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIcon}>
        <MaterialIcons name={icon} size={20} color={colors.blue} />
      </View>
      <View style={{ flex: 1 }}>
        <SectionLabel>{label}</SectionLabel>
        <Text style={s.infoValue}>{value}</Text>
        {sub && <Text style={s.infoSub}>{sub}</Text>}
      </View>
    </View>
  );
}

export function Avatar({ size = 44, online, initials = 'PP' }: { size?: number; online?: boolean; initials?: string }) {
  return (
    <View style={{ width: size, height: size }}>
      <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={{ color: colors.text, fontFamily: font.display, fontSize: size * 0.4 }}>{initials}</Text>
      </View>
      {online && <View style={s.online} />}
    </View>
  );
}

export function ChatBubble({ msg }: { msg: Message }) {
  const mine = msg.from === 'me';
  return (
    <View style={[s.bubble, mine ? s.bubbleMine : s.bubblePeter]}>
      <Text style={s.bubbleText}>{msg.text}</Text>
      <View style={s.bubbleMeta}>
        <Text style={[s.bubbleTime, mine && { color: 'rgba(255,255,255,0.75)' }]}>{hhmm(msg.at)}</Text>
        {mine && (
          <MaterialIcons name={msg.read ? 'done-all' : 'done'} size={14} color="rgba(255,255,255,0.85)" />
        )}
      </View>
    </View>
  );
}

export function Banner({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={s.banner}>
      <MaterialIcons name={icon} size={20} color={colors.redSoft} />
      <Text style={s.bannerText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  btn: {
    height: 52, borderRadius: radius.md, flexDirection: 'row', gap: 8,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16,
  },
  btnText: { color: colors.text, fontFamily: font.bold, fontSize: 15, letterSpacing: 0.5 },
  iconBtn: { width: 44, height: 44, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  field: {
    height: 46, borderRadius: radius.sm, borderWidth: 1, backgroundColor: colors.bg,
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12,
  },
  fieldInput: { flex: 1, color: colors.text, fontFamily: font.medium, fontSize: 15, height: '100%' },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.border, padding: 16,
  },
  label: {
    fontSize: 11, letterSpacing: 1, color: colors.textMuted, fontFamily: font.semibold, textTransform: 'uppercase',
  },
  infoRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10 },
  infoIcon: {
    width: 40, height: 40, borderRadius: radius.sm, backgroundColor: 'rgba(61,139,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoValue: { color: colors.text, fontFamily: font.semibold, fontSize: 15, marginTop: 2 },
  infoSub: { color: colors.textMuted, fontFamily: font.body, fontSize: 13 },
  avatar: {
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  online: {
    position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.green, borderWidth: 2, borderColor: colors.bg,
  },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, marginVertical: 4 },
  bubblePeter: {
    alignSelf: 'flex-start', backgroundColor: colors.surface2,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 18, borderBottomLeftRadius: 6,
  },
  bubbleMine: {
    alignSelf: 'flex-end', backgroundColor: colors.blue,
    borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 6, borderBottomLeftRadius: 18,
  },
  bubbleText: { color: colors.text, fontFamily: font.body, fontSize: 15, lineHeight: 20 },
  bubbleMeta: { flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 },
  bubbleTime: { color: colors.textMuted, fontFamily: font.body, fontSize: 11 },
  banner: {
    flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#3a141c',
    borderWidth: 1, borderColor: colors.red, borderRadius: radius.sm, padding: 12,
  },
  bannerText: { flex: 1, color: colors.textSoft, fontFamily: font.medium, fontSize: 14 },
});
