import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../constants/theme";

// Placeholder screen for Story 0.
// This gets replaced by the real Landing/Discover flow in later stories.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lineup</Text>
      <Text style={styles.subtitle}>Scaffold is working. Next story replaces this screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  title: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
