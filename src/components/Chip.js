import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../constants/theme";

// A single tappable chip. Used for instrument pickers, role pickers, filters.
export default function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12.5,
  },
  labelActive: {
    color: colors.background,
    fontWeight: "600",
  },
});
