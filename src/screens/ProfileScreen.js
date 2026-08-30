import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { colors, spacing, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

// Shows the signed-up user's own profile, with the ability to add/change
// a profile photo. Photo is uploaded to Supabase Storage (bucket: "avatars"),
// and the public URL is saved on the profiles row.
export default function ProfileScreen() {
  const { profile, setProfile } = useUser();
  const [uploading, setUploading] = useState(false);

  if (!profile) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No profile yet — sign up first.</Text>
      </View>
    );
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
      // Use mimeType to determine the extension — asset.uri on web is a
      // "data:image/jpeg;base64,...." blob, not a real file path, so we
      // can't parse an extension out of it the way we can on native.
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

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

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
        {profile.phone ? <Row label="Phone" value={profile.phone} /> : null}
        {profile.bio ? <Row label="Bio" value={profile.bio} /> : null}
      </View>

      <View style={styles.availabilityRow}>
        <Text style={styles.availabilityLabel}>
          {profile.available ? "Available for bookings" : "Currently booked"}
        </Text>
        <View style={[styles.dot, { backgroundColor: profile.available ? colors.gold : colors.textMuted }]} />
      </View>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: 50,
  },
  emptyState: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarInitials: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: "700",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarBadgeText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  role: {
    color: colors.gold,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
  },
  row: {
    marginBottom: 12,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  rowValue: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
  },
  availabilityLabel: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});