import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppPreferences } from '../../components/providers/app-preferences';
import { getAppTheme } from '../../constants/theme';

function HomeCrossMark() {
  return (
    <View style={styles.crossWrap}>
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
      <View style={styles.crossHalo} />
      <View style={styles.crossRayVertical} />
      <View style={styles.crossRayHorizontal} />
      <View style={styles.crossRayDiagonalLeft} />
      <View style={styles.crossRayDiagonalRight} />
    </View>
  );
}

function DecorativeDivider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerCenterWrap}>
        <View style={styles.dividerCenterDot} />
        <View style={styles.dividerCenterCrossVertical} />
        <View style={styles.dividerCenterCrossHorizontal} />
      </View>
      <View style={styles.dividerLine} />
    </View>
  );
}

type HomeActionCardProps = {
  title: string;
  subtitle: string;
  href: '/hymn-book' | '/declaration-of-faith';
  backgroundColor: string;
};

function HomeActionCard({ title, subtitle, href, backgroundColor }: HomeActionCardProps) {
  return (
    <Pressable onPress={() => router.push(href)} style={[styles.actionCard, { backgroundColor }]}>
      <View>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.actionArrowWrap}>
        <Ionicons name="chevron-forward" size={20} color="#F8FAFC" />
      </View>
    </Pressable>
  );
}

export default function LibraryHomeScreen() {
  const { darkMode, fontScale } = useAppPreferences();
  const theme = getAppTheme(darkMode);
  const actionCardColor = darkMode ? '#0E3A8A' : '#10244D';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: darkMode ? '#0B3078' : '#DCE7F8' }]}>
          <Pressable
            onPress={() => router.push('/settings')}
            style={[styles.settingsButton, { backgroundColor: theme.control, borderColor: theme.border }]}
          >
            <Feather name="settings" size={22} color={theme.text} />
          </Pressable>

          <HomeCrossMark />

          <Text style={[styles.heroTitle, { color: theme.text, fontSize: 19 * fontScale, lineHeight: 31 * fontScale }]}>
            የሉተር መሠረተ እምነት እና የሥርዓተ አምልኮ ጽሑፎች
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textMuted, fontSize: 13 * fontScale }]}>Creeds & Liturgical Texts</Text>

          <DecorativeDivider />

          <View style={styles.actionsWrap}>
            <HomeActionCard
              title="መዝሙር መጽሐፍ"
              subtitle="Hymn book"
              href="/hymn-book"
              backgroundColor={actionCardColor}
            />
            <HomeActionCard
              title="የእምነት መግለጫ"
              subtitle="Declaration of Faith."
              href="/declaration-of-faith"
              backgroundColor={actionCardColor}
            />
          </View>

          <ImageBackground
            imageStyle={styles.verseCardImage}
            source={require('../../assets/images/cover.png')}
            style={[styles.verseCard, { borderColor: theme.border }]}
          >
            <View style={styles.verseOverlay} />
            <View style={styles.verseCrossWrap}>
              <Ionicons name="add" size={30} color={theme.text} />
            </View>
            <Text style={[styles.verseTitle, { color: theme.text, fontSize: 19 * fontScale }]}>የዕለቱ ቃል</Text>
            <Text style={[styles.verseText, { color: theme.text, fontSize: 14 * fontScale, lineHeight: 21 * fontScale }]}>
              መጽሐፍ ቅዱስ በሙሉ ከእግዚአብሔር መንፈስ የተነሣ የተጻፈ ነው።
            </Text>
            <Text style={[styles.verseReference, { color: theme.text, fontSize: 13 * fontScale }]}>2 ጢሞቴዎስ 3:16</Text>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06164B',
  },
  contentContainer: {
    paddingBottom: 96,
  },
  heroCard: {
    backgroundColor: '#0B3078',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
  settingsButton: {
    position: 'absolute',
    top: 28,
    right: 18,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
  },
  crossWrap: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  crossHalo: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  crossVertical: {
    width: 9,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  crossHorizontal: {
    position: 'absolute',
    width: 34,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  crossRayVertical: {
    position: 'absolute',
    width: 1,
    height: 92,
    backgroundColor: 'rgba(12, 18, 34, 0.38)',
  },
  crossRayHorizontal: {
    position: 'absolute',
    width: 92,
    height: 1,
    backgroundColor: 'rgba(12, 18, 34, 0.38)',
  },
  crossRayDiagonalLeft: {
    position: 'absolute',
    width: 92,
    height: 1,
    backgroundColor: 'rgba(12, 18, 34, 0.38)',
    transform: [{ rotate: '45deg' }],
  },
  crossRayDiagonalRight: {
    position: 'absolute',
    width: 92,
    height: 1,
    backgroundColor: 'rgba(12, 18, 34, 0.38)',
    transform: [{ rotate: '-45deg' }],
  },
  heroTitle: {
    color: '#F8FAFC',
    textAlign: 'center',
    fontSize: 19,
    lineHeight: 31,
    fontWeight: '800',
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  heroSubtitle: {
    color: '#D6E1F3',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(125, 211, 252, 0.22)',
  },
  dividerCenterWrap: {
    width: 34,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#0B183C',
    borderWidth: 1,
    borderColor: '#D8A24F',
  },
  dividerCenterCrossVertical: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: 'rgba(216, 162, 79, 0.75)',
  },
  dividerCenterCrossHorizontal: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: 'rgba(216, 162, 79, 0.75)',
  },
  actionsWrap: {
    gap: 12,
    marginBottom: 14,
  },
  actionCard: {
    borderRadius: 15,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 7,
  },
  actionSubtitle: {
    color: '#CBD5E1',
    fontSize: 14,
  },
  actionArrowWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseCard: {
    height: 146,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  verseCardImage: {
    borderRadius: 14,
  },
  verseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 18, 49, 0.38)',
  },
  verseCrossWrap: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    opacity: 0.9,
  },
  verseTitle: {
    color: '#F8FAFC',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  verseText: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: '92%',
  },
  verseReference: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
});
