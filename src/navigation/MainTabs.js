import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import DiscoverScreen from "../screens/DiscoverScreen";
import PostGigScreen from "../screens/PostGigScreen";
import BrowseGigsScreen from "../screens/BrowseGigsScreen";
import MessagesScreen from "../screens/MessagesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AccountMenu from "../components/AccountMenu";
import { useUser } from "../context/UserContext";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  return (
    <Text style={{ fontSize: 10, color: focused ? colors.gold : colors.textMuted, fontWeight: focused ? "700" : "400" }}>
      {label}
    </Text>
  );
}

export default function MainTabs() {
  const { profile } = useUser();
  const isHirer = profile?.role === "Hirer";

  const tabScreenOptions = ({ navigation }) => ({
    headerShown: true,
    headerStyle: { backgroundColor: colors.background },
    headerShadowVisible: false,
    headerTitleStyle: { color: colors.textPrimary, fontSize: 16 },
    headerTitle: "Lineup",
    headerRight: () => <AccountMenu navigation={navigation} />,
    tabBarStyle: {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
      height: 60,
      paddingTop: 6,
      paddingBottom: 8,
    },
    tabBarShowLabel: false,
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      {isHirer ? (
        <>
          <Tab.Screen
            name="Discover"
            component={DiscoverScreen}
            options={{ tabBarIcon: ({ focused }) => <TabIcon label="Discover" focused={focused} /> }}
          />
          <Tab.Screen
            name="PostGig"
            component={PostGigScreen}
            options={{ tabBarIcon: ({ focused }) => <TabIcon label="Post Gig" focused={focused} /> }}
          />
        </>
      ) : (
        <Tab.Screen
          name="BrowseGigs"
          component={BrowseGigsScreen}
          options={{ tabBarIcon: ({ focused }) => <TabIcon label="Gigs" focused={focused} /> }}
        />
      )}

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Messages" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}