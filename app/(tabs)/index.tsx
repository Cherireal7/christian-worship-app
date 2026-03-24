import { Text, View } from 'react-native';

import { Screen } from '../../components/ui/screen';

export default function LibraryHomeScreen() {
  return (
    <Screen>
      <View className="gap-5">
        <Text className="text-sm font-semibold uppercase tracking-[3px] text-sky-300">
          Worship Library
        </Text>
        <Text className="text-4xl font-black tracking-tight text-white">
          Hymns, prayers, and sacred texts will live here.
        </Text>
        <Text className="max-w-xl text-base leading-7 text-slate-300">
          This is the post-onboarding landing screen. Next, we can build the
          hymn categories, prayer collections, and liturgy reading views.
        </Text>
      </View>
    </Screen>
  );
}
