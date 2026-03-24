import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const slides = [
  {
    id: 'welcome',
    icon: '✝',
    title: 'Welcome to the Worship Guide',
    description:
      'Read hymns, prayers, and creeds anytime. Designed for quiet and focused worship.',
  },
  {
    id: 'hymns',
    icon: '♪',
    title: 'Hymns and Sacred Texts',
    description:
      'Browse hymns, creeds, and prayers in one place. Simple and easy to read during worship.',
  },
  {
    id: 'offline',
    icon: '▣',
    title: 'Worship Anywhere',
    description:
      'Access hymns and prayers even without internet. Your worship guide is always with you.',
  },
];

function IconBadge({ icon }: { icon: string }) {
  return (
    <View className="items-center justify-center">
      <View className="h-28 w-28 items-center justify-center rounded-[32px] border border-slate-900/10 bg-white/60">
        <Text className="text-6xl font-black text-slate-950">{icon}</Text>
      </View>
    </View>
  );
}

function Pagination({ activeIndex }: { activeIndex: number }) {
  return (
    <View className="mt-8 flex-row items-center justify-center gap-3">
      {slides.map((slide, index) => (
        <View
          key={slide.id}
          className={
            index === activeIndex
              ? 'h-3 w-3 rounded-full bg-white'
              : 'h-3 w-3 rounded-full bg-[#17397A]'
          }
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];
  const isLast = activeIndex === slides.length - 1;

  function goNext() {
    if (isLast) {
      router.replace('/(tabs)');
      return;
    }

    setActiveIndex(current => current + 1);
  }

  return (
    <View className="flex-1 overflow-hidden bg-[#E8F7FB]">
      <View className="absolute left-0 top-0 h-72 w-full bg-slate-50/90" />
      <View className="absolute bottom-0 left-0 right-0 h-[48%] bg-[#0D2E6A]" />
      <View className="absolute bottom-[26%] left-0 h-44 w-full -skew-y-[18deg] bg-[#1B5FA7]" />

      <View className="flex-1 px-7 pb-10 pt-8">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Back"
            className="h-10 w-10 items-center justify-center rounded-full"
            disabled={activeIndex === 0}
            onPress={() => setActiveIndex(current => Math.max(0, current - 1))}
          >
            <Text className={activeIndex === 0 ? 'text-slate-300' : 'text-2xl text-slate-950'}>
              ←
            </Text>
          </Pressable>

          <Link href="/(tabs)" className="text-base text-slate-700">
            Skip
          </Link>
        </View>

        <View className="flex-1 items-center justify-center">
          <IconBadge icon={slide.icon} />

          <Text className="mt-10 max-w-[260px] text-center text-4xl font-black leading-tight text-slate-950">
            {slide.title}
          </Text>
          <Text className="mt-6 max-w-[280px] text-center text-base leading-8 text-slate-700">
            {slide.description}
          </Text>
        </View>

        <Pagination activeIndex={activeIndex} />

        <Pressable
          className="mt-6 rounded-2xl bg-[#3E68C1] px-6 py-4"
          onPress={goNext}
        >
          <Text className="text-center text-2xl font-semibold text-white">
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
