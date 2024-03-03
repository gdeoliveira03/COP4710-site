import React, { useState, createContext, useContext } from 'react';

// Create a context for user information
const UserContext = createContext();

// Provider component to provide user information to children
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => useContext(UserContext);
