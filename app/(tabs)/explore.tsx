import { Text, View } from 'react-native';


import { Screen } from '../../components/ui/screen';

const sections = ['Morning Prayer', 'Evening Prayer', 'Creeds', 'Liturgy', 'Offline Hymns'];

export default function ExploreScreen() {
  return (
    <Screen>
      <View className="gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-sky-300">
            Explore
          </Text>
          <Text className="mt-3 text-3xl font-black text-white">
            Content groups for the guide
          </Text>
        </View>

        <View className="gap-3">
          {sections.map(item => (
            <View
              key={item}
              className="rounded-3xl border border-white/10 bg-slate-900 px-5 py-4"
            >
              <Text className="text-base font-medium text-slate-100">{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
