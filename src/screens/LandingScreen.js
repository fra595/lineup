import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, spacing, radius } from "../constants/theme";

// First screen the user sees. Picking a role sends them to SignUp
// with that role pre-filled. "Hirer" is wired up but SignUp's hirer
// path is a placeholder until Story 2.
export default function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.eyebrow}>FIND YOUR NEXT ACT</Text>
        <Text style={styles.title}>
          Line<Text style={{ color: colors.gold }}>up</Text>
        </Text>
        <Text style={styles.subtitle}>
          Drummers, guitarists, keys, vocalists, MCs, music directors, sound engineers — booked
          for weddings, ceremonies, graduations and every stage in between.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("SignUp", { role: "Musician" })}
        >
          <Text style={styles.primaryBtnText}>I'm a musician — get booked</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.altBtn}
          onPress={() => navigation.navigate("SignUp", { role: "Music Director" })}
        >
          <Text style={styles.altBtnText}>I'm a director / engineer / MC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("SignUp", { role: "Hirer" })}
        >
          <Text style={styles.secondaryBtnText}>I'm hiring for an event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 13,
    letterSpacing: 3,
    color: colors.gold,
    marginBottom: 6,
    fontWeight: "600",
  },
  title: {
    fontSize: 44,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14.5,
    marginTop: 14,
    lineHeight: 21,
  },
  buttons: {
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
  },
  altBtn: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  altBtnText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  secondaryBtn: {
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.red,
  },
  secondaryBtnText: {
    color: colors.red,
    fontWeight: "600",
    fontSize: 14,
  },
});
