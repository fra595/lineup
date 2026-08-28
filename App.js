import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </UserProvider>
  );
}
