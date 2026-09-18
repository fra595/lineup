import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";

// Simple confirmation screen after sign-up, then straight into the
// real app via the bottom tab bar (MainTabs).
export default function ProfileCreatedScreen({ navigation }) {
  const { profile } = useUser();
  const isHirer = profile?.role === "Hirer";

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.title}>You're all set, {profile?.name || "there"}</Text>
      <Text style={styles.subtitle}>
        {isHirer
          ? "Your organizer account is ready to go."
          : "Your profile is saved and ready to go."}
      </Text>

      <View style={styles.card}>
        <Row label="Role" value={profile?.role} />
        {profile?.skills?.length > 0 && <Row label="Skills" value={profile.skills.join(", ")} />}
        {profile?.location ? <Row label="Location" value={profile.location} /> : null}
        {profile?.rate ? <Row label="Rate" value={profile.rate} /> : null}
      </View>

      <TouchableOpacity style={styles.photoBtn} onPress={() => navigation.navigate("MainTabs")}>
        <Text style={styles.photoBtnText}>Continue to Lineup</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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
  check: {
    fontSize: 40,
    color: colors.gold,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13.5,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: { color: colors.textMuted, fontSize: 12.5 },
  rowValue: { color: colors.textPrimary, fontSize: 12.5, fontWeight: "600" },
  photoBtn: {
    marginTop: 18,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    width: "100%",
  },
  photoBtnText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
  },
});