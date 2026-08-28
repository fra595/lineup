import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { INSTRUMENTS } from "../constants/data";
import Chip from "../components/Chip";
import { useUser } from "../context/UserContext";

// Handles sign-up for every role. Musicians pick instruments from chips;
// Music Director / Sound Engineer / MC roles skip that step since the
// role itself is the skill. Hirers get a lighter form (no rate/skills).
export default function SignUpScreen({ route, navigation }) {
  const { role } = route.params;
  const isHirer = role === "Hirer";
  const isMusician = role === "Musician";
  const { setProfile } = useUser();

  const [name, setName] = useState("");
  const [skills, setSkills] = useState(isMusician ? [] : [role]);
  const [location, setLocation] = useState("");
  const [rate, setRate] = useState("");
  const [bio, setBio] = useState("");

  const canSubmit = name.trim().length > 1 && (isHirer || skills.length > 0);

  function toggleSkill(skill) {
    setSkills((s) => (s.includes(skill) ? s.filter((x) => x !== skill) : [...s, skill]));
  }

  function handleSubmit() {
    setProfile({ name, role, skills, location, rate, bio, available: true });
    navigation.navigate("ProfileCreated");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>{isHirer ? "EVENT ORGANIZER" : role.toUpperCase()}</Text>
      <Text style={styles.title}>{isHirer ? "Set up your account" : "Build your profile"}</Text>

      <Field label="Full name">
        <TextInput
          style={styles.input}
          placeholder="e.g. Tobi Adewale"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </Field>

      {isMusician && (
        <Field label="Instruments you play">
          <View style={styles.chipRow}>
            {INSTRUMENTS.map((i) => (
              <Chip key={i} label={i} active={skills.includes(i)} onPress={() => toggleSkill(i)} />
            ))}
          </View>
        </Field>
      )}

      <Field label="Location">
        <TextInput
          style={styles.input}
          placeholder="e.g. Nairobi"
          placeholderTextColor={colors.textMuted}
          value={location}
          onChangeText={setLocation}
        />
      </Field>

      {!isHirer && (
        <Field label="Rate per event">
          <TextInput
            style={styles.input}
            placeholder="e.g. KES 15,000/event"
            placeholderTextColor={colors.textMuted}
            value={rate}
            onChangeText={setRate}
          />
        </Field>
      )}

      <Field label={isHirer ? "Tell musicians about you" : "Short bio"}>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder={isHirer ? "e.g. I organize weddings across Nairobi..." : "Session drummer, gospel & afrobeat..."}
          placeholderTextColor={colors.textMuted}
          value={bio}
          onChangeText={setBio}
          multiline
        />
      </Field>

      <TouchableOpacity
        disabled={!canSubmit}
        onPress={handleSubmit}
        style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.45 }]}
      >
        <Text style={styles.submitBtnText}>Create account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, children }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: { marginBottom: 14 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2.5,
    color: colors.gold,
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    color: colors.textPrimary,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  submitBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
  },
});
