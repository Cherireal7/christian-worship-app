import { Link } from 'expo-router';
import { Text, View } from 'react-native';

function LutherSeal() {
  return (
    <View className="items-center justify-center">
      <View className="h-56 w-56 items-center justify-center rounded-full border border-white/40 bg-slate-900/20">
        <View className="h-48 w-48 items-center justify-center rounded-full border border-white/30">
          <View className="h-36 w-36 items-center justify-center rounded-full border border-white/20">
            <View className="h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-slate-900/40">
              <View className="h-10 w-2 rounded-full bg-white" />
              <View className="absolute h-2 w-10 rounded-full bg-white" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function SplashScreen() {
  return (
    <View className="flex-1 overflow-hidden bg-[#0B143B]">
      <View className="absolute inset-0 bg-slate-950/25" />
      <View className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />
      <View className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-slate-100/20 blur-3xl" />
      <View className="absolute inset-x-0 top-24 items-center opacity-20">
        <View className="h-96 w-64 rounded-[120px] bg-slate-100/20" />
      </View>

      <View className="flex-1 items-center justify-center px-8 pb-20 pt-16">
        <View className="mb-10 opacity-95">
          <LutherSeal />
        </View>

        <Text className="text-center text-4xl font-black tracking-tight text-white">
          Lutheran Worship Guide
        </Text>
        <Text className="mt-4 max-w-xs text-center text-base leading-7 text-slate-200">
          Hymns, sacred texts, and prayer guidance for personal devotion and
          congregational worship.
        </Text>

        <Link
          href="/onboarding"
          className="mt-12 rounded-2xl bg-[#3E68C1] px-10 py-4 text-center text-lg font-semibold text-white"
        >
          Enter Guide
        </Link>
      </View>
    </View>
  );
}
