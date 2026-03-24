import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

type ScreenProps = PropsWithChildren<{
  padded?: boolean;
}>;

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#020617' }}>
      <ScrollView
        className="flex-1"
        style={{ flex: 1, backgroundColor: '#020617' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className={padded ? 'flex-1 px-6 py-8' : 'flex-1'}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
