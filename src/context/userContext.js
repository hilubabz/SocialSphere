"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserDataProvider({ children }) {
	const [userData, setUserData] = useState({});

	return (
		<UserContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserData() {
	return useContext(UserContext);
}