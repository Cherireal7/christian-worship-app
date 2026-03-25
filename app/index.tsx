import { useEffect } from "react";
import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ImageBackground
            source={require("../assets/images/cover.png")}
            style={styles.background}
            resizeMode="cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.overlay} />

            <View style={styles.content}>
              <Image
                  source={require("../assets/images/luthericon.png")}
                  style={styles.logo}
                  resizeMode="contain"
              />

              <Text style={styles.amharicTitle}>የአምልኮ መመሪያ</Text>
              <Text style={styles.subtitle}>የክርስቲያን አምልኮ መመሪያ</Text>
            </View>

            <View style={styles.bottomGlow} />
          </SafeAreaView>
        </ImageBackground>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061D63",
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 20, 77, 0.68)",
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    zIndex: 2,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 26,
  },
  amharicTitle: {
    fontSize: 30,
    lineHeight: 40,
    color: "#F3F0E8",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 0.4,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    color: "#F5F5F5",
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.95,
  },
  bottomGlow: {
    position: "absolute",
    bottom: -40,
    width: "130%",
    height: 220,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    backgroundColor: "rgba(219, 242, 255, 0.42)",
    opacity: 0.9,
    zIndex: 1,
  },
});
