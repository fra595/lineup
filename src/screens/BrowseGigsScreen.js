import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Musicians see open gigs posted by hirers here. Contact info is never
// shown publicly — tapping "Message" opens a real in-app conversation
// instead, so people can't skip the app once they've found each other.
export default function BrowseGigsScreen({ navigation }) {
  const { profile } = useUser();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    fetchGigs();
  }, []);

  async function fetchGigs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("gigs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGigs(data || []);
    setLoading(false);
  }

  const filteredGigs = gigs.filter((gig) => {
    if (!query.trim()) return true;
    const haystack = `${gig.event_type} ${(gig.role_needed || []).join(" ")} ${gig.location}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  function messageAboutGig(gig) {
    setSelectedGig(null);
    navigation.navigate("Chat", {
      otherPersonId: gig.posted_by,
      otherPersonName: gig.contact_name || "Organizer",
      gigId: gig.id,
    });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>OPEN GIGS</Text>
      <Text style={styles.title}>Find your next booking</Text>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by role, event type, city..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredGigs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 14, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No open gigs right now — check back soon.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedGig(item)}>
              <Text style={styles.cardEventType}>{item.event_type}</Text>
              <Text style={styles.cardRoles}>{(item.role_needed || []).join(", ")}</Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardMeta}>{item.location || "Location TBD"}</Text>
                <Text style={styles.cardMeta}>{item.event_date}</Text>
              </View>
              {item.budget ? <Text style={styles.cardBudget}>{item.budget}</Text> : null}
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={!!selectedGig} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGig && (
              <>
                <Text style={styles.modalEventType}>{selectedGig.event_type}</Text>
                <Text style={styles.modalRoles}>{(selectedGig.role_needed || []).join(", ")}</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{selectedGig.event_date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{selectedGig.location || "—"}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={styles.detailValue}>{selectedGig.budget || "Not specified"}</Text>
                </View>

                <TouchableOpacity style={styles.messageBtn} onPress={() => messageAboutGig(selectedGig)}>
                  <Text style={styles.messageBtnText}>Message {selectedGig.contact_name || "organizer"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedGig(null)}>
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
  title: { fontSize: 24, color: colors.textPrimary, fontWeight: "700", marginTop: 4, marginBottom: 16 },
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
  },
  cardEventType: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  cardRoles: { color: colors.gold, fontSize: 12.5, marginTop: 3, marginBottom: 8 },
  cardMetaRow: { flexDirection: "row", justifyContent: "space-between" },
  cardMeta: { color: colors.textMuted, fontSize: 11.5 },
  cardBudget: { color: colors.gold, fontSize: 12.5, fontWeight: "600", marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  modalEventType: { color: colors.textPrimary, fontSize: 20, fontWeight: "700" },
  modalRoles: { color: colors.gold, fontSize: 13, marginTop: 3, marginBottom: 16 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  detailLabel: { color: colors.textMuted, fontSize: 12.5 },
  detailValue: { color: colors.textPrimary, fontSize: 12.5, fontWeight: "600" },
  messageBtn: {
    marginTop: 16,
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    padding: 14,
    alignItems: "center",
  },
  messageBtnText: { color: colors.background, fontWeight: "700", fontSize: 14 },
  closeBtn: {
    marginTop: 10,
    padding: 12,
    alignItems: "center",
  },
  closeBtnText: { color: colors.textSecondary, fontWeight: "600", fontSize: 13 },
});