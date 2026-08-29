import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { COUNTRIES } from "../constants/data";
import { useUser } from "../context/UserContext";

export default function LoginScreen({ navigation }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const { setProfile } = useUser();

  const canSubmit = phoneNumber.trim().length >= 7 && password.trim().length >= 6;

  function handleLogin() {
    setProfile((current) => ({
      ...(current || {}),
      name: current?.name || "Welcome back",
      role: current?.role || "Member",
      phone: `${selectedCountry.code} ${phoneNumber}`,
      country: selectedCountry.label,
      countryCode: selectedCountry.code,
      available: true,
    }));

    navigation.navigate("ProfileCreated");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>WELCOME BACK</Text>
      <Text style={styles.title}>Sign in to your account</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Phone number</Text>
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
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        disabled={!canSubmit}
        onPress={handleLogin}
        style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.45 }]}
      >
        <Text style={styles.submitBtnText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp", { role: "Hirer" })} style={styles.secondaryLink}>
        <Text style={styles.secondaryLinkText}>Need an account? Create one</Text>
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
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
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
  secondaryLink: {
    marginTop: 18,
    alignItems: "center",
  },
  secondaryLinkText: {
    color: colors.textSecondary,
    textDecorationLine: "underline",
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
