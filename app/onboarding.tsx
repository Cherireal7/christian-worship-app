import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ONBOARDING_DONE_KEY = 'hasCompletedOnboarding';

import { OnboardingSlide } from '../components/ui/onboarding-slide';
import { ONBOARDING_SLIDES } from '../constants/onboarding';

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === ONBOARDING_SLIDES.length - 1;

  function scrollToIndex(index: number) {
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
    setActiveIndex(index);
  }

  function handleMomentumScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(nextIndex);
  }

  async function markDoneAndNavigate() {
    await AsyncStorage.setItem(ONBOARDING_DONE_KEY, 'true');
    router.replace('/home');
  }

  function handleNext() {
    if (isLast) {
      void markDoneAndNavigate();
      return;
    }

    scrollToIndex(activeIndex + 1);
  }

  function handleBack() {
    if (isFirst) {
      return;
    }

    scrollToIndex(activeIndex - 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBackground} />
        <View style={styles.bottomBackground} />
        <View style={styles.diagonalBand} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.leadingSlot}>
              {!isFirst ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  hitSlop={12}
                  onPress={handleBack}
                  style={styles.backButton}
                >
                  <Text style={styles.backArrow}>←</Text>
                </Pressable>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip onboarding"
              hitSlop={12}
              onPress={() => void markDoneAndNavigate()}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            style={styles.slider}
            contentContainerStyle={styles.sliderContent}
          >
            {ONBOARDING_SLIDES.map(item => (
              <View key={item.id} style={[styles.slidePage, { width }]}>
                <OnboardingSlide slide={item} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.pagination}>
              {ONBOARDING_SLIDES.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.paginationDot,
                    index === activeIndex
                      ? styles.paginationDotActive
                      : styles.paginationDotInactive,
                  ]}
                />
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handleNext}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>{slide.buttonText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#081C4A',
  },
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#081C4A',
  },
  topBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#081C4A',
  },
  bottomBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: '#0E3A8A',
  },
  diagonalBand: {
    position: 'absolute',
    left: -48,
    right: -48,
    bottom: '24%',
    height: 154,
    backgroundColor: '#38BDF8',
    opacity: 0.28,
    transform: [{ rotate: '-12deg' }],
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 28,
  },
  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  leadingSlot: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: '#F8FAFC',
  },
  skipText: {
    fontSize: 20,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  slider: {
    flex: 1,
  },
  sliderContent: {
    flexGrow: 1,
  },
  slidePage: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  paginationDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(226, 232, 240, 0.45)',
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
