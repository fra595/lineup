import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing } from "../constants/theme";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 50 },
  backBtn: { marginBottom: 20 },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
});