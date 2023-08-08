import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userPhoto, setUserPhoto] = useState("");

  return (
    <UserContext.Provider value={{ userPhoto, setUserPhoto }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}