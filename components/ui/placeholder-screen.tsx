import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from './screen';

type PlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderScreen({ eyebrow, title, description }: PlaceholderScreenProps) {
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.iconBadge}>
          <Text style={styles.iconGlyph}>✢</Text>
        </View>

        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Link href="/(tabs)" style={styles.link}>
          ወደ መነሻ ተመለስ
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    marginBottom: 24,
  },
  iconGlyph: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
  },
  eyebrow: {
    color: '#7DD3FC',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 28,
  },
  link: {
    color: '#F8FAFC',
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    overflow: 'hidden',
    fontWeight: '700',
  },
});
