import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { colors } from "../constants/theme";

// Uses our own generated illustration (sax + drum kit, gold silhouette)
// as a full-screen background — no licensing risk, already in the project.
export default function LandingScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/images/landing-bg-real.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay so text stays readable over the illustration */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Lineup</Text>
          <Text style={styles.tagline}>
            Book musicians, sound engineers & MCs for your event
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("SignUp", { role: "Hirer" })}
          >
            <Text style={styles.primaryButtonText}>I want to hire talent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("SignUp", { role: "Musician" })}
          >
            <Text style={styles.secondaryButtonText}>I'm a performer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            onPress={() => navigation.navigate("SignUp", { role: "Sound Engineer / MC" })}
          >
            <Text style={styles.tertiaryButtonText}>I am a Sound Engineer / MC</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,17,15,0.82)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonGroup: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 14,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  tertiaryButton: {
    borderWidth: 1.5,
    borderColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "rgba(217,164,65,0.08)",
  },
  tertiaryButtonText: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: "underline",
  },
});
