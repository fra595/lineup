import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// A single conversation between the current user and one other person,
// optionally tied to a specific gig. Polls for new messages every few
// seconds — good enough for now, real-time subscriptions can replace
// this later without changing the screen's design.
export default function ChatScreen({ route, navigation }) {
  const { otherPersonId, otherPersonName, gigId } = route.params;
  const { profile } = useUser();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  async function fetchMessages() {
    if (!profile?.id) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${profile.id},recipient_id.eq.${otherPersonId}),and(sender_id.eq.${otherPersonId},recipient_id.eq.${profile.id})`
      )
      .order("created_at", { ascending: true });

    if (!error) setMessages(data || []);
  }

  async function sendMessage() {
    if (!draft.trim() || !profile?.id) return;
    const text = draft.trim();
    setDraft("");

    await supabase.from("messages").insert({
      gig_id: gigId || null,
      sender_id: profile.id,
      recipient_id: otherPersonId,
      body: text,
    });

    fetchMessages();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: colors.textSecondary }}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerName}>{otherPersonName}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.sender_id === profile?.id;
          return (
            <View style={[styles.bubbleRow, { justifyContent: mine ? "flex-end" : "flex-start" }]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>{item.body}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Say hello — this is the start of your conversation.</Text>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 14,
  },
  backBtn: {},
  headerName: { color: colors.textPrimary, fontSize: 16, fontWeight: "700" },
  bubbleRow: { flexDirection: "row", marginBottom: 8 },
  bubble: { maxWidth: "78%", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 14 },
  bubbleMine: { backgroundColor: colors.gold, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: colors.surfaceAlt, borderBottomLeftRadius: 4 },
  bubbleTextMine: { color: colors.background, fontSize: 13 },
  bubbleTextTheirs: { color: colors.textPrimary, fontSize: 13 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 30 },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  sendBtnText: { color: colors.background, fontWeight: "700", fontSize: 13 },
});