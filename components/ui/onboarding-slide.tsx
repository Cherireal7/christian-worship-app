import { StyleSheet, Text, View } from 'react-native';

import type { OnboardingItem } from '../../constants/onboarding';

type OnboardingSlideProps = {
  slide: OnboardingItem;
};

function CrossIcon() {
  return (
    <View style={styles.iconFrame}>
      <View style={styles.crossVertical} />
      <View style={styles.crossHorizontal} />
      <View style={styles.crossRayTop} />
      <View style={styles.crossRayBottom} />
      <View style={styles.crossRayLeft} />
      <View style={styles.crossRayRight} />
      <View style={styles.crossRayTopLeft} />
      <View style={styles.crossRayTopRight} />
      <View style={styles.crossRayBottomLeft} />
      <View style={styles.crossRayBottomRight} />
    </View>
  );
}

function MusicIcon() {
  return (
    <View style={styles.iconFrame}>
      <View style={styles.organCrossVertical} />
      <View style={styles.organCrossHorizontal} />
      <View style={styles.organBody}>
        <View style={styles.organArch} />
        <View style={styles.organPipeOuterLeft} />
        <View style={styles.organPipeInnerLeft} />
        <View style={styles.organPipeCenter} />
        <View style={styles.organPipeInnerRight} />
        <View style={styles.organPipeOuterRight} />
        <View style={styles.organConsole} />
      </View>
    </View>
  );
}

function BookIcon() {
  return (
    <View style={styles.iconFrame}>
      <View style={styles.bookStand} />
      <View style={styles.bookStandLegLeft} />
      <View style={styles.bookStandLegRight} />
      <View style={styles.openBook}>
        <View style={styles.pageLeft} />
        <View style={styles.pageRight} />
        <View style={styles.pageSpine} />
        <View style={styles.pageLineLeftTop} />
        <View style={styles.pageLineLeftBottom} />
        <View style={styles.pageLineRightTop} />
        <View style={styles.pageLineRightBottom} />
        <View style={styles.pageRibbon} />
        <View style={styles.pageCrossVertical} />
        <View style={styles.pageCrossHorizontal} />
      </View>
      <View style={styles.bookShadow} />
    </View>
  );
}

function SlideIcon({ icon }: { icon: OnboardingItem['icon'] }) {
  switch (icon) {
    case 'cross':
      return <CrossIcon />;
    case 'music':
      return <MusicIcon />;
    case 'book':
      return <BookIcon />;
  }
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  return (
    <View style={styles.container}>
      <SlideIcon icon={slide.icon} />
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  iconFrame: {
    width: 152,
    height: 152,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    maxWidth: 280,
    textAlign: 'center',
    color: '#F8FAFC',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
  },
  description: {
    maxWidth: 286,
    marginTop: 28,
    textAlign: 'center',
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 26,
    fontWeight: '400',
  },
  crossVertical: {
    width: 14,
    height: 74,
    backgroundColor: '#F8FAFC',
  },
  crossHorizontal: {
    position: 'absolute',
    width: 54,
    height: 8,
    backgroundColor: '#F8FAFC',
  },
  crossRayTop: {
    position: 'absolute',
    top: 18,
    width: 1,
    height: 30,
    backgroundColor: '#F8FAFC',
  },
  crossRayBottom: {
    position: 'absolute',
    bottom: 18,
    width: 1,
    height: 28,
    backgroundColor: '#F8FAFC',
  },
  crossRayLeft: {
    position: 'absolute',
    left: 18,
    width: 26,
    height: 1,
    backgroundColor: '#F8FAFC',
  },
  crossRayRight: {
    position: 'absolute',
    right: 18,
    width: 26,
    height: 1,
    backgroundColor: '#F8FAFC',
  },
  crossRayTopLeft: {
    position: 'absolute',
    top: 28,
    left: 30,
    width: 22,
    height: 1,
    backgroundColor: '#F8FAFC',
    transform: [{ rotate: '-56deg' }],
  },
  crossRayTopRight: {
    position: 'absolute',
    top: 28,
    right: 30,
    width: 22,
    height: 1,
    backgroundColor: '#F8FAFC',
    transform: [{ rotate: '56deg' }],
  },
  crossRayBottomLeft: {
    position: 'absolute',
    bottom: 28,
    left: 30,
    width: 22,
    height: 1,
    backgroundColor: '#F8FAFC',
    transform: [{ rotate: '56deg' }],
  },
  crossRayBottomRight: {
    position: 'absolute',
    bottom: 28,
    right: 30,
    width: 22,
    height: 1,
    backgroundColor: '#F8FAFC',
    transform: [{ rotate: '-56deg' }],
  },
  organCrossVertical: {
    position: 'absolute',
    top: 18,
    width: 6,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
  },
  organCrossHorizontal: {
    position: 'absolute',
    top: 26,
    width: 18,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
  },
  organBody: {
    width: 108,
    height: 92,
    marginTop: 20,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(224, 242, 254, 0.24)',
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  organArch: {
    position: 'absolute',
    top: 16,
    width: 74,
    height: 30,
    borderTopLeftRadius: 37,
    borderTopRightRadius: 37,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#E0F2FE',
  },
  organPipeOuterLeft: {
    position: 'absolute',
    bottom: 16,
    left: 22,
    width: 12,
    height: 34,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#7DD3FC',
  },
  organPipeInnerLeft: {
    position: 'absolute',
    bottom: 16,
    left: 40,
    width: 12,
    height: 42,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#E0F2FE',
  },
  organPipeCenter: {
    width: 14,
    height: 50,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: '#F8FAFC',
  },
  organPipeInnerRight: {
    position: 'absolute',
    bottom: 16,
    right: 40,
    width: 12,
    height: 42,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#E0F2FE',
  },
  organPipeOuterRight: {
    position: 'absolute',
    bottom: 16,
    right: 22,
    width: 12,
    height: 34,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#7DD3FC',
  },
  organConsole: {
    position: 'absolute',
    bottom: 10,
    width: 64,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
  },
  bookStand: {
    position: 'absolute',
    bottom: 30,
    width: 86,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E0F2FE',
  },
  bookStandLegLeft: {
    position: 'absolute',
    bottom: 38,
    left: 52,
    width: 6,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#7DD3FC',
    transform: [{ rotate: '30deg' }],
  },
  bookStandLegRight: {
    position: 'absolute',
    bottom: 38,
    right: 52,
    width: 6,
    height: 26,
    borderRadius: 999,
    backgroundColor: '#7DD3FC',
    transform: [{ rotate: '-30deg' }],
  },
  openBook: {
    width: 110,
    height: 78,
    marginBottom: 26,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(224, 242, 254, 0.24)',
    flexDirection: 'row',
  },
  pageLeft: {
    flex: 1,
    marginRight: 3,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  pageRight: {
    flex: 1,
    marginLeft: 3,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  pageSpine: {
    position: 'absolute',
    left: '50%',
    marginLeft: -5,
    width: 10,
    height: 78,
    borderRadius: 999,
    backgroundColor: '#1D4ED8',
  },
  pageLineLeftTop: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 24,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#BFDBFE',
  },
  pageLineLeftBottom: {
    position: 'absolute',
    top: 28,
    left: 18,
    width: 18,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#BFDBFE',
  },
  pageLineRightTop: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 24,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#BFDBFE',
  },
  pageLineRightBottom: {
    position: 'absolute',
    top: 28,
    right: 18,
    width: 18,
    height: 3,
    borderRadius: 999,
    backgroundColor: '#BFDBFE',
  },
  pageRibbon: {
    position: 'absolute',
    top: 0,
    right: 26,
    width: 10,
    height: 48,
    backgroundColor: '#38BDF8',
  },
  pageCrossVertical: {
    position: 'absolute',
    bottom: 14,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  pageCrossHorizontal: {
    position: 'absolute',
    bottom: 22,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  bookShadow: {
    position: 'absolute',
    bottom: 22,
    width: 92,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(8, 28, 74, 0.34)',
  },
});
