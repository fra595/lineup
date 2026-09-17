import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Lists every conversation the current user is part of, grouped by the
// other person, showing the most recent message. Tapping one opens ChatScreen.
export default function MessagesScreen({ navigation }) {
  const { profile } = useUser();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, []);

  async function fetchThreads() {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${profile.id},recipient_id.eq.${profile.id}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Group messages by "the other person" and keep only the most recent one per person.
      const grouped = {};
      for (const msg of data) {
        const otherId = msg.sender_id === profile.id ? msg.recipient_id : msg.sender_id;
        if (!grouped[otherId]) {
          grouped[otherId] = msg;
        }
      }
      const otherIds = Object.keys(grouped);

      let names = {};
      if (otherIds.length > 0) {
        const { data: people } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", otherIds);
        (people || []).forEach((p) => {
          names[p.id] = p.name;
        });
      }

      const list = otherIds.map((id) => ({
        otherPersonId: id,
        otherPersonName: names[id] || "Unknown",
        lastMessage: grouped[id].body,
        gigId: grouped[id].gig_id,
      }));
      setThreads(list);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>MESSAGES</Text>
      <Text style={styles.title}>Conversations</Text>

      {loading ? (
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={threads}
          keyExtractor={(item) => String(item.otherPersonId)}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No conversations yet — message someone from a gig or profile to start one.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.threadRow}
              onPress={() =>
                navigation.navigate("Chat", {
                  otherPersonId: item.otherPersonId,
                  otherPersonName: item.otherPersonName,
                  gigId: item.gigId,
                })
              }
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.otherPersonName ? item.otherPersonName.slice(0, 2).toUpperCase() : "?"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.threadName}>{item.otherPersonName}</Text>
                <Text style={styles.threadPreview} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, paddingTop: 50 },
  eyebrow: { fontSize: 12, letterSpacing: 2.5, color: colors.gold, fontWeight: "600" },
  title: { fontSize: 24, color: colors.textPrimary, fontWeight: "700", marginTop: 4, marginBottom: 16 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 30, lineHeight: 20 },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.gold, fontWeight: "700", fontSize: 13 },
  threadName: { color: colors.textPrimary, fontSize: 14.5, fontWeight: "700" },
  threadPreview: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});