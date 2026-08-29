import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";

// Simple confirmation for Story 1. Story 3 replaces the button below
// with real navigation into the Discover tab.
export default function ProfileCreatedScreen() {
  const { profile } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.title}>You're all set, {profile?.name || "there"}</Text>
      <Text style={styles.subtitle}>
        {profile?.role === "Hirer"
          ? "Your organizer account is ready. Discover and gig-posting come in the next story."
          : "Your profile is saved. Discovery and messaging come in the next story."}
      </Text>

      <View style={styles.card}>
        <Row label="Role" value={profile?.role} />
        {profile?.skills?.length > 0 && <Row label="Skills" value={profile.skills.join(", ")} />}
        {profile?.country ? <Row label="Country" value={profile.country} /> : null}
        {profile?.phone ? <Row label="Phone" value={profile.phone} /> : null}
        {profile?.location ? <Row label="Location" value={profile.location} /> : null}
        {profile?.rate ? <Row label="Rate" value={profile.rate} /> : null}
      </View>
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
});
