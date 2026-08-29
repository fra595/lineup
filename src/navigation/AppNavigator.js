import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "../screens/LandingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileCreatedScreen from "../screens/ProfileCreatedScreen";
import { colors } from "../constants/theme";

const Stack = createNativeStackNavigator();

// Single source of truth for app navigation.
// Story 3 will add a bottom-tab navigator (Discover/Post/Messages/Profile)
// that ProfileCreated will route into instead of being a dead end.
const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.gold,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileCreated" component={ProfileCreatedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
