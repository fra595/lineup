import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { INSTRUMENTS, COUNTRIES } from "../constants/data";
import Chip from "../components/Chip";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Handles sign-up for every role. Musicians pick instruments from chips;
// Music Director / Sound Engineer / MC roles skip that step since the
// role itself is the skill. Hirers get a lighter form (no rate/skills).
// On submit, writes the profile into Supabase's `profiles` table.
// No phone verification yet — phone is saved as plain text for now,
// OTP verification comes back in a later story.
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
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 1 &&
    (isHirer || skills.length > 0) &&
    phoneNumber.trim().length >= 7 &&
    !isSubmitting;

  function toggleSkill(skill) {
    setSkills((s) => (s.includes(skill) ? s.filter((x) => x !== skill) : [...s, skill]));
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    const newProfile = {
      name,
      role,
      skills,
      location,
      rate,
      bio,
      phone: `${selectedCountry.code} ${phoneNumber}`,
      country: selectedCountry.label,
      country_code: selectedCountry.code,
      available: true,
    };

    const { data, error } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      Alert.alert(
        "Couldn't save your profile",
        "Something went wrong saving to the database. Please check your connection and try again.\n\n" + error.message
      );
      return;
    }

    // Keep it in local context too, so ProfileCreated can show it immediately
    setProfile(data);
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

      <Field label="Phone number">
        <View style={styles.phoneRow}>
          <TouchableOpacity style={styles.countryPicker} onPress={() => setShowCountryPicker(true)}>
            <Text style={styles.countryPickerText}>
              {selectedCountry.flag} {selectedCountry.code}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.phoneInput}
            placeholder="712 345 678"
            placeholderTextColor={colors.textMuted}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
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
        {isSubmitting ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.submitBtnText}>Create account</Text>
        )}
      </TouchableOpacity>

      <Modal visible={showCountryPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose your country</Text>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryOption}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.countryOptionText}>
                  {country.flag} {country.label} ({country.code})
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowCountryPicker(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryPicker: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 110,
  },
  countryPickerText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  countryOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  countryOptionText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  modalClose: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 10,
  },
  modalCloseText: {
    color: colors.gold,
    fontWeight: "600",
    fontSize: 14,
  },
});
