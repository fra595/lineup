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
import { EVENT_TYPES, INSTRUMENTS, COUNTRIES } from "../constants/data";
import Chip from "../components/Chip";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

const ROLE_OPTIONS = [...INSTRUMENTS, "Music Director", "Sound Engineer", "MC / Host"];

export default function PostGigScreen({ navigation }) {
  const { profile } = useUser();

  const [eventType, setEventType] = useState(null);
  const [customEventType, setCustomEventType] = useState("");
  const [showCustomEventInput, setShowCustomEventInput] = useState(false);

  const [rolesNeeded, setRolesNeeded] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [contactName, setContactName] = useState(profile?.name || "");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [contactPhone, setContactPhone] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalEventType = eventType === "Other" ? customEventType.trim() : eventType;

  const canSubmit =
    finalEventType &&
    rolesNeeded.length > 0 &&
    eventDate.trim().length > 0 &&
    contactName.trim().length > 1 &&
    contactPhone.trim().length >= 7 &&
    !isSubmitting;

  function toggleRole(role) {
    setRolesNeeded((r) => (r.includes(role) ? r.filter((x) => x !== role) : [...r, role]));
  }

  function pickEventType(type) {
    if (type === "Other") {
      setEventType("Other");
      setShowCustomEventInput(true);
    } else {
      setEventType(type);
      setShowCustomEventInput(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    const { error } = await supabase.from("gigs").insert({
      posted_by: profile?.id || null,
      event_type: finalEventType,
      role_needed: rolesNeeded,
      event_date: eventDate,
      location,
      budget: budget ? `${selectedCountry.currency} ${budget}` : "",
      contact_name: contactName,
      contact_phone: `${selectedCountry.code} ${contactPhone}`,
    });

    setIsSubmitting(false);

    if (error) {
      Alert.alert("Couldn't post your gig", error.message);
      return;
    }

    Alert.alert("Gig posted!", "Musicians can now find and message you about this gig.");
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>NEW GIG</Text>
      <Text style={styles.title}>Post a gig</Text>

      <Field label="Event type">
        <View style={styles.chipRow}>
          {EVENT_TYPES.map((type) => (
            <Chip key={type} label={type} active={eventType === type} onPress={() => pickEventType(type)} />
          ))}
          <Chip label="+ Other" active={eventType === "Other"} onPress={() => pickEventType("Other")} />
        </View>
        {showCustomEventInput && (
          <TextInput
            style={[styles.input, { marginTop: 8 }]}
            placeholder="Type your event type..."
            placeholderTextColor={colors.textMuted}
            value={customEventType}
            onChangeText={setCustomEventType}
          />
        )}
      </Field>

      <Field label="Role(s) needed">
        <View style={styles.chipRow}>
          {ROLE_OPTIONS.map((role) => (
            <Chip key={role} label={role} active={rolesNeeded.includes(role)} onPress={() => toggleRole(role)} />
          ))}
        </View>
      </Field>

      <Field label="Date needed">
        <TextInput
          style={styles.input}
          placeholder="e.g. 14 Dec 2026"
          placeholderTextColor={colors.textMuted}
          value={eventDate}
          onChangeText={setEventDate}
        />
      </Field>

      <Field label="Location">
        <TextInput
          style={styles.input}
          placeholder="e.g. Westlands, Nairobi"
          placeholderTextColor={colors.textMuted}
          value={location}
          onChangeText={setLocation}
        />
      </Field>

      <Field label={`Budget (${selectedCountry.currency})`}>
        <TextInput
          style={styles.input}
          placeholder="e.g. 20,000"
          placeholderTextColor={colors.textMuted}
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </Field>

      <Text style={styles.contactNote}>
        Contact details — shown publicly on this gig posting so musicians can reach you
      </Text>

      <Field label="Your name">
        <TextInput
          style={styles.input}
          placeholder="e.g. Frank Otieno"
          placeholderTextColor={colors.textMuted}
          value={contactName}
          onChangeText={setContactName}
        />
      </Field>

      <Field label="Contact phone">
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
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
        </View>
      </Field>

      <TouchableOpacity
        disabled={!canSubmit}
        onPress={handleSubmit}
        style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.45 }]}
      >
        {isSubmitting ? <ActivityIndicator color={colors.background} /> : <Text style={styles.submitBtnText}>Post gig</Text>}
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
  eyebrow: { fontSize: 12, letterSpacing: 2.5, color: colors.gold, fontWeight: "600" },
  title: { fontSize: 26, color: colors.textPrimary, fontWeight: "700", marginTop: 4, marginBottom: 18 },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 6, fontWeight: "500" },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  contactNote: {
    fontSize: 12,
    color: colors.textMuted,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 14,
    marginBottom: 14,
  },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  countryPicker: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minWidth: 110,
  },
  countryPickerText: { color: colors.textPrimary, fontWeight: "600", fontSize: 14 },
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
  submitBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: 14, alignItems: "center", marginTop: 8 },
  submitBtnText: { color: colors.background, fontWeight: "700", fontSize: 14 },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: 24 },
  modalContent: { backgroundColor: colors.background, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 18 },
  modalTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: "700", marginBottom: 12 },
  countryOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  countryOptionText: { color: colors.textPrimary, fontSize: 15 },
  modalClose: { marginTop: 14, alignItems: "center", paddingVertical: 10 },
  modalCloseText: { color: colors.gold, fontWeight: "600", fontSize: 14 },
});