import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { colors, spacing, radius } from "../constants/theme";
import Chip from "../components/Chip";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Shows the signed-up user's own profile: photo upload, details, an
// Available/Booked toggle, and a self-service "Show us your sound"
// portfolio — musicians add a video link per skill they claim, visible
// to anyone browsing, instead of the app owner manually reviewing each one.
export default function ProfileScreen() {
  const { profile, setProfile } = useUser();
  const [uploading, setUploading] = useState(false);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [newVideoSkill, setNewVideoSkill] = useState(null);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);

  if (!profile) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No profile yet — sign up first.</Text>
      </View>
    );
  }

  const isHirer = profile.role === "Hirer";
  const portfolio = profile.portfolio || [];

  async function toggleAvailability() {
    setTogglingAvailability(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ available: !profile.available })
      .eq("id", profile.id)
      .select()
      .single();

    setTogglingAvailability(false);
    if (error) {
      Alert.alert("Couldn't update status", error.message);
      return;
    }
    setProfile(data);
  }

  async function addPortfolioVideo() {
    if (!newVideoSkill || !newVideoUrl.trim()) {
      Alert.alert("Missing info", "Pick a skill and paste a video link first.");
      return;
    }

    setAddingVideo(true);
    const updatedPortfolio = [...portfolio, { skill: newVideoSkill, url: newVideoUrl.trim() }];

    const { data, error } = await supabase
      .from("profiles")
      .update({ portfolio: updatedPortfolio })
      .eq("id", profile.id)
      .select()
      .single();

    setAddingVideo(false);

    if (error) {
      Alert.alert("Couldn't add video", error.message);
      return;
    }

    setProfile(data);
    setNewVideoSkill(null);
    setNewVideoUrl("");
  }

  async function removePortfolioVideo(index) {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index);
    const { data, error } = await supabase
      .from("profiles")
      .update({ portfolio: updatedPortfolio })
      .eq("id", profile.id)
      .select()
      .single();

    if (!error) setProfile(data);
  }

  async function pickAndUploadPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to add a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const mimeType = asset.mimeType || "image/jpeg";
      const fileExt = mimeType.split("/")[1]?.split("+")[0] || "jpg";
      const filePath = `${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(asset.base64), {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const photoUrl = publicUrlData.publicUrl;

      const { data: updated, error: updateError } = await supabase
        .from("profiles")
        .update({ photo_url: photoUrl })
        .eq("id", profile.id)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(updated);
    } catch (err) {
      Alert.alert("Upload failed", err.message || "Something went wrong uploading your photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickAndUploadPhoto} style={styles.avatarWrap} disabled={uploading}>
        {profile.photo_url ? (
          <Image source={{ uri: profile.photo_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <View style={styles.avatarBadge}>
          {uploading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Text style={styles.avatarBadgeText}>+</Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.name}>{profile.name}</Text>
      <Text style={styles.role}>{profile.role}</Text>

      <View style={styles.card}>
        {profile.skills?.length > 0 && <Row label="Skills" value={profile.skills.join(", ")} />}
        {profile.location ? <Row label="Location" value={profile.location} /> : null}
        {profile.rate ? <Row label="Rate" value={profile.rate} /> : null}
        {profile.phone ? <Row label="Phone (private, not shown to others)" value={profile.phone} /> : null}
        {profile.bio ? <Row label="Bio" value={profile.bio} /> : null}
      </View>

      {!isHirer && (
        <View style={styles.availabilityRow}>
          <Text style={styles.availabilityLabel}>
            {profile.available ? "Available for bookings" : "Currently booked"}
          </Text>
          {togglingAvailability ? (
            <ActivityIndicator size="small" color={colors.gold} />
          ) : (
            <Switch
              value={!!profile.available}
              onValueChange={toggleAvailability}
              trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
              thumbColor={colors.textPrimary}
            />
          )}
        </View>
      )}

      {!isHirer && (
        <View style={styles.portfolioSection}>
          <Text style={styles.sectionTitle}>Show us your sound</Text>
          <Text style={styles.sectionSubtitle}>
            Add a video link for each skill you play — visible to anyone browsing your profile.
          </Text>

          {portfolio.map((entry, index) => (
            <View key={index} style={styles.videoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.videoSkill}>{entry.skill}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(entry.url)}>
                  <Text style={styles.videoLink} numberOfLines={1}>{entry.url}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removePortfolioVideo(index)}>
                <Text style={styles.removeBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.chipRow}>
            {(profile.skills || []).map((skill) => (
              <Chip
                key={skill}
                label={skill}
                active={newVideoSkill === skill}
                onPress={() => setNewVideoSkill(skill)}
              />
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Paste a YouTube, Instagram, or TikTok link..."
            placeholderTextColor={colors.textMuted}
            value={newVideoUrl}
            onChangeText={setNewVideoUrl}
          />

          <TouchableOpacity style={styles.addBtn} onPress={addPortfolioVideo} disabled={addingVideo}>
            {addingVideo ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text style={styles.addBtnText}>Add video</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", padding: spacing.lg, paddingTop: 50 },
  emptyState: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textMuted, fontSize: 14 },
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: { backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  avatarInitials: { color: colors.gold, fontSize: 32, fontWeight: "700" },
  avatarBadge: { position: "absolute", bottom: 2, right: 2, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.background },
  avatarBadgeText: { color: colors.background, fontSize: 18, fontWeight: "700", lineHeight: 20 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: "700" },
  role: { color: colors.gold, fontSize: 13, marginTop: 2, marginBottom: 20 },
  card: { width: "100%", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16 },
  row: { marginBottom: 12 },
  rowLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 2 },
  rowValue: { color: colors.textPrimary, fontSize: 14 },
  availabilityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: 16, padding: 14, backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
  availabilityLabel: { color: colors.textPrimary, fontSize: 13 },
  portfolioSection: { width: "100%", marginTop: 20 },
  sectionTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: 4 },
  sectionSubtitle: { color: colors.textMuted, fontSize: 12, marginBottom: 12, lineHeight: 17 },
  videoRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, marginBottom: 8 },
  videoSkill: { color: colors.gold, fontSize: 12.5, fontWeight: "700" },
  videoLink: { color: colors.textSecondary, fontSize: 11.5, marginTop: 2, textDecorationLine: "underline" },
  removeBtn: { color: colors.red, fontSize: 11.5, fontWeight: "600", marginLeft: 10 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.textPrimary, fontSize: 13, marginBottom: 10 },
  addBtn: { backgroundColor: colors.gold, borderRadius: radius.md, padding: 13, alignItems: "center" },
  addBtnText: { color: colors.background, fontWeight: "700", fontSize: 13 },
});