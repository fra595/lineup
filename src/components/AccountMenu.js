import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { colors, radius } from "../constants/theme";
import { useUser } from "../context/UserContext";

// Small avatar button in the header that opens a dropdown-style menu:
// My Profile, Settings, Notifications, Log out.
export default function AccountMenu({ navigation }) {
  const [open, setOpen] = useState(false);
  const { profile, setProfile } = useUser();

  function goToProfile() {
    setOpen(false);
    navigation.navigate("Profile");
  }

  function goToSettings() {
    setOpen(false);
    navigation.getParent()?.navigate("Settings");
  }

  function goToNotifications() {
    setOpen(false);
    navigation.getParent()?.navigate("Notifications");
  }

  function logOut() {
    setOpen(false);
    setProfile(null);
    navigation.getParent()?.reset({ index: 0, routes: [{ name: "Landing" }] });
  }

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.avatarBtn}>
        <Text style={styles.avatarBtnText}>
          {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "?"}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <MenuItem label="My profile" onPress={goToProfile} />
            <MenuItem label="Settings" onPress={goToSettings} />
            <MenuItem label="Notifications" onPress={goToNotifications} />
            <MenuItem label="Log out" onPress={logOut} danger />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function MenuItem({ label, onPress, danger }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={[styles.menuItemText, danger && { color: colors.red }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarBtnText: {
    color: colors.gold,
    fontWeight: "700",
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 14,
  },
  menu: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    width: 180,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    color: colors.textPrimary,
    fontSize: 13.5,
  },
});