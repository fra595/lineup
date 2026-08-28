import React, { createContext, useContext, useState } from "react";

// Holds the current user's profile in memory for now.
// No backend yet — this gets replaced by real auth/storage in a later story.
// Every screen that needs the profile reads it via useUser() instead of props drilling.

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return ctx;
}
