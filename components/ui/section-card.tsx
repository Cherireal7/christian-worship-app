import { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type SectionCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <View className="rounded-[28px] border border-white/10 bg-slate-900 p-6">
      <Text className="text-xs font-semibold uppercase tracking-[2.5px] text-cyan-400">
        {eyebrow}
      </Text>
      <Text className="mt-3 text-2xl font-bold text-white">{title}</Text>
      <Text className="mt-2 text-sm leading-6 text-slate-300">
        {description}
      </Text>
      <View className="mt-5">{children}</View>
    </View>
  );
}
