import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";

// Simple confirmation screen after sign-up. Routes hirers to Discover
// and Post a Gig, musicians to Browse Gigs, plus a shared profile link
// and messages link for everyone.
export default function ProfileCreatedScreen({ navigation }) {
  const { profile } = useUser();
  const isHirer = profile?.role === "Hirer";

  return (
    <View style={styles.container}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.title}>You're all set, {profile?.name || "there"}</Text>
      <Text style={styles.subtitle}>
        {isHirer
          ? "Your organizer account is ready. Discover talent, post a gig, or check your messages."
          : "Your profile is saved. Browse open gigs or check your messages anytime."}
      </Text>

      <View style={styles.card}>
        <Row label="Role" value={profile?.role} />
        {profile?.skills?.length > 0 && <Row label="Skills" value={profile.skills.join(", ")} />}
        {profile?.location ? <Row label="Location" value={profile.location} /> : null}
        {profile?.rate ? <Row label="Rate" value={profile.rate} /> : null}
      </View>

      <TouchableOpacity style={styles.photoBtn} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.photoBtnText}>View my profile & add a photo</Text>
      </TouchableOpacity>

      {isHirer ? (
        <>
          <TouchableOpacity
            style={[styles.photoBtn, styles.outlineBtn]}
            onPress={() => navigation.navigate("Discover")}
          >
            <Text style={[styles.photoBtnText, { color: colors.gold }]}>Discover talent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.photoBtn, styles.outlineBtn]}
            onPress={() => navigation.navigate("PostGig")}
          >
            <Text style={[styles.photoBtnText, { color: colors.gold }]}>Post a gig</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={[styles.photoBtn, styles.outlineBtn]}
          onPress={() => navigation.navigate("BrowseGigs")}
        >
          <Text style={[styles.photoBtnText, { color: colors.gold }]}>Browse open gigs</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.photoBtn, styles.outlineBtn]}
        onPress={() => navigation.navigate("Messages")}
      >
        <Text style={[styles.photoBtnText, { color: colors.gold }]}>Messages</Text>
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
    marginTop: 10,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    width: "100%",
  },
  outlineBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.gold,
  },
  photoBtnText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
  },
});