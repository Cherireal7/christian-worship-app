import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '../components/providers/app-preferences';
import { QuickNavMenu } from '../components/ui/quick-nav-menu';
import { getAppTheme } from '../constants/theme';

function DividerMark({ color, accent }: { color: string; accent: string }) {
  return (
    <View style={styles.dividerWrap}>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
      <View style={styles.dividerCenter}>
        <View style={[styles.dividerCenterDot, { borderColor: accent }]} />
        <View style={[styles.dividerCenterStem, { backgroundColor: accent }]} />
        <View style={[styles.dividerCenterBar, { backgroundColor: accent }]} />
      </View>
      <View style={[styles.dividerLine, { backgroundColor: color }]} />
    </View>
  );
}

const FONT_OPTIONS = [
  { key: 'small', label: 'ትንሽ', sample: '92%' },
  { key: 'medium', label: 'መካከለኛ', sample: '100%' },
  { key: 'large', label: 'ትልቅ', sample: '112%' },
] as const;

export default function SettingsScreen() {
  const {
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useAppPreferences();
  const theme = getAppTheme(darkMode);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <QuickNavMenu />
            <Pressable
              onPress={() => router.back()}
              style={[styles.headerButton, { backgroundColor: theme.control, borderColor: theme.border }]}
            >
              <Feather name="arrow-left" size={20} color={theme.text} />
            </Pressable>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <DividerMark color={theme.divider} accent={theme.accent} />

        <View style={[styles.panel, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <View style={styles.panelHeader}>
            <View style={[styles.iconBubble, { backgroundColor: theme.control, borderColor: theme.border }]}>
              <Text style={[styles.panelIcon, { color: theme.accent }]}>Tt</Text>
            </View>
            <View style={styles.panelTitleWrap}>
              <Text style={[styles.panelTitle, { color: theme.text }]}>የፊደል መጠን</Text>
              <Text style={[styles.panelSubtitle, { color: theme.textMuted }]}>
                የንባብ ጽሑፎች በሙሉ ይህን መጠን ይከተላሉ።
              </Text>
            </View>
          </View>

          <View style={styles.fontOptionsRow}>
            {FONT_OPTIONS.map(option => {
              const active = option.key === fontSize;

              return (
                <Pressable
                  key={option.key}
                  onPress={() => setFontSize(option.key)}
                  style={[
                    styles.fontOption,
                    {
                      backgroundColor: active ? theme.control : theme.surface,
                      borderColor: active ? theme.accent : theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.fontOptionLabel, { color: active ? theme.accent : theme.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.fontOptionValue, { color: theme.textMuted }]}>{option.sample}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBubble, { backgroundColor: theme.control, borderColor: theme.border }]}>
              <Feather name={darkMode ? 'moon' : 'sun'} size={18} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>
                {darkMode ? 'ጨለማ ቅጥ' : 'ብርሃን ቅጥ'}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>
                የመተግበሪያውን ቀለም በአንድ ጠቅታ ይቀይሩ።
              </Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: 'rgba(148, 163, 184, 0.4)', true: `${theme.accent}66` }}
            thumbColor={darkMode ? theme.control : '#FFFFFF'}
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <View style={styles.settingInfo}>
            <View style={[styles.iconBubble, { backgroundColor: theme.control, borderColor: theme.border }]}>
              <Feather name="bell" size={18} color={theme.accent} />
            </View>
            <View>
              <Text style={[styles.settingTitle, { color: theme.text }]}>የማስታወሻ ማንቂያዎች</Text>
              <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>
                በየጠዋቱ 7:00 የዕለቱ ንባቦች፣ የቅዱሳን ቀናት እና የእሁድ ንባቦችን ያስታውሳል።
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: 'rgba(148, 163, 184, 0.4)', true: `${theme.accent}66` }}
            thumbColor={notificationsEnabled ? theme.control : '#FFFFFF'}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>ስለ መተግበሪያው</Text>
          <Text style={[styles.infoBody, { color: theme.textMuted }]}>
            ይህ መተግበሪያ መዝሙሮች፣ የእምነት ኑዛዜዎች፣ ጸሎቶች እና የቀን መቁጠሪያ
            መረጃዎችን በአንድ ቦታ በቀላሉ ለማቅረብ የተዘጋጀ ነው። ዓላማው ተጠቃሚዎች
            የዕለት ንባብ፣ መዝሙር እና ጸሎት ይዘቶችን በአንድ ቦታ እንዲያገኙ ማድረግ ነው።
            የአሁኑ እትም 1.0.0 ነው።
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>እገዛ እና ድጋፍ</Text>
          <Text style={[styles.infoBody, { color: theme.textMuted }]}>
            የጽሑፍ ስህተት፣ የመተግበሪያ ችግኝ፣ የመዝሙር ርዕስ ማስተካከያ ወይም ሌላ ጥያቄ
            ካለዎት በቀጥታ ያግኙኝ። ማስተካከያ እና ድጋፍ በግል እንዲከታተል ተዘጋጅቷል።
          </Text>
          <View style={styles.detailList}>
            <Text style={[styles.detailItem, { color: theme.text }]}>ቴሌግራም: @cheri_figma</Text>
            <Text style={[styles.detailItem, { color: theme.text }]}>የመተግበሪያ ድጋፍ: የጽሑፍ ስህተት፣ ችግኝ እና ማሻሻያ ጥያቄዎች</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.surfaceStrong, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>የግላዊነት ማስታወቂያ</Text>
          <Text style={[styles.infoBody, { color: theme.textMuted }]}>
            በአሁኑ ሁኔታ ይህ መተግበሪያ የተጠቃሚ መለያ ወይም የግል መረጃ አያከማችም።
            ወደፊት የተወዳጅ ዝርዝሮች ወይም ሌሎች የውስጥ ባህሪያት ቢጨመሩ ይህ ክፍል
            በዚያ መሠረት ይዘምናል።

            NB: This project is partially open-source.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerSpacer: { width: 86 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  dividerWrap: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 22 },
  dividerLine: { flex: 1, height: 1 },
  dividerCenter: { width: 32, height: 24, alignItems: 'center', justifyContent: 'center' },
  dividerCenterDot: { width: 7, height: 7, borderRadius: 999, backgroundColor: '#08132C', borderWidth: 1 },
  dividerCenterStem: { position: 'absolute', width: 2, height: 18, opacity: 0.78 },
  dividerCenterBar: { position: 'absolute', width: 16, height: 2, opacity: 0.78 },
  panel: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  panelIcon: { fontSize: 22, fontWeight: '800' },
  panelTitleWrap: { flex: 1 },
  panelTitle: { fontSize: 19, fontWeight: '800' },
  panelSubtitle: { fontSize: 13, lineHeight: 20, marginTop: 2 },
  fontOptionsRow: { flexDirection: 'row', gap: 10 },
  fontOption: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontOptionLabel: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  fontOptionValue: { fontSize: 12, fontWeight: '700' },
  settingRow: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingTitle: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  settingSubtitle: { fontSize: 13, lineHeight: 20 },
  infoCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  infoTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  infoBody: { fontSize: 14, lineHeight: 23 },
  detailList: { marginTop: 10, gap: 8 },
  detailItem: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
});
