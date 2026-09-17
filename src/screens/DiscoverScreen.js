import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { INSTRUMENTS } from "../constants/data";
import Chip from "../components/Chip";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Hirers browse real musicians here, pulled from the profiles table.
// Every card shows a photo (or initials if none uploaded), availability
// status, skills, location, and rate. Phone numbers are never shown —
// contact happens through in-app messaging only.
const FILTER_OPTIONS = ["All", ...INSTRUMENTS, "Music Director", "Sound Engineer", "MC / Host"];

export default function DiscoverScreen({ navigation }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("role", "Hirer")
      .order("created_at", { ascending: false });

    if (!error) setPeople(data || []);
    setLoading(false);
  }

  const filteredPeople = people.filter((person) => {
    const matchesFilter =
      activeFilter === "All" ||
      person.role === activeFilter ||
      (person.skills || []).includes(activeFilter);

    if (!matchesFilter) return false;

    if (!query.trim()) return true;
    const haystack = `${person.name} ${(person.skills || []).join(" ")} ${person.location}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  function messagePerson(person) {
    setSelectedPerson(null);
    navigation.navigate("Chat", {
      otherPersonId: person.id,
      otherPersonName: person.name,
      gigId: null,
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>DISCOVER</Text>
      <Text style={styles.title}>Find talent for your event</Text>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search name, instrument, city..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={FILTER_OPTIONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        style={{ marginTop: 12, marginBottom: 4, flexGrow: 0 }}
        renderItem={({ item }) => (
          <Chip label={item} active={activeFilter === item} onPress={() => setActiveFilter(item)} />
        )}
      />

      {loading ? (
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPeople}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No one matches yet — try a different search.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedPerson(item)}>
              {item.photo_url ? (
                <Image source={{ uri: item.photo_url }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitials}>
                    {item.name ? item.name.slice(0, 2).toUpperCase() : "?"}
                  </Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={[styles.dot, { backgroundColor: item.available ? colors.gold : colors.textMuted }]} />
                </View>
                <Text style={styles.cardSkills}>{(item.skills || []).join(", ") || item.role}</Text>
                <Text style={styles.cardLocation}>{item.location}</Text>
              </View>

              {item.rate ? <Text style={styles.cardRate}>{item.rate}</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selectedPerson} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPerson && (
              <>
                {selectedPerson.photo_url ? (
                  <Image source={{ uri: selectedPerson.photo_url }} style={styles.modalAvatar} />
                ) : (
                  <View style={[styles.modalAvatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitials}>
                      {selectedPerson.name ? selectedPerson.name.slice(0, 2).toUpperCase() : "?"}
                    </Text>
                  </View>
                )}

                <Text style={styles.modalName}>{selectedPerson.name}</Text>
                <Text style={styles.modalSkills}>
                  {(selectedPerson.skills || []).join(", ") || selectedPerson.role}
                </Text>

                {selectedPerson.bio ? <Text style={styles.modalBio}>{selectedPerson.bio}</Text> : null}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedPerson.location || "—"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Rate</Text>
                  <Text style={styles.detailValue}>{selectedPerson.rate || "Not specified"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>
                    {selectedPerson.available ? "Available" : "Currently booked"}
                  </Text>
                </View>

                <TouchableOpacity style={styles.messageBtn} onPress={() => messagePerson(selectedPerson)}>
                  <Text style={styles.messageBtnText}>Message {selectedPerson.name}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedPerson(null)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 50 },
  backBtn: { marginBottom: 14 },
  eyebrow: { fontSize: 12, letterSpacing: 2.5, color: colors.gold, fontWeight: "600" },
  title: { fontSize: 22, color: colors.textPrimary, fontWeight: "700", marginTop: 4, marginBottom: 14 },
  searchBar: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },
  searchInput: { color: colors.textPrimary, fontSize: 13 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 30 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarInitials: { color: colors.gold, fontWeight: "700", fontSize: 14 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardName: { color: colors.textPrimary, fontSize: 14.5, fontWeight: "700" },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  cardSkills: { color: colors.gold, fontSize: 12, marginTop: 2 },
  cardLocation: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  cardRate: { color: colors.gold, fontSize: 11.5, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: "center",
  },
  modalAvatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10 },
  modalName: { color: colors.textPrimary, fontSize: 19, fontWeight: "700" },
  modalSkills: { color: colors.gold, fontSize: 13, marginTop: 2, marginBottom: 10 },
  modalBio: { color: colors.textSecondary, fontSize: 12.5, textAlign: "center", marginBottom: 12, lineHeight: 18 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingVertical: 6 },
  detailLabel: { color: colors.textMuted, fontSize: 12.5 },
  detailValue: { color: colors.textPrimary, fontSize: 12.5, fontWeight: "600" },
  messageBtn: {
    marginTop: 16,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
    width: "100%",
  },
  messageBtnText: { color: colors.background, fontWeight: "700", fontSize: 14 },
  closeBtn: { marginTop: 10, padding: 12, alignItems: "center" },
  closeBtnText: { color: colors.textSecondary, fontWeight: "600", fontSize: 13 },
});